const page=document.querySelector<HTMLElement>('.guide-page');
if(page){
 const article=page.querySelector<HTMLElement>('.guide-article');
 const reading=page.querySelector('[data-guide-reading]');
 if(article&&reading){const words=(article.innerText+' '+(page.querySelector('.guide-hero-copy')?.textContent||'')).trim().split(/\s+/).length;reading.textContent=`${Math.max(1,Math.ceil(words/180))} دقائق للقراءة · تقدير حسب النص المعروض`;}
 const toc=page.querySelector<HTMLDetailsElement>('#guide-toc');
 const mobile=matchMedia('(max-width:767px)');
 const updateToc=()=>{if(toc)toc.open=!mobile.matches;};updateToc();mobile.addEventListener('change',updateToc);
 const header=document.querySelector<HTMLElement>('.header');
 const sections=[...page.querySelectorAll<HTMLElement>('[data-guide-section]')];
 const links=[...page.querySelectorAll<HTMLAnchorElement>('[data-guide-anchor]')];
 let offset=140;
 function measure(){offset=(header?.getBoundingClientRect().height||110)+16;page!.style.setProperty('--guide-offset',`${offset}px`);}
 if(header)new ResizeObserver(measure).observe(header);measure();
 let queued=false;
 function active(){queued=false;let current=sections[0];for(const section of sections){if(section.getBoundingClientRect().top<=offset+60)current=section;}links.forEach(a=>{if(a.dataset.guideAnchor===current?.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
 window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(active);}},{passive:true});active();
 links.forEach(link=>link.addEventListener('click',event=>{const section=document.getElementById(link.dataset.guideAnchor!);if(!section)return;event.preventDefault();if(mobile.matches&&toc)toc.open=false;history.pushState(null,'',`#${section.id}`);window.scrollTo({top:window.scrollY+section.getBoundingClientRect().top-offset,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});section.tabIndex=-1;section.focus({preventScroll:true});}));
}
export {};
