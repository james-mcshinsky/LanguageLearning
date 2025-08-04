import os
import re
import requests


def extract_stylesheet_links(html: str):
    pattern = re.compile(r'<link[^>]+rel=["\']stylesheet["\'][^>]*href=["\']([^"\']+)["\']', re.I)
    return pattern.findall(html)


def test_stylesheet_urls():
    repo_root = os.path.dirname(os.path.dirname(__file__))
    html_path = os.path.join(repo_root, 'live-index.html')
    with open(html_path, encoding='utf-8') as f:
        content = f.read()
    links = extract_stylesheet_links(content)
    assert links, "No stylesheet links found"
    for href in links:
        if href.startswith('http://') or href.startswith('https://'):
            resp = requests.head(href, allow_redirects=True, timeout=10)
            assert resp.status_code < 400, f"{href} returned {resp.status_code}"
        else:
            local_path = os.path.join(repo_root, href.lstrip('/'))
            assert os.path.exists(local_path), f"Local stylesheet not found: {href}"
