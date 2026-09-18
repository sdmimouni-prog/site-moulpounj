from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote,urljoin
import json
base=Path(__file__).resolve().parents[1];dist=base/'dist'
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.images=[];self.ids=set();self.title='';self.intitle=False;self.meta={}
 def handle_starttag(self,t,a):
  a=dict(a)
  if a.get('id'):self.ids.add(a['id'])
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if t=='img':self.images.append(a)
  if t=='title':self.intitle=True
  if t=='meta':self.meta[a.get('name')]=a.get('content')
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
 def handle_data(self,s):
  if self.intitle:self.title+=s
pages={}
for f in dist.rglob('index.html'):
 route='/'+str(f.parent.relative_to(dist));route='/' if route=='/.' else route
 p=Page();p.feed(f.read_text());pages[route]=p
issues=[];imagecount=0;linkcount=0
for route,p in pages.items():
 for im in p.images:
  u=urlparse(im.get('src',''))
  if u.scheme or u.netloc:continue
  imagecount+=1
  if not (dist/unquote(u.path).lstrip('/')).is_file():issues.append({'page':route,'type':'missing_image','src':im.get('src')})
  if 'alt' not in im:issues.append({'page':route,'type':'missing_alt','src':im.get('src')})
 for href in p.links:
  u=urlparse(urljoin('https://local.test'+route,href))
  if u.netloc!='local.test':continue
  linkcount+=1;path=unquote(u.path).rstrip('/') or '/'
  target=pages.get(path)
  if not target:
   if not (dist/path.lstrip('/')).is_file():issues.append({'page':route,'type':'missing_route','href':href})
  elif u.fragment and unquote(u.fragment) not in target.ids:issues.append({'page':route,'type':'missing_anchor','href':href})
seo=json.loads((base/'src/data/product-seo.json').read_text())
for entry in seo:
 p=pages.get(entry['path']);assert p
 assert p.title==entry['title'];assert p.meta.get('description')==entry['description'];assert p.meta.get('robots')=='noindex,nofollow'
assert len({e['title'] for e in seo})==14
report={'pages':len(pages),'product_pages':len(seo),'local_image_references':imagecount,'local_links':linkcount,'issues':issues,'seo_unique_titles':14,'indexing':'noindex retained','deployment':'not performed'}
(base/'migration/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2))
