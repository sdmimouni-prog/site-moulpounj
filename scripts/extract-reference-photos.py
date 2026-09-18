"""Photo-only crops authorized by the user. No UI capture is used as a page block."""
from PIL import Image, ImageDraw
from pathlib import Path
import json
root=Path('/Users/salaheddinemimouni/Downloads')
out=Path(__file__).resolve().parents[1]/'public/images/reference'
out.mkdir(parents=True,exist_ok=True)
specs={
 'hero':('08_20_05 PM (1)',(835,355,1510,820)),
 'category-matelas':('08_20_06 PM (2)',(42,310,424,584)),
 'category-salon':('08_20_06 PM (2)',(451,310,823,584)),
 'category-oreillers':('08_20_06 PM (2)',(850,310,1221,584)),
 'category-magasins':('08_20_06 PM (2)',(1249,310,1630,584)),
 'store':('08_19_47 PM (1)',(1098,212,1623,535)),
 'banner':('08_19_47 PM (3)',(246,150,595,524)),
 'product-1':('08_20_16 PM',(52,750,243,824)),
 'product-2':('08_20_16 PM',(271,749,456,824)),
 'product-3':('08_20_16 PM',(488,749,674,824)),
 'product-4':('08_20_16 PM',(705,749,889,824)),
}
manifest={}
for name,(stamp,box) in specs.items():
 src=root/f'ChatGPT Image Sep 17, 2026, {stamp}.png'
 im=Image.open(src).convert('RGB').crop(box)
 im.save(out/f'{name}.webp','WEBP',quality=92,method=6)
 manifest[name]={'source':str(src),'crop':box,'size':im.size,'purpose':'Visual preview only; not validated catalog data'}
(out/'provenance.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
sheet=Image.new('RGB',(1000,((len(specs)+3)//4)*210),'white')
draw=ImageDraw.Draw(sheet)
for i,name in enumerate(specs):
 im=Image.open(out/f'{name}.webp');im.thumbnail((245,175))
 x=(i%4)*250;y=(i//4)*210
 sheet.paste(im,(x,y+25));draw.text((x+5,y+5),name,fill='black')
sheet.save(out.parent.parent.parent/'verification/extracted-photos.jpg')
