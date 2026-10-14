
(function(){
var L=window.I18N||{};function T(s){return L[s]||s}
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},3200)}
function store(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}function load(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
// open now (Pacific time, Mon-Fri 8-18)
try{var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short',hour:'numeric',hour12:false}).formatToParts(new Date()),w,h;
p.forEach(function(x){if(x.type==='weekday')w=x.value;if(x.type==='hour')h=+x.value%24});var o=['Sat','Sun'].indexOf(w)<0&&h>=9&&h<18;
$$('[data-open]').forEach(function(d){d.classList.toggle('on',o)});$$('[data-open-txt]').forEach(function(t){t.textContent=T(o?'Agents available now':'Closed now · opens 9am PT')})}catch(e){}
// coverage dropdown (desktop)
var dd=$('.dd'),db=$('.ddbtn');if(dd){var hov=matchMedia('(hover:hover) and (min-width:921px)');
 function setdd(o){dd.classList.toggle('open',o);db.setAttribute('aria-expanded',o)}
 var ddt;db.addEventListener('click',function(){if(hov.matches&&dd.classList.contains('open')){location.href='services.html';return}setdd(!dd.classList.contains('open'))});
 dd.addEventListener('mouseenter',function(){clearTimeout(ddt);if(hov.matches)setdd(true)});dd.addEventListener('mouseleave',function(){if(hov.matches)ddt=setTimeout(function(){setdd(false)},250)});
 document.addEventListener('click',function(e){if(!dd.contains(e.target))setdd(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dd.classList.contains('open')){setdd(false);db.focus()}})}
// website requests -> Rhino's Google Sheet (Apps Script web app); empty URL = preview mode
var RQ={'id-cards':'ID cards', 'coi':'Certificate of insurance', 'pay':'Pay my bill', 'lender':'Lender proof', 'change':'Change my policy', 'renewal':'Renewal review', 'other':'Something else'},VN={'car:yes':'Yes','car:no':'No, non-owner / broadform'};var FORM_URL='',FK={cov:'Coverage',zip:'ZIP',car:'Owns a car',drivers:'Drivers',htype:'Type of home',closing:'Closing date',biz:'Business name',work:'Type of work',notes:'Message / notes',first:'First name',last:'Last name',phone:'Phone',email:'Email',via:'Best way to reach','c-name':'Name','c-phone':'Phone','c-email':'Email','c-topic':'Topic','c-msg':'Message / notes','s-type':'Request','s-name':'Name','s-phone':'Phone','s-email':'Email','s-policy':'Policy number','s-holder':'Certificate holder','s-holder-email':'Send certificate to','s-details':'Message / notes'};
$$('form').forEach(function(f){var h=document.createElement('input');h.type='text';h.name='_honey';h.tabIndex=-1;h.autocomplete='off';h.style.display='none';h.setAttribute('aria-hidden','true');f.appendChild(h)});
window.rhSend=function(f,kind,cb){if(!FORM_URL){toast(T('Preview only: nothing was sent.'));cb(true);return}var p={Type:kind};
 $$('input,select,textarea',f).forEach(function(i){var k=FK[i.name]||FK[i.id];if(!k)return;var sec=i.closest('[data-for]');if(sec&&!sec.classList.contains('show'))return;if(i.closest('[data-svc][hidden]'))return;
  if(i.type==='radio'){if(i.checked)p[k]=(VN[i.name+':'+i.value]||i.value)}else{var v=(i.value||'').trim();if(v)p[k]=RQ[v]&&i.id==='s-type'?RQ[v]:v}});
 if(p['First name']||p['Last name'])p.Name=((p['First name']||'')+' '+(p['Last name']||'')).trim();
 p.Language=(document.documentElement.lang||'en').toUpperCase();p.Page=location.pathname.split('/').pop();var hp=f.querySelector('[name=_honey]');if(hp&&hp.value)p._honey=hp.value;
 fetch(FORM_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(p)}).then(function(r){return r.json()}).then(function(j){cb(!!(j&&j.ok))},function(){cb(false)})};
