from django.shortcuts import render
from pathlib import Path
import re
import html


def home(request):
	return render(request, 'main/index.html')


def about(request):
	return render(request, 'main/about.html')


def projects(request):
	return render(request, 'main/projects.html')


def insights(request):
	return render(request, 'main/insights.html')


def careers(request):
	return render(request, 'main/careers.html')


def contact(request):
	return render(request, 'main/contact.html')


def markets(request):
	return render(request, 'main/markets.html')


def news(request):
	return render(request, 'main/news.html')


def services(request):
	return render(request, 'main/services.html')


def search(request):
	"""Simple site-wide search that scans the app templates for the query.

	This is a lightweight fallback when you don't have models to search.
	It looks through `main/templates/main/*.html` and returns pages whose
	template source contains the query (case-insensitive).
	"""
	query = request.GET.get('q', '').strip()
	results = []
	if query:
		q = query.lower()
		templates_dir = Path(__file__).resolve().parent / 'templates' / 'main'
		if templates_dir.exists():
			for path in templates_dir.glob('*.html'):
				try:
					text = path.read_text(encoding='utf-8')
				except Exception:
					continue
				lower = text.lower()
				name = path.stem
				url = '/' if name == 'index' else f'/{name}/'
				_source_map = {
					'markets': 'Markets',
					'projects': 'Projects',
					'services': 'Services',
					'insights': 'Insights',
					'about': 'About',
					'careers': 'Careers',
					'news': 'News',
					'contact': 'Contact',
					'index': 'Home',
				}
				source = _source_map.get(name, name.capitalize())

				# Find <title>
				m_title = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
				page_title = m_title.group(1).strip() if m_title else source

				# Extract headings (h1-h3) with positions for context lookup
				headings = []
				for mh in re.finditer(r'<h([1-3])[^>]*>(.*?)</h\1>', text, re.IGNORECASE | re.DOTALL):
					h_text = re.sub(r'<[^>]+>', '', mh.group(2)).strip()
					headings.append({'pos': mh.start(), 'text': html.unescape(h_text)})

				score = 0
				chosen_title = None
				snippet = ''

				# Exact phrase in title tag -> highest relevance
				if q in page_title.lower():
					score += 50
					chosen_title = page_title

				# Search headings first for better contextual results
				for h in headings:
					if q in h['text'].lower():
						score += 40
						chosen_title = h['text']
						# snippet is the heading and small surrounding text
						snippet = h['text']
						break

				# If not matched in headings, search the body
				if chosen_title is None and q in lower:
					# find first occurrence
					idx = lower.find(q)
					# find nearest preceding heading to use as title
					prev_heading = None
					for h in reversed(headings):
						if h['pos'] <= idx:
							prev_heading = h['text']
							break
					if prev_heading:
						chosen_title = prev_heading
						score += 30
					else:
						# fall back to page title
						chosen_title = page_title
						score += 10

					# build a snippet around the match
					start = max(0, idx - 80)
					end = min(len(text), idx + 80)
					snippet = re.sub(r'<[^>]+>', '', text[start:end]).strip()

				# If nothing matched, attempt loose token matching (OR)
				if chosen_title is None:
					tokens = re.findall(r"\w{3,}", q)
					token_hits = 0
					for t in tokens:
						token_hits += lower.count(t)
					if token_hits > 0:
						chosen_title = page_title
						score += token_hits * 5
						snippet = re.sub(r'<[^>]+>', '', text[:160]).strip()

				if chosen_title and score > 0:
					results.append({
						'title': html.unescape(chosen_title),
						'url': url,
						'snippet': html.unescape(snippet),
						'source': source,
						'score': score,
					})

			# sort results by score descending, then by title
			results.sort(key=lambda r: (-r.get('score', 0), r.get('title', '')))
			# remove score before returning
			for r in results:
				r.pop('score', None)
	return render(request, 'main/search_results.html', {'query': query, 'results': results})

