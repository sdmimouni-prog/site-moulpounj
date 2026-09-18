from pathlib import Path
import json
from urllib.parse import urlparse
base=Path(__file__).resolve().parents[1]
products=json.loads((base/'src/data/catalogue-source.json').read_text())
seo=[];routes=[]
for p in products:
 path='/produit/'+p['slug'];old=urlparse(p['sourceUrl']).path
 title=p['name']+' : prix et dimensions | Moul Pounj' if p['category']!='oreillers' else p['name']+' : prix et détails | Moul Pounj'
 desc=f"Découvrez {p['name']} : photos, {'dimensions et tarifs par variante' if p['variants'] else 'prix et détails du produit'}. Demandez conseil et confirmez la disponibilité auprès de Moul Pounj."
 seo.append({'id':p['id'],'path':path,'title':title,'description':desc,'canonicalPath':path})
 routes.append({'oldUrl':p['sourceUrl'],'oldPath':old,'newPath':path,'action':'preserve_path','note':'Même chemin hors slash final : aucune redirection vers soi-même. Normalisation du slash à configurer selon hébergement.'})
for old,new in [('/matelas-en-mousse/','/matelas?technologie=mousse'),('/matelas-a-ressorts-ensaches/','/matelas?technologie=ressorts')]:
 if any(urlparse(c['link']).path==old for p in products for c in p['categorySource']):routes.append({'oldPath':old,'newPath':new,'action':'proposed_301','evidence':'categorySource.link'})
for old,new in [('/salon-marocain/','/salon-marocain'),('/nos-magasins/','/nos-magasins')]:routes.append({'oldPath':old,'newPath':new,'action':'preserve_path','note':'Conserver le chemin et normaliser le slash au niveau hébergeur.'})
(base/'src/data/product-seo.json').write_text(json.dumps(seo,ensure_ascii=False,indent=2))
(base/'migration/url-map.json').write_text(json.dumps({'status':'draft_not_deployed','scope':'14 URL produit publiques et catégories connues ; autres URL historiques à compléter par export sitemap complet avant bascule','routes':routes},ensure_ascii=False,indent=2))
(base/'migration/redirects-proposed.txt').write_text('# Proposition uniquement — ne pas copier en production avant validation hébergeur\n'+'\n'.join(f"{r['oldPath']} {r['newPath']} 301" for r in routes if r['action']=='proposed_301')+'\n')
print(len(seo),'titres SEO;',sum(r['action']=='proposed_301' for r in routes),'redirections proposées')
