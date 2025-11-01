from django.shortcuts import render
from pathlib import Path
import re


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
		templates_dir = Path(__file__).resolve().parent / 'templates' / 'main'
		if templates_dir.exists():
			for path in templates_dir.glob('*.html'):
				try:
					text = path.read_text(encoding='utf-8')
				except Exception:
					continue
				if query.lower() in text.lower():
					# get title tag if present
					m = re.search(r'<title>(.*?)</title>', text, re.IGNORECASE | re.DOTALL)
					title = m.group(1).strip() if m else path.stem.capitalize()
					# map filename to a likely URL path
					name = path.stem
					url = '/' if name == 'index' else f'/{name}/'
					# friendly source/page label
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
					# snippet around the match (strip tags)
					idx = text.lower().find(query.lower())
					start = max(0, idx - 80)
					end = min(len(text), idx + 80)
					snippet = re.sub(r'<[^>]+>', '', text[start:end]).strip()
					results.append({'title': title, 'url': url, 'snippet': snippet, 'source': source})
	return render(request, 'main/search_results.html', {'query': query, 'results': results})

