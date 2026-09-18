"""Import published store records only; Google URLs are search links, not GPS."""
import re,json,html,urllib.request
from pathlib import Path
raw=Path('/tmp/moul-stores.html').read_text()
records=[]
for index,chunk in enumerate(re.split(r'<div class="mp-sl-card" data-city="',raw)[1:],1):
 city=html.unescape(chunk.split('"',1)[0]); name=re.search(r'class="mp-sl-card-name">(.*?)</div>',chunk,re.S)
 spans=re.findall(r'class="mp-sl-info-row">.*?<span>(.*?)</span>',chunk,re.S)
 clean=lambda s:html.unescape(re.sub('<[^>]+>','',s)).strip()
 phone=re.search(r'href="(tel:[^"]+)"',chunk)
 maps=re.search(r'href="(https://maps(?:.google.com|.app.goo.gl)/[^\"]+)"',chunk)
 assert name and len(spans)==3 and phone and maps
 records.append({'id':f'mp-{index:02}', 'name':clean(name[1]),'city':city,'address':clean(spans[0]),'phone':clean(spans[1]),'telephoneUrl':phone[1],'hours':clean(spans[2]),'mapUrl':html.unescape(maps[1]),'source':'https://moulpounj.ma/nos-magasins/','coordinatePrecision':'unavailable'})
Path('src/data/stores.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(len(records),'stores;',sorted(set(x['city'] for x in records)))
