(function(){
function init(root){
var HAND='Virgil, Kalam, "Chalkboard SE", "Comic Sans MS", cursive',LH=1.25,NS='http://www.w3.org/2000/svg';
var PAL={blau:[165,216,255],gelb:[255,236,153],gruen:[178,242,187],rot:[255,168,168],lila:[208,191,255],grau:[222,226,230]};
var qs=[].slice.call(root.querySelectorAll('.ke-q')),btn=root.querySelector('.ke-send'),z=root.querySelector('.ke-z'),err=root.querySelector('.ke-err'),sumL=root.querySelector('.ke-sum ol'),sentEl=root.querySelector('.ke-sent'),ueb=0,cp=null;
var KEY='ke:'+(root.getAttribute('data-titel')||'');
var copyVersion=0,HINW='Steht der Text im Eingabefeld unten, mit Enter senden. Fehlt er dort und im Chat, hier kopieren und einfügen.';
function each(l,f){[].forEach.call(l,f);}
function freeze(on){each(root.querySelectorAll('.ke-o,.ke-x,.ke-n'),function(e){e.disabled=on;});}
function changed(){copyVersion++;var out=root.querySelector('.ke-out');if(out&&!out.hidden){out.hidden=true;out.value='';var war=ueb;if(cp)cp.hidden=true;ueb=0;if(sentEl)sentEl.textContent=war?'Auswahl geändert, noch nicht gesendet.':'Auswahl geändert, erneut kopieren.';if(btn)btn.textContent=war?'Entscheide senden':'Auswahl erneut kopieren';}}
function sel(q){return [].slice.call(q.querySelectorAll('.ke-o[aria-pressed="true"]'));}
function say(t){if(err)err.textContent=t;}
function anders(q){return ((q.querySelector('.ke-x')||{}).value||'').trim();}
function label(q,o){if(o.hasAttribute('data-anders'))return 'anders: '+(anders(q)||'…');if(o.hasAttribute('data-spaeter'))return 'später';return o.getAttribute('data-k')+' · '+o.getAttribute('data-t');}
function wahl(q){var s=sel(q);if(!s.length)return '';var rec=s.every(function(o){return o.hasAttribute('data-rec');}),any=q.querySelector('.ke-o[data-rec]');return s.map(function(o){return label(q,o);}).join(' + ')+(rec?'  ·  ★ Empfehlung':(any?'  ·  von dir geändert':''));}
function store(){try{var d={s:{},x:{},n:(root.querySelector('.ke-n')||{}).value||'',ueb:ueb};qs.forEach(function(q){var nr=q.getAttribute('data-nr');d.s[nr]=sel(q).map(function(o){return o.getAttribute('data-k')||(o.hasAttribute('data-anders')?'X':'S');});if(anders(q))d.x[nr]=anders(q);});localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
function upd(){var n=0,items=[];qs.forEach(function(q){var s=sel(q),w=q.querySelector('.ke-w');q.classList.toggle('ke-done',s.length>0);if(s.length)n++;if(w)w.textContent=s.length?'Deine Wahl: '+wahl(q):'';items.push('<li><b>'+q.getAttribute('data-nr')+' '+esc(q.getAttribute('data-kurz'))+':</b> '+(s.length?esc(s.map(function(o){return label(q,o);}).join(' + ')):'noch offen')+'</li>');});if(z)z.textContent=n+' von '+qs.length+' gewählt';if(sumL)sumL.innerHTML=items.join('');}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function zeit(t){return new Date(t).toLocaleTimeString('de-CH',{hour:'2-digit',minute:'2-digit'});}
function kopierweg(text,status){var out=root.querySelector('.ke-out');if(out){out.hidden=false;out.value=text;if(!cp){cp=document.createElement('button');cp.type='button';cp.className='ke-cp';out.parentNode.insertBefore(cp,out.nextSibling);cp.addEventListener('click',function(){var t=out.value;function zeig(){out.focus();out.select();cp.textContent='Markiert, mit Cmd+C kopieren';}if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(function(){cp.textContent='Kopiert, im Chat einfügen';},zeig);else zeig();});}cp.hidden=false;cp.textContent='Text kopieren';}if(sentEl)sentEl.textContent=status;}
function uebergeben(t){ueb=t;if(btn){btn.disabled=false;btn.textContent='Erneut übergeben';}freeze(false);var r=nachricht();if(r.text)kopierweg(r.text,'An den Chat übergeben um '+zeit(t)+'. '+HINW);}
function restore(){try{var d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d)return;qs.forEach(function(q){var nr=q.getAttribute('data-nr'),ks=d.s&&d.s[nr];if(!ks)return;each(q.querySelectorAll('.ke-o'),function(o){var k=o.getAttribute('data-k')||(o.hasAttribute('data-anders')?'X':'S');o.setAttribute('aria-pressed',ks.indexOf(k)>=0?'true':'false');});var x=q.querySelector('.ke-x');if(x&&d.x&&d.x[nr]){x.value=d.x[nr];x.hidden=false;}});var nn=root.querySelector('.ke-n');if(nn&&d.n)nn.value=d.n;if(d.ueb||d.sent)uebergeben(d.ueb||d.sent);}catch(e){}}
qs.forEach(function(q){
var multi=q.getAttribute('data-multi')==='1',x=q.querySelector('.ke-x');
each(q.querySelectorAll('.ke-o'),function(o){o.addEventListener('click',function(){
if(multi){o.setAttribute('aria-pressed',o.getAttribute('aria-pressed')==='true'?'false':'true');}
else{each(q.querySelectorAll('.ke-o'),function(b){b.setAttribute('aria-pressed',b===o?'true':'false');});}
if(x){var a=q.querySelector('.ke-o[data-anders][aria-pressed="true"]');x.hidden=!a;if(a)x.focus();}
changed();say('');upd();store();});});
if(x)x.addEventListener('input',function(){changed();say('');upd();store();});
});
var nEl=root.querySelector('.ke-n');if(nEl)nEl.addEventListener('input',function(){changed();store();});
function collect(){
var lines=[],miss=[],leer=[];
qs.forEach(function(q){
var s=sel(q),nr=q.getAttribute('data-nr');
if(!s.length){miss.push(nr);return;}
var parts=s.map(function(o){
if(o.hasAttribute('data-anders')){var v=anders(q);if(!v)leer.push(nr);return 'anders: '+v;}
if(o.hasAttribute('data-spaeter'))return 'später';
return o.getAttribute('data-k')+' · '+o.getAttribute('data-t');});
lines.push(nr+' '+q.getAttribute('data-kurz')+': '+parts.join(' + '));});
return {lines:lines,miss:miss,leer:leer};}
function nachricht(){var r=collect();if(r.miss.length||r.leer.length)return r;var n=root.querySelector('.ke-n');if(n&&n.value.trim())r.lines.push('Notiz: '+n.value.trim().replace(/\s*\n\s*/g,' / '));r.text='Klick-Entscheide «'+root.getAttribute('data-titel')+'»\n'+r.lines.join('\n');return r;}
if(btn)btn.addEventListener('click',function(){
var r=nachricht();
if(r.miss.length){say('Noch ohne Wahl: '+r.miss.join(', ')+'. Sonst «Später» wählen.');return;}
if(r.leer.length){say('Bei '+r.leer.join(', ')+' fehlt der Text zu «Anders».');return;}
var text=r.text;
var claudeSend=typeof sendPrompt==='function';
var codexSend=!claudeSend&&window.openai&&typeof window.openai.sendFollowUpMessage==='function';
if(claudeSend||codexSend){
btn.disabled=true;freeze(true);say('');
var result;
function fail(){btn.disabled=false;freeze(false);if(claudeSend)btn.textContent='Entscheide senden';say('Nicht gesendet. Bitte erneut versuchen.');if(claudeSend)kopierweg(text,'Nicht gesendet. Hier kopieren und im Chat einfügen.');}
try{result=claudeSend?sendPrompt(text):window.openai.sendFollowUpMessage({prompt:text,title:'Entscheide senden'});}
catch(e){fail();return;}
Promise.resolve(result).then(function(v){
if(claudeSend&&v&&v.isError===true){fail();return;}
if(codexSend){
btn.disabled=false;freeze(false);btn.textContent='Auswahl erneut übergeben';
if(sentEl)sentEl.textContent='Bestätigung angefragt. Versand noch nicht bestätigt.';
store();return;
}
uebergeben(Date.now());store();
},fail);
return;
}
var out=root.querySelector('.ke-out');if(out){out.hidden=false;out.value=text;}
btn.textContent='Text unten kopieren';
if(sentEl)sentEl.textContent='Auswahl bereit, noch nicht gesendet.';
store();
var version=++copyVersion;
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){if(version!==copyVersion)return;btn.textContent='Kopiert, im Chat einfügen';if(sentEl)sentEl.textContent='Kopiert, noch nicht gesendet. Im Chat einfügen.';},function(){});
});
restore();upd();
var fb=root.querySelector('.ke-fb');if(fb)fb.hidden=true;
var cv=document.createElement('canvas').getContext('2d');
function tw(s,fs){cv.font=fs+'px '+HAND;return cv.measureText(s).width;}
function wrap(s,max,fs){var out=[];if(!s)return out;String(s).split('\n').forEach(function(par){var line='';par.split(/\s+/).forEach(function(w){if(!w)return;var t=line?line+' '+w:w;if(!line||tw(t,fs)<=max)line=t;else{out.push(line);line=w;}});if(line)out.push(line);});return out;}
function dark(){var m=(getComputedStyle(root).color||'').match(/\d+(\.\d+)?/g);return !!m&&(0.299*m[0]+0.587*m[1]+0.114*m[2])>140;}
function fillOf(f){if(!f||f==='keine')return 'none';var p=PAL[f]||PAL.grau;return 'rgba('+p[0]+','+p[1]+','+p[2]+','+(dark()?0.28:0.9)+')';}
function mk(tag,a){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);return e;}
function pen(svg,seed){
var rc=window.rough&&window.rough.svg?window.rough.svg(svg):null,o={stroke:'currentColor',strokeWidth:1.5,roughness:1.1,bowing:0.9,seed:seed};
function put(n){svg.appendChild(n);return n;}
function opt(f){var r={},k;for(k in o)r[k]=o[k];var fl=fillOf(f);if(fl!=='none'){r.fill=fl;r.fillStyle='solid';}return r;}
function rr(x,y,w,h){var r=Math.min(14,h/4,w/4);return 'M'+(x+r)+' '+y+'L'+(x+w-r)+' '+y+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+r)+'L'+(x+w)+' '+(y+h-r)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-r)+' '+(y+h)+'L'+(x+r)+' '+(y+h)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-r)+'L'+x+' '+(y+r)+'Q'+x+' '+y+' '+(x+r)+' '+y+'Z';}
var P={
box:function(x,y,w,h,f){var d=rr(x,y,w,h);return rc?put(rc.path(d,opt(f))):put(mk('path',{d:d,fill:fillOf(f),stroke:'currentColor','stroke-width':1.5}));},
line:function(x1,y1,x2,y2){return rc?put(rc.line(x1,y1,x2,y2,o)):put(mk('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:'currentColor','stroke-width':1.5}));},
arrow:function(x1,y1,x2,y2){P.line(x1,y1,x2,y2);var a=Math.atan2(y2-y1,x2-x1);[0.5,-0.5].forEach(function(d){P.line(x2,y2,x2-11*Math.cos(a+d),y2-11*Math.sin(a+d));});},
dot:function(x,y,r,f){return rc?put(rc.circle(x,y,2*r,opt(f||'grau'))):put(mk('circle',{cx:x,cy:y,r:r,fill:fillOf(f||'grau'),stroke:'currentColor','stroke-width':1.5}));},
text:function(x,y,lines,fs,anchor,op){var t=mk('text',{x:x,y:y,'font-size':fs,'text-anchor':anchor||'middle',fill:'currentColor','font-family':HAND});if(op)t.setAttribute('fill-opacity',op);lines.forEach(function(s,i){var ts=mk('tspan',{x:x,dy:i?fs*LH:0});ts.textContent=s;t.appendChild(ts);});return put(t);}
};return P;}
function head(p,s){if(!s.titel)return 0;p.text(0,21,[s.titel],20,'start');return 36;}
function block(p,cx,y,h,a,b,fs,sf){var th=a.length*fs*LH+b.length*sf*LH,ty=y+(h-th)/2+fs*0.85;p.text(cx,ty,a,fs);if(b.length)p.text(cx,ty+(a.length-1)*fs*LH+sf*LH+2,b,sf,'middle',0.72);}
function fluss(p,s,W){
var k=s.knoten||[],N=k.length,fs=W<520?16:18,sf=13,y0=head(p,s);if(!N)return y0;
var gap=Math.max(34,Math.min(60,W*0.07)),w=(W-(N-1)*gap)/N;
if(w>=120){var L=k.map(function(n){return [wrap(n.text,w-22,fs),wrap(n.unter,w-22,sf)];}),h=64;
L.forEach(function(l){h=Math.max(h,l[0].length*fs*LH+l[1].length*sf*LH+28);});
k.forEach(function(n,i){var x=i*(w+gap);p.box(x+1,y0+1,w-2,h-2,n.farbe);block(p,x+w/2,y0,h,L[i][0],L[i][1],fs,sf);if(i<N-1)p.arrow(x+w+6,y0+h/2,x+w+gap-6,y0+h/2);});
return y0+h+6;}
var bw=Math.min(W-2,440),bx=(W-bw)/2,y=y0;
k.forEach(function(n,i){var a=wrap(n.text,bw-24,fs),b=wrap(n.unter,bw-24,sf),h=Math.max(52,a.length*fs*LH+b.length*sf*LH+24);p.box(bx+1,y+1,bw-2,h-2,n.farbe);block(p,W/2,y,h,a,b,fs,sf);y+=h;if(i<N-1){p.arrow(W/2,y+6,W/2,y+30);y+=36;}});
return y+6;}
function vergleich(p,s,W){
var c=s.spalten||[],C=c.length,fs=W<520?16:18,sf=W<520?14:15,y0=head(p,s);if(!C)return y0;
var gap=s.pfeil?48:18,w=(W-(C-1)*gap)/C,side=w>=190;if(!side)w=W-2;
var H=c.map(function(co){return wrap(co.titel,w-24,fs);}),PT=c.map(function(co){return (co.punkte||[]).map(function(t){return wrap(t,w-46,sf);});});
function hh(i){return H[i].length*fs*LH+24;}
function hl(i){return PT[i].reduce(function(acc,a){return acc+a.length*sf*LH+8;},0)+20;}
function one(i,x,y,hH,hL){p.box(x+1,y+1,w-2,hH-2,c[i].farbe);block(p,x+w/2,y,hH,H[i],[],fs,sf);var yy=y+hH+10;p.box(x+1,yy,w-2,hL,'keine');var ty=yy+14+sf*0.85;PT[i].forEach(function(a){p.text(x+16,ty,['•'],sf,'start');p.text(x+30,ty,a,sf,'start');ty+=a.length*sf*LH+8;});return yy+hL;}
if(side){var mH=0,mL=0,bot=0;c.forEach(function(_,i){mH=Math.max(mH,hh(i));mL=Math.max(mL,hl(i));});c.forEach(function(_,i){var x=i*(w+gap);bot=one(i,x,y0,mH,mL);if(s.pfeil&&i<C-1)p.arrow(x+w+6,y0+mH/2,x+w+gap-6,y0+mH/2);});return bot+6;}
var y=y0;c.forEach(function(_,i){y=one(i,1,y,hh(i),hl(i));if(i<C-1){if(s.pfeil){p.arrow(W/2,y+6,W/2,y+30);y+=36;}else y+=16;}});return y+6;}
function zeitachse(p,s,W){
var pts=s.punkte||[],N=pts.length,fs=W<520?15:17,sf=W<520?13:14,y0=head(p,s);if(!N)return y0;
if(N>1&&W/N>=118){var pad=Math.min(56,W/N/2),step=(W-2*pad)/(N-1),ly=y0+40,mx=0,T=pts.map(function(pt){return wrap(pt.text,step-10,sf);});
T.forEach(function(a){mx=Math.max(mx,a.length);});
p.arrow(Math.max(2,pad-24),ly,W-2,ly);
function cx(x,lines,f){var m=0;lines.forEach(function(s){m=Math.max(m,tw(s,f));});return Math.min(Math.max(x,m/2+2),W-m/2-2);}
pts.forEach(function(pt,i){var x=pad+i*step;p.dot(x,ly,8,pt.farbe);p.text(cx(x,[pt.wann],fs),ly-18,[pt.wann],fs);p.text(cx(x,T[i],sf),ly+30,T[i],sf,'middle',0.8);});
return ly+30+mx*sf*LH+4;}
var x=12,y=y0+6,tot=0,items=pts.map(function(pt){var a=wrap(pt.text,W-x-40,sf);return {pt:pt,a:a,h:fs*LH+a.length*sf*LH+16};});
items.forEach(function(it){tot+=it.h;});p.line(x,y+4,x,y+tot-12);
items.forEach(function(it){p.dot(x,y+10,7,it.pt.farbe);p.text(x+22,y+15,[it.pt.wann],fs,'start');p.text(x+22,y+15+fs*LH,it.a,sf,'start',0.8);y+=it.h;});
return y+4;}
var LAY={fluss:fluss,vergleich:vergleich,zeitachse:zeitachse},sks=[].slice.call(root.querySelectorAll('.ke-sk')),lastW=0;
function draw(force){var W=Math.floor(root.getBoundingClientRect().width);if(!W||(!force&&Math.abs(W-lastW)<8))return;lastW=W;
sks.forEach(function(sk,i){var svg=sk.querySelector('svg');if(!svg)return;while(svg.firstChild)svg.removeChild(svg.firstChild);
try{var s=JSON.parse(sk.getAttribute('data-spec')),f=LAY[s.typ],H=f?Math.ceil(f(pen(svg,11+i*17),s,W)):0;svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);}
catch(e){svg.setAttribute('height','0');var c=sk.querySelector('.ke-cap');if(c)c.textContent='Skizze nicht darstellbar: '+e.message;}});}
draw(true);
if(!(window.rough&&window.rough.svg))each(document.querySelectorAll('script[src*="roughjs"]'),function(s){s.addEventListener('load',function(){draw(true);});});
if(document.fonts&&document.fonts.load)document.fonts.load('18px Virgil').then(function(){draw(true);},function(){});
if(window.ResizeObserver)new ResizeObserver(function(){draw(false);}).observe(root);
}
function start(){[].forEach.call(document.querySelectorAll('.ke[data-titel]'),function(r){if(r.getAttribute('data-ke-on'))return;r.setAttribute('data-ke-on','1');try{init(r);}catch(e){if(window.console)console.error(e);}});}
start();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
})();
