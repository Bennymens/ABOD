def about(request):
	return render(request, 'main/about.html')

from django.shortcuts import render

def projects(request):
	return render(request, 'main/projects.html')

def insights(request):
	return render(request, 'main/insights.html')

def search(request):
    query = request.GET.get('q', '')
    results = []
    if query:
        # Example: search in your models, e.g., News.objects.filter(title__icontains=query)
        # results = News.objects.filter(title__icontains=query)
        pass  # Replace with your actual search logic
    return render(request, 'main/search_results.html', {'query': query, 'results': results})

def home(request):
	return render(request, 'main/index.html')

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