// mobile menu
var m=$('.menu'),n=$('#nav');if(m){m.addEventListener('click',function(){var x=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',x);n.classList.toggle('open',x);document.body.classList.toggle('mopen',x)});
$$('a',n).forEach(function(a){a.addEventListener('click',function(){m.setAttribute('aria-expanded','false');n.classList.remove('open');document.body.classList.remove('mopen')})})}
// "have this handy" hint
function need(form){var c=form.querySelector('input[name=cov]:checked'),b=$('[data-need-title]',form),s=$('[data-need]',form);if(!b)return;
 var d=c&&COV[c.value];if(d){b.textContent=T('For {n}, have this handy:').replace('{n}',d.n.toLowerCase().replace('sr-22','SR-22'));s.textContent=d.r.join(', ')}else{b.textContent=T('Not sure?');s.textContent=T("Pick this and tell us what's going on. We'll figure out the right coverage.")}}
// quick-start forms (home, SR-22 page) -> quote.html
$$('form[data-start]').forEach(function(f){
 $$('input[name=cov]',f).forEach(function(r){r.addEventListener('change',function(){need(f)})});need(f);
 f.addEventListener('submit',function(e){e.preventDefault();var z=f.querySelector('[name=zip]');if(!/^\d{5}$/.test(z.value)){z.focus();z.closest('.field').classList.add('bad');toast(T('Enter a 5-digit ZIP code.'));return}
  var c=f.querySelector('[name=cov]:checked')||f.querySelector('[name=cov]');store('rh_zip',z.value);var car=f.querySelector('[name=car]:checked');if(car)store('rh_car',car.value);
  location.href='quote.html#'+(c?c.value:'auto')});
 var z=f.querySelector('[name=zip]');z.addEventListener('input',function(){z.value=z.value.replace(/\D/g,'').slice(0,5);z.closest('.field').classList.remove('bad')});
});
// full quote flow
var q=$('#qf');if(!q)return;var step=1,steps=$$('.qs',q),next=$('[data-next]',q),back=$('[data-back]',q);
var h=(location.hash||'').slice(1);var pre=q.querySelector('input[name=cov][value="'+h+'"]');if(pre)pre.checked=true;
var zz=load('rh_zip');if(zz)$('#qz').value=zz;var cc=load('rh_car');if(cc){var ce=q.querySelector('input[name=car][value="'+cc+'"]');if(ce)ce.checked=true}
$$('input[name=cov]',q).forEach(function(r){r.addEventListener('change',function(){need(q)})});need(q);
function show(){steps.forEach(function(s){s.hidden=+s.dataset.step!==step});$$('.prog i',q).forEach(function(i,k){i.classList.toggle('on',k<step)});
 $('#stepno').textContent=step<4?T('Step {n} of 3').replace('{n}',step):T('Done');back.hidden=step===1||step===4;next.hidden=step===4;
 next.innerHTML=T(step===3?'Send my quote request':'Continue')+' '+'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
 var c=q.querySelector('input[name=cov]:checked').value;$$('[data-for]',q).forEach(function(d){d.classList.toggle('show',d.dataset.for.split(' ').indexOf(c)>=0)});
 if(step>1){var t=steps[step-1].querySelector('h1,h2');if(t){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}q.scrollIntoView({behavior:'smooth',block:'start'})}}
function valid(){var ok=true;$$('.qs[data-step="'+step+'"] [required]',q).forEach(function(i){var v=i.value.trim(),good=v!=='';
 if(i.type==='checkbox')good=i.checked;if(i.hasAttribute('data-zip'))good=/^\d{5}$/.test(v);if(i.hasAttribute('data-phone'))good=v.replace(/\D/g,'').length>=10;
 var fl=i.closest('.field');if(fl)fl.classList.toggle('bad',!good);if(i.type==='checkbox')$('[data-consent-err]').classList.toggle('on',!good);
 if(!good&&ok){ok=false;i.focus()}});return ok}
q.addEventListener('submit',function(e){e.preventDefault();if(!valid())return;if(step===3){if(q._busy)return;q._busy=1;next.disabled=true;next.textContent=T('Sending…');window.rhSend(q,'Quote request',function(ok){q._busy=0;next.disabled=false;if(!ok){show();toast(T("Sorry, that didn't send. Please call (800) 700-9181 or email info@rhino.insure."));return}$('[data-name]',q).textContent=$('#qfn').value.trim();step=4;show()});return}step++;show()});
back.addEventListener('click',function(){step--;show()});
$('#qz').addEventListener('input',function(e){e.target.value=e.target.value.replace(/\D/g,'').slice(0,5)});
show();
})();

