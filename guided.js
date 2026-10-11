
(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},3200)}
function store(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}function load(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
// open now (Pacific time, Mon-Fri 8-18)
try{var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',weekday:'short',hour:'numeric',hour12:false}).formatToParts(new Date()),w,h;
p.forEach(function(x){if(x.type==='weekday')w=x.value;if(x.type==='hour')h=+x.value%24});var o=['Sat','Sun'].indexOf(w)<0&&h>=9&&h<18;
$$('[data-open]').forEach(function(d){d.classList.toggle('on',o)});$$('[data-open-txt]').forEach(function(t){t.textContent=o?'Agents available now':'Closed now · opens 9am PT'})}catch(e){}
// coverage dropdown (desktop)
var dd=$('.dd'),db=$('.ddbtn');if(dd){var hov=matchMedia('(hover:hover) and (min-width:921px)');
 function setdd(o){dd.classList.toggle('open',o);db.setAttribute('aria-expanded',o)}
 db.addEventListener('click',function(){setdd(!dd.classList.contains('open'))});
 dd.addEventListener('mouseenter',function(){if(hov.matches)setdd(true)});dd.addEventListener('mouseleave',function(){if(hov.matches)setdd(false)});
 document.addEventListener('click',function(e){if(!dd.contains(e.target))setdd(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&dd.classList.contains('open')){setdd(false);db.focus()}})}
// mobile menu
var m=$('.menu'),n=$('#nav');if(m){m.addEventListener('click',function(){var x=m.getAttribute('aria-expanded')!=='true';m.setAttribute('aria-expanded',x);n.classList.toggle('open',x);document.body.classList.toggle('mopen',x)});
$$('a',n).forEach(function(a){a.addEventListener('click',function(){m.setAttribute('aria-expanded','false');n.classList.remove('open');document.body.classList.remove('mopen')})})}
// "have this handy" hint
function need(form){var c=form.querySelector('input[name=cov]:checked'),b=$('[data-need-title]',form),s=$('[data-need]',form);if(!b)return;
 var d=c&&COV[c.value];if(d){b.textContent='For '+d.n.toLowerCase().replace('sr-22','SR-22')+', have this handy:';s.textContent=d.r.join(', ')}else{b.textContent='Not sure?';s.textContent="Pick this and tell us what's going on. We'll figure out the right coverage."}}
// quick-start forms (home, SR-22 page) -> quote.html
$$('form[data-start]').forEach(function(f){
 $$('input[name=cov]',f).forEach(function(r){r.addEventListener('change',function(){need(f)})});need(f);
 f.addEventListener('submit',function(e){e.preventDefault();var z=f.querySelector('[name=zip]');if(!/^\d{5}$/.test(z.value)){z.focus();z.closest('.field').classList.add('bad');toast('Enter a 5-digit ZIP code.');return}
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
 $('#stepno').textContent=step<4?'Step '+step+' of 3':'Done';back.hidden=step===1||step===4;next.hidden=step===4;
 next.innerHTML=(step===3?'Send my quote request ':'Continue ')+'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
 var c=q.querySelector('input[name=cov]:checked').value;$$('[data-for]',q).forEach(function(d){d.classList.toggle('show',d.dataset.for.split(' ').indexOf(c)>=0)});
 if(step>1){var t=steps[step-1].querySelector('h1,h2');if(t){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}q.scrollIntoView({behavior:'smooth',block:'start'})}}
function valid(){var ok=true;$$('.qs[data-step="'+step+'"] [required]',q).forEach(function(i){var v=i.value.trim(),good=v!=='';
 if(i.type==='checkbox')good=i.checked;if(i.hasAttribute('data-zip'))good=/^\d{5}$/.test(v);if(i.hasAttribute('data-phone'))good=v.replace(/\D/g,'').length>=10;
 var fl=i.closest('.field');if(fl)fl.classList.toggle('bad',!good);if(i.type==='checkbox')$('[data-consent-err]').classList.toggle('on',!good);
 if(!good&&ok){ok=false;i.focus()}});return ok}
q.addEventListener('submit',function(e){e.preventDefault();if(!valid())return;if(step===3){$('[data-name]',q).textContent=$('#qfn').value.trim();step=4;show();toast('Preview only: nothing was sent.');return}step++;show()});
back.addEventListener('click',function(){step--;show()});
$('#qz').addEventListener('input',function(e){e.target.value=e.target.value.replace(/\D/g,'').slice(0,5)});
show();
})();

(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},3200)}
// carry the hero's extra question into the quote notes
$$('form[data-start]').forEach(function(f){f.addEventListener('submit',function(){var n=$$('[data-note]',f).map(function(x){return x.value?x.dataset.note+': '+x.value:''}).filter(Boolean).join('\n');try{sessionStorage.setItem('rh_note',n)}catch(e){}})});
var qn=$('#qn');if(qn){try{var v=sessionStorage.getItem('rh_note');if(v){qn.value=v;sessionStorage.removeItem('rh_note')}}catch(e){}}
// simple forms (contact, client requests)
$$('form[data-simple]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
 $$('[required]',f).forEach(function(i){if(i.closest('[hidden]'))return;var v=i.value.trim(),g=v!=='';if(i.hasAttribute('data-phone'))g=v.replace(/\D/g,'').length>=10;
  var fl=i.closest('.field');if(fl)fl.classList.toggle('bad',!g);if(!g&&ok){ok=false;i.focus()}});
 if(!ok)return;var d=f.nextElementSibling;f.hidden=true;d.hidden=false;d.focus();toast('Preview only: nothing was sent.')})});
// guide filters
var gc=$('#gcards');if(gc){$$('.chip').forEach(function(c){c.addEventListener('click',function(){var f=c.dataset.f;$$('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});$$('.gcard',gc).forEach(function(g){g.hidden=f!=='all'&&g.dataset.cat!==f})})})}
// client request picker
var st=$('#s-type');if(st){function sync(){$$('[data-svc]').forEach(function(x){x.hidden=x.dataset.svc!==st.value})}
 st.addEventListener('change',sync);
 function pick(k){if(k==='pay'){$('#pay').scrollIntoView({behavior:'smooth',block:'center'});return}st.value=k;sync()}
 $$('[data-req]').forEach(function(a){a.addEventListener('click',function(){pick(a.dataset.req)})});
 var h=location.hash.slice(1);if(h&&st.querySelector('option[value="'+h+'"]')){st.value=h;sync();setTimeout(function(){$('#request').scrollIntoView()},50)}}
})();
