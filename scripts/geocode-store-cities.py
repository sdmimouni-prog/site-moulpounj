"""City centres only, not shop coordinates. Cached and never geocoded in browser."""
import json,urllib.request,urllib.parse,concurrent.futures,subprocess
from pathlib import Path
stores=json.loads(Path('src/data/stores.json').read_text())
names=sorted(set(s['city'] for s in stores))
aliases={'Fes':'Fès','Sale':'Salé','Meknes':'Meknès','Tetouan':'Tétouan','Temara':'Témara','Beni Mellal':'Béni Mellal','Deroua':'Deroua','Had Soualem':'Soualem'}
def get(city):
 if city=='Had Soualem': return {'city':city,'label':city,'latitude':33.41972,'longitude':-7.85237,'precision':'city','source':'https://www.geodatos.net/en/coordinates/morocco/had-soualem'}
 url='https://geocoding-api.open-meteo.com/v1/search?'+urllib.parse.urlencode({'name':aliases.get(city,city),'count':10,'language':'fr','countryCode':'MA'})
 data=json.loads(subprocess.check_output(['curl','-Ls','--max-time','15','--retry','2',url]));results=[r for r in data.get('results',[]) if r.get('country_code')=='MA' and r.get('feature_code','').startswith('PPL')]
 if not results:return {'city':city,'unresolved':True,'source':url}
 r=max(results,key=lambda r:r.get('population',0))
 return {'city':city,'label':r['name'],'latitude':r['latitude'],'longitude':r['longitude'],'precision':'city','source':url,'geonamesId':r['id']}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(get,names))
Path('src/data/store-cities.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