(function(){
var L=window.I18N||{};function T(s){return L[s]||s}
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},3200)}
// carry the hero's extra question into the quote notes
$$('form[data-start]').forEach(function(f){f.addEventListener('submit',function(){var n=$$('[data-note]',f).map(function(x){return x.value?x.dataset.note+': '+x.value:''}).filter(Boolean).join('\n');try{sessionStorage.setItem('rh_note',n)}catch(e){}})});
var qn=$('#qn');if(qn){try{var v=sessionStorage.getItem('rh_note');if(v){qn.value=v;sessionStorage.removeItem('rh_note')}}catch(e){}}
// simple forms (contact, client requests)
$$('form[data-simple]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
 $$('[required]',f).forEach(function(i){if(i.closest('[hidden]'))return;var v=i.value.trim(),g=v!=='';if(i.hasAttribute('data-phone'))g=v.replace(/\D/g,'').length>=10;
  var fl=i.closest('.field');if(fl)fl.classList.toggle('bad',!g);if(!g&&ok){ok=false;i.focus()}});
 if(!ok||f._busy)return;var b=f.querySelector('[type=submit]'),bh=b.innerHTML;f._busy=1;b.disabled=true;b.textContent=T('Sending…');
 window.rhSend(f,f.id==='service-form'?'Client request':'Contact message',function(s){f._busy=0;b.disabled=false;b.innerHTML=bh;if(!s){toast(T("Sorry, that didn't send. Please call (800) 700-9181 or email info@rhino.insure."));return}var d=f.nextElementSibling;f.hidden=true;d.hidden=false;d.focus()})})});
// guide filters
var gc=$('#gcards');if(gc){$$('.chip').forEach(function(c){c.addEventListener('click',function(){var f=c.dataset.f;$$('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});$$('.gcard',gc).forEach(function(g){g.hidden=f!=='all'&&g.dataset.cat!==f})})})}
// client request picker
var st=$('#s-type');if(st){function sync(){$$('[data-svc]').forEach(function(x){x.hidden=x.dataset.svc!==st.value})}
 st.addEventListener('change',sync);
 function pick(k){if(k==='pay'){$('#pay').scrollIntoView({behavior:'smooth',block:'center'});return}st.value=k;sync()}
 $$('[data-req]').forEach(function(a){a.addEventListener('click',function(){pick(a.dataset.req)})});
 var h=location.hash.slice(1);if(h&&st.querySelector('option[value="'+h+'"]')){st.value=h;sync();setTimeout(function(){$('#request').scrollIntoView()},50)}}
})();
(function(){
var lb=document.querySelector('.lbtn'),lp=document.getElementById('lpop');
if(lb&&lp){function lset(o){lb.setAttribute('aria-expanded',o);lp.hidden=!o}
 lb.addEventListener('click',function(e){e.stopPropagation();lset(lp.hidden)});
 document.addEventListener('click',function(e){if(!lp.hidden&&!lp.contains(e.target))lset(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lp.hidden){lset(false);lb.focus()}})}
var sw=[].slice.call(document.querySelectorAll('[data-lang]')),lg=document.documentElement.lang||'en',alt={};
function get(){try{return localStorage.getItem('rh_lang')}catch(e){return null}}function set(v){try{localStorage.setItem('rh_lang',v)}catch(e){}}
sw.forEach(function(a){alt[a.dataset.lang]=a.getAttribute('href');a.addEventListener('click',function(){set(a.dataset.lang)})});
var p=get(),fresh=!document.referrer||document.referrer.indexOf(location.host)<0;
if(p&&lg==='en'&&p!=='en'&&alt[p]&&fresh){location.replace(alt[p]);return}
if(p||lg!=='en')return;
var n=(navigator.languages||[navigator.language||'']).join(',').toLowerCase(),t=/(^|,)uk/.test(n)?'uk':/(^|,)ru/.test(n)?'ru':'';if(!t||!alt[t])return;
var tx={ru:['Есть версия сайта на русском языке.','Открыть по-русски','Закрыть'],uk:['Є версія сайту українською мовою.','Відкрити українською','Закрити']}[t];
var b=document.createElement('div');b.className='lsug';b.setAttribute('lang',t);
b.innerHTML='<div class="w"><span>'+tx[0]+'</span><a href="'+alt[t]+'">'+tx[1]+'</a><button type="button" aria-label="'+tx[2]+'">×</button></div>';
b.querySelector('a').addEventListener('click',function(){set(t)});b.querySelector('button').addEventListener('click',function(){set('en');b.remove()});
document.body.insertBefore(b,document.body.firstChild);
})();
(function(){var f=document.getElementById('start');if(!f||!('IntersectionObserver' in window))return;
new IntersectionObserver(function(e){document.body.classList.toggle('atform',e[0].isIntersecting)},{rootMargin:'0px 0px -80px 0px'}).observe(f)})();