(()=>{
let HAND='Virgil, Kalam, "Chalkboard SE", "Comic Sans MS", cursive',LH=1.25,NS='http://www.w3.org/2000/svg',D=document,W=window,{min,max,round,floor,ceil,cos,sin,atan2}=Math,cv;
let PAL={blau:[165,216,255],gelb:[255,236,153],gruen:[178,242,187],rot:[255,168,168],lila:[208,191,255],grau:[222,226,230]};
let MK={rot:['#e5484d','#b4232a','#ff9b9b','#b4232a','#fff'],gelb:['#e0a800','#7d5a00','#ffd666','#e0a800','#1f1e1d'],gruen:['#30a46c','#1a7046','#7ee2a8','#1a7046','#fff'],blau:['#378add','#1f5fa8','#9cc9ff','#1f5fa8','#fff']};
let MARKE={neu:['gruen','NEU'],geaendert:['gelb','GEÄNDERT'],weg:['rot','WEG']};
let GER={handy:{max:300,min:170,rad:22,pad:14,top:28},desktop:{max:560,min:250,rad:10,pad:14,top:32}};
let SA=(e,k,v)=>e.setAttribute(k,v),GA=(e,k)=>e.getAttribute(k),AP=(p,c)=>p.appendChild(c),QA=(e,s)=>e.querySelectorAll(s),Q=(e,s)=>e.querySelector(s),ON=(e,n,f)=>e.addEventListener(n,f),KL=(e,c,an)=>e.classList.toggle(c,an),TX=(e,s)=>{e.textContent=s;return e;},CE=t=>D.createElement(t);
let tw=(s,fs,fw)=>{cv=cv||CE('canvas').getContext('2d');cv.font=(fw?fw+' ':'')+fs+'px '+HAND;return cv.measureText(String(s)).width;};
let fit=(s,fs,mx,fw)=>{let w=tw(s,fs,fw);return w>mx?max(8,fs*mx/w):fs;};
let stuecke=(w,mx,fs,fw)=>{let r=[],cur='';Array.from(w).forEach(c=>{if(cur&&tw(cur+c+'-',fs,fw)>mx){r.push(cur+'-');cur=c;}else cur+=c;});if(cur)r.push(cur);return r;};
let wrap=(s,mx,fs,fw)=>{let out=[];if(!s)return out;String(s).split('\n').forEach(par=>{let line='';par.split(/\s+/).forEach(w=>{if(!w)return;if(tw(w,fs,fw)>mx){if(line)out.push(line);let st=stuecke(w,mx,fs,fw);line=st.pop();out.push(...st);return;}let t=line?line+' '+w:w;if(!line||tw(t,fs,fw)<=mx)line=t;else{out.push(line);line=w;}});if(line)out.push(line);});return out;};
let mk=(tag,a)=>{let e=D.createElementNS(NS,tag);for(let k in a)SA(e,k,a[k]);return e;};
let trifft=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
let liste=b=>b.text?String(b.text).split(/\s*[·;,]\s*/).filter(s=>s).slice(0,4):['','',''];
let init=root=>{
let dark=()=>{let m=(getComputedStyle(root).color||'').match(/\d+(\.\d+)?/g);return !!m&&(.299*m[0]+.587*m[1]+.114*m[2])>140;};
let fillOf=f=>{if(!f||f=='keine')return 'none';let p=PAL[f]||PAL.grau;return 'rgba('+p[0]+','+p[1]+','+p[2]+','+(dark()?.28:.9)+')';};
let halo=()=>dark()?'rgba(31,30,29,.95)':'rgba(255,255,255,.95)';
let pen=(svg,seed)=>{
let o={stroke:'currentColor',strokeWidth:1.5,roughness:1.1,bowing:.9,seed},put=n=>AP(svg,n);
let el=(t,a,x)=>{a.stroke=x.stroke;a['stroke-width']=x.strokeWidth;if(x.strokeLineDash)a['stroke-dasharray']=x.strokeLineDash.join(' ');return mk(t,a);};
let rc=W.rough?.svg?W.rough.svg(svg):{path:(d,x)=>el('path',{d,fill:x.fill||'none'},x),line:(x1,y1,x2,y2,x)=>el('line',{x1,y1,x2,y2},x),circle:(cx,cy,d,x)=>el('circle',{cx,cy,r:d/2,fill:x.fill||'none'},x),curve:(p,x)=>el('polyline',{points:p.map(q=>q.join(',')).join(' '),fill:'none'},x)};
let opt=(f,x)=>{let r=Object.assign({},o,x),fl=fillOf(f);if(fl!='none'){r.fill=fl;r.fillStyle='solid';}return r;};
let rr=(x,y,w,h,r)=>{r=max(0,min(r,h/2,w/2));let X=x+w,Y=y+h;return `M${x+r} ${y}L${X-r} ${y}Q${X} ${y} ${X} ${y+r}L${X} ${Y-r}Q${X} ${Y} ${X-r} ${Y}L${x+r} ${Y}Q${x} ${Y} ${x} ${Y-r}L${x} ${y+r}Q${x} ${y} ${x+r} ${y}Z`;};
let P={
box:(x,y,w,h,f,r,x2)=>put(rc.path(rr(x,y,w,h,r==null?10:r),opt(f,x2))),
line:(x1,y1,x2,y2,x)=>put(rc.line(x1,y1,x2,y2,opt('keine',x))),
arrow:(x1,y1,x2,y2)=>{P.line(x1,y1,x2,y2);let a=atan2(y2-y1,x2-x1);[.5,-.5].forEach(d=>P.line(x2,y2,x2-11*cos(a+d),y2-11*sin(a+d)));},
dot:(x,y,r,f)=>put(rc.circle(x,y,2*r,opt(f||'grau'))),
krakel:(x,y,w)=>{let pts=[],n=max(2,round(w/14));for(let i=0;i<=n;i++)pts.push([x+w*i/n,y+(i%2?1.6:-1.6)]);return put(rc.curve(pts,opt('keine',{strokeWidth:1.3,roughness:.8})));},
text:(x,y,lines,fs,anchor,op,fw)=>{let t=mk('text',{x,y,'font-size':fs,'text-anchor':anchor||'middle',fill:'currentColor','font-family':HAND});if(fw)SA(t,'font-weight',fw);if(op)SA(t,'fill-opacity',op);lines.forEach((s,i)=>AP(t,TX(mk('tspan',{x,dy:i?fs*LH:0}),s)));return put(t);}
};return P;};
let halotext=(p,x,y,s,fs)=>{let t=p.text(x,y,[s],fs,'middle',null,600);SA(t,'stroke',halo());SA(t,'stroke-width',4);SA(t,'stroke-linejoin','round');SA(t,'paint-order','stroke');};
let hoehe=(b,iw,ger)=>{let t=b.text||'',a=b.art;
return a=='leiste'?(t?24:12):a=='bild'?round(ger===GER.desktop?min(iw*.42,190):min(iw*.62,170)):a=='titel'?(t?max(1,wrap(t,iw,18,700).length)*18*LH+4:22):a=='text'?(t?max(1,wrap(t,iw,14).length)*14*LH+2:38):a=='liste'?liste(b).length*21:{preis:26,knopf:38,badge:22,feld:32}[a]||14;};
let block=(p,b,x,y,iw,h,ger)=>{let t=b.text||'',f=b.farbe,a=b.art,fs;
if(a=='leiste'){p.box(x,y,iw,h,f||'grau',4);if(t){fs=fit(t,11,iw-12);p.text(x+iw/2,y+h/2+fs*.35,[t],fs,'middle');}}
else if(a=='bild'){p.box(x,y,iw,h,f||'keine',6);p.line(x+5,y+5,x+iw-5,y+h-5,{strokeWidth:1});p.line(x+iw-5,y+5,x+5,y+h-5,{strokeWidth:1});if(t)halotext(p,x+iw/2,y+h/2+5,t,fit(t,13,iw-16,600));}
else if(a=='titel'){if(t)p.text(x,y+18*.85+1,wrap(t,iw,18,700),18,'start',null,700);else p.krakel(x,y+11,iw*.7);}
else if(a=='text'){if(t)p.text(x,y+14*.85+1,wrap(t,iw,14),14,'start',.85);else [.95,.85,.6].forEach((k,i)=>p.krakel(x,y+7+i*12,iw*k));}
else if(a=='preis'){if(t)p.text(x,y+19,[t],fit(t,19,iw,700),'start',null,700);else p.krakel(x,y+13,iw*.35);}
else if(a=='knopf'){t=t||'Button';let kw=ger===GER.desktop?min(iw,max(150,tw(t,15,600)+56)):iw;fs=fit(t,15,kw-18,600);p.box(x,y,kw,h,f||'blau',h/2);p.text(x+kw/2,y+h/2+fs*.35,[t],fs,'middle',null,600);}
else if(a=='badge'){t=t||'Badge';fs=fit(t,12,iw-20);let bw=min(iw,tw(t,fs)+22);p.box(x,y,bw,h,f||'gelb',h/2);p.text(x+bw/2,y+h/2+fs*.35,[t],fs,'middle');}
else if(a=='liste')liste(b).forEach((s,i)=>{let ry=y+i*21+10;p.dot(x+5,ry,3.5,f||'grau');if(s)p.text(x+16,ry+5,[s],fit(s,13,iw-18),'start',.85);else p.krakel(x+16,ry,(iw-16)*[.8,.62,.72,.5][i%4]);});
else if(a=='feld'){p.box(x,y,iw,h,'keine',6);if(t)p.text(x+10,y+h/2+5,[t],fit(t,13,iw-20),'start',.72);else p.line(x+12,y+8,x+12,y+h-8,{strokeWidth:1.2});}};
let markiere=(p,svg,b,x,y,iw,h,zeichne)=>{let m=MARKE[b.markiert];if(!m)return zeichne();let c=MK[m[0]][0];
if(b.markiert=='weg'){let n0=svg.childNodes.length;zeichne();let neu=[...svg.childNodes].slice(n0),texte=neu.filter(n=>n.tagName=='text');
neu.forEach(n=>n.tagName=='text'?SA(n,'fill-opacity','0.72'):SA(n,'opacity','0.45'));
p.box(x-5,y-4,iw+10,h+8,'keine',6,{stroke:c,strokeWidth:1.6,strokeLineDash:[6,5]});
let s=p.line(x-3,y+h+2,x+iw+3,y-2,{stroke:c,strokeWidth:1.5});SA(s,'class','ke2-weg');SA(s,'opacity','0.6');texte.forEach(t=>AP(svg,t));}
else{p.box(x-5,y-4,iw+10,h+8,m[0],6,{stroke:c,strokeWidth:1.2});zeichne();}
let lw=tw(m[1],10,700)+14;SA(p.box(x+iw+5-lw,y-23,lw,17,m[0],8,{stroke:c,strokeWidth:1.2,roughness:.6}),'class','ke2-et');p.text(x+iw+5-lw/2,y-11,[m[1]],10,'middle',null,700);};
let rahmen=(p,svg,x,y,fw,bl,ger)=>{let pad=ger.pad,iw=fw-2*pad,hs=bl.map(b=>hoehe(b,iw,ger)),fh=ger.top;
bl.forEach((b,i)=>{fh+=(b.markiert?16:0)+hs[i]+(i<bl.length-1?10:0);});fh+=pad+4;
p.box(x+1,y+1,fw-2,fh-2,'keine',ger.rad,{strokeWidth:1.8});
if(ger===GER.handy)p.box(x+fw/2-22,y+10,44,7,'grau',3.5,{strokeWidth:1});
else{p.line(x+2,y+ger.top-8,x+fw-2,y+ger.top-8,{strokeWidth:1.2});['rot','gelb','gruen'].forEach((f,k)=>p.dot(x+14+k*13,y+12,4,f));}
let yy=y+ger.top;bl.forEach((b,i)=>{if(b.markiert)yy+=16;let bx=x+pad,by=yy,h=hs[i];markiere(p,svg,b,bx,by,iw,h,()=>block(p,b,bx,by,iw,h,ger));yy+=h+10;});
return fh;};
let titel=(p,s,x,y,fw)=>p.text(x,y+15,[s],fit(s,15,fw,700),'start',null,700);
let mockup=(svg,s,Wd,seed)=>{let p=pen(svg,seed),ger=GER[s.geraet]||GER.handy,y=0;
if(s.titel){let tl=wrap(s.titel,Wd-4,18);p.text(1,17,tl,18,'start');y=tl.length*18*LH+12;}
if(!s.vorher&&!s.nachher)return y+rahmen(p,svg,1,y,min(Wd-2,ger.max),s.bloecke||[],ger)+4;
let A=s.vorher||{},B=s.nachher||{},ta=A.titel||'Vorher',tb=B.titel||'Nachher',gap=50;
if(Wd>=2*ger.min+gap+2){let fw=min(ger.max,(Wd-gap-2)/2),x2=1+fw+gap;titel(p,ta,1,y,fw);titel(p,tb,x2,y,fw);
let h1=rahmen(p,svg,1,y+26,fw,A.bloecke||[],ger),h2=rahmen(p,svg,x2,y+26,fw,B.bloecke||[],ger),ya=y+26+min(h1,h2)/2;
p.arrow(1+fw+8,ya,x2-8,ya);return y+26+max(h1,h2)+4;}
let fb=min(Wd-2,ger.max);titel(p,ta,1,y,fb);
let y2=y+26+rahmen(p,svg,1,y+26,fb,A.bloecke||[],ger);p.arrow(1+fb/2,y2+8,1+fb/2,y2+38);y2+=46;
titel(p,tb,1,y2,fb);return y2+26+rahmen(p,svg,1,y2+26,fb,B.bloecke||[],ger)+4;};
let mus=[...QA(root,'.ke2-mu')],bxs=[...QA(root,'.ke2-bx[data-mk]')],breite=[];
let zeichneMu=(mu,i,force)=>{let Wd=floor(mu.getBoundingClientRect().width);if(!Wd||!force&&Wd===breite[i])return;breite[i]=Wd;
let svg=Q(mu,'svg'),cap=Q(mu,'.ke-cap'),alt=cap&&Q(cap,'.ke2-fehler');if(!svg)return;if(alt)cap.removeChild(alt);while(svg.firstChild)svg.removeChild(svg.firstChild);
try{let s=JSON.parse(GA(mu,'data-spec')),H=ceil(mockup(svg,s,Wd,23+i*17));SA(svg,'viewBox','0 0 '+Wd+' '+H);SA(svg,'width',Wd);SA(svg,'height',H);}
catch(e){SA(svg,'height','0');if(cap){let f=CE('span');f.className='ke2-fehler';AP(cap,TX(f,' · nicht darstellbar: '+e.message));}}};
let lage=(e,b,lh,Wd,H,E,belegt)=>{let frei=null;if(b>Wd-4)return null;
let re=e.x+e.w+6,li=e.x-6-b,mi=e.cx-b/2,ob=e.y-lh-3,un=e.y+e.h+3,ru=e.y+e.h-lh,rb=e.x+e.w-b,mt=e.cy-lh/2;
[[re,mt],[li,mt],[mi,ob],[mi,un],[re,e.y],[li,e.y],[re,ru],[li,ru],[rb,ob],[e.x,ob],[rb,un],[e.x,un]].some(q=>{let r={x:max(2,min(q[0],Wd-b-2)),y:max(2,min(q[1],H-lh-2)),w:b,h:lh};
if(E.some(o=>trifft(r,o))||belegt.some(o=>trifft(r,o)))return false;frei=r;return true;});return frei;};
let leiste=(md,H)=>md.tagName=='VIDEO'&&md.controls?min(60,round(H*.4)):0;
let sperre=(md,Wd,H)=>{let u=leiste(md,H),k=min(64,Wd*.5,H*.5);return u?[{x:0,y:H-u,w:Wd,h:u},{x:Wd/2-k/2,y:H/2-k/2,w:k,h:k}]:[];};
let marken=bx=>{try{return JSON.parse(GA(bx,'data-mk'))||[];}catch(e){return null;}};
let zeigeLegende=(fig,bx,legende)=>{if(!legende.length||!fig)return;let lg=CE('div');lg.className='ke2-lg';legende.forEach(l=>{let sp=CE('span');SA(sp,'data-f',l[0]);AP(sp,TX(CE('b'),l[1]));AP(sp,D.createTextNode(l[2]));AP(lg,sp);});fig.insertBefore(lg,bx.nextSibling);};
let rueckfall=(bx,md)=>{let Wd=md.clientWidth,H=md.clientHeight,legende=[];if(Wd<8||H<8)return;let belegt=sperre(md,Wd,H),u=leiste(md,H);
let E=[...QA(bx,'.ke2-mk')].map(s=>{let x=s.offsetLeft,y=s.offsetTop,w=s.offsetWidth,h=s.offsetHeight;return {x,y,w,h,cx:x+w/2,cy:y+h/2};});
QA(bx,'.ke2-ml').forEach(l=>{if(!l.hasAttribute('data-s')){SA(l,'data-s',GA(l,'style')||'');SA(l,'data-t',l.textContent);}SA(l,'style',GA(l,'data-s'));l.textContent=GA(l,'data-t');let e=E[+GA(l,'data-k')];if(!e)return;
l.style.maxWidth=(Wd-4)+'px';let r=lage(e,l.offsetWidth,l.offsetHeight,Wd,H,E,belegt);if(!r){let n=String(legende.length+1);legende.push([GA(l,'data-f')||'rot',n,l.textContent]);l.textContent=n;r={x:max(2,min(e.x+3,Wd-22)),y:max(2,min(e.y+3,H-20-u)),w:20,h:18};}
belegt.push(r);l.style.left=r.x+'px';l.style.top=r.y+'px';l.style.right='auto';l.style.bottom='auto';});zeigeLegende(bx.parentNode,bx,legende);};
let overlay=(bx,i)=>{let md=Q(bx,'img,video');if(!md)return;let fig=bx.parentNode,alt=Q(bx,'svg.ke2-ov'),lg=fig&&Q(fig,'.ke2-lg'),L;if(alt)bx.removeChild(alt);if(lg)fig.removeChild(lg);
if(md.tagName=='VIDEO'&&!GA(md,'poster')&&md.readyState<2){KL(bx,'ke2-warte',true);KL(bx,'ke2-gez',false);L=marken(bx);if(L&&md.readyState>=1)zeigeLegende(fig,bx,L.filter(m=>m.text).map(m=>[MK[m.farbe]?m.farbe:'rot','',m.text]));return;}
KL(bx,'ke2-warte',false);
if(!(W.rough?.svg)){KL(bx,'ke2-gez',false);rueckfall(bx,md);return;}
let Wd=md.clientWidth,H=md.clientHeight,u=leiste(md,H);if(Wd<8||H<8)return;L=marken(bx);if(!L)return;
let svg=mk('svg',{'class':'ke2-ov',viewBox:'0 0 '+Wd+' '+H,width:Wd,height:H,'aria-hidden':'true'}),rc=W.rough.svg(svg),fs=Wd<360?12:14,lh=round(fs*1.3),dk=dark()?1:0,E=[],belegt=sperre(md,Wd,H),legende=[];
L.forEach((m,k)=>{let c=(MK[m.farbe]||MK.rot)[0],x=m.x/100*Wd,y=m.y/100*H,w=m.b/100*Wd,h=m.h/100*H,cx=x+w/2,cy=y+h/2;
let ew=max(8,min(w*1.15+12,2*min(cx,Wd-cx)-4)),eh=max(8,min(h*1.2+12,2*min(cy,H-cy)-4));
E.push({x:cx-ew/2,y:cy-eh/2,w:ew,h:eh,cx,cy});AP(svg,rc.ellipse(cx,cy,ew,eh,{stroke:c,strokeWidth:3,roughness:1.3,bowing:1.2,seed:7+k*13+i*3}));});
L.forEach((m,k)=>{if(!m.text)return;let e=E[k],f=MK[m.farbe]?m.farbe:'rot',frei=lage(e,tw(m.text,fs,700)+4,lh,Wd,H,E,belegt);
if(frei){belegt.push(frei);AP(svg,TX(mk('text',{x:frei.x+2,y:frei.y+lh/2+fs*.36,'font-size':fs,'font-family':HAND,'font-weight':700,fill:MK[f][1+dk],stroke:halo(),'stroke-width':4,'stroke-linejoin':'round','paint-order':'stroke'}),m.text));return;}
let n=String(legende.length+1),px=max(10,min(e.cx-e.w*.355,Wd-10)),py=max(10,min(e.cy-e.h*.355,H-10-u));belegt.push({x:px-10,y:py-10,w:20,h:20});legende.push([f,n,m.text]);
AP(svg,mk('circle',{cx:px,cy:py,r:9,fill:MK[f][3],stroke:halo(),'stroke-width':2}));AP(svg,TX(mk('text',{x:px,y:py+4,'font-size':11,'font-weight':700,'text-anchor':'middle',fill:MK[f][4],'font-family':'system-ui,sans-serif'}),n));});
AP(bx,svg);KL(bx,'ke2-gez',true);zeigeLegende(fig,bx,legende);};
let alles=force=>{mus.forEach((mu,i)=>zeichneMu(mu,i,force));bxs.forEach(overlay);};
alles(true);
bxs.forEach((bx,j)=>{let md=Q(bx,'img,video'),neu=()=>overlay(bx,j);if(!md)return;ON(md,'load',neu);ON(md,'loadedmetadata',neu);if(md.tagName!='VIDEO')return;ON(md,'loadeddata',neu);ON(md,'play',()=>KL(bx,'ke2-spielt',true));['pause','ended'].forEach(n=>ON(md,n,()=>{KL(bx,'ke2-spielt',false);neu();}));});
if(!(W.rough?.svg))QA(D,'script[src*="roughjs"]').forEach(s=>ON(s,'load',()=>alles(true)));
D.fonts.load('18px Virgil').then(()=>alles(true),()=>{});
let ro=new ResizeObserver(es=>es.forEach(en=>{let el=en.target;requestAnimationFrame(()=>{let i=mus.indexOf(el),j=bxs.indexOf(el);if(i>=0)zeichneMu(el,i,false);if(j>=0)overlay(el,j);});}));mus.concat(bxs).forEach(el=>ro.observe(el));
W.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>alles(true));
};
let start=()=>QA(D,'.ke.ke-v2[data-titel]').forEach(r=>{if(GA(r,'data-ke2-on'))return;SA(r,'data-ke2-on','1');try{init(r);}catch(e){console.error(e);}});
start();
if(D.readyState=='loading')ON(D,'DOMContentLoaded',start);
})();
