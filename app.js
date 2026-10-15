const products = [
  {id:'espirometria', cat:'ocupacionais', title:'Espirometria', desc:'Exame de função pulmonar realizado no consultório.', price:55},
  {id:'aso', cat:'ocupacionais', title:'Consulta Médica / ASO', desc:'Avaliação médica ocupacional e emissão do ASO.', price:60},
  {id:'periodico', cat:'ocupacionais', title:'Exame Periódico', desc:'Avaliação periódica ocupacional.', price:50},
  {id:'retorno', cat:'ocupacionais', title:'Retorno ao Trabalho', desc:'Exame clínico ocupacional de retorno ao trabalho.', price:70},
  {id:'mudanca', cat:'ocupacionais', title:'Mudança de Função', desc:'Avaliação clínica para mudança de função.', price:50},
  {id:'audiometria', cat:'audicao', title:'Audiometria Tonal', desc:'Avaliação da audição para acompanhamento ocupacional.', price:30},
  {id:'visao', cat:'audicao', title:'Acuidade Visual (Snellen)', desc:'Triagem e avaliação de acuidade visual.', price:30},
  {id:'ishihara', cat:'audicao', title:'Teste Ishihara (Cores)', desc:'Avaliação de percepção cromática.', price:20},
  {id:'ecg', cat:'cardio', title:'ECG — Eletrocardiograma', desc:'ECG convencional de até 12 derivações.', price:45},
  {id:'raioxpa', cat:'imagem', title:'Raio X — Tórax PA', desc:'Radiografia de tórax em projeção PA.', price:36},
  {id:'raioxoit', cat:'imagem', title:'Raio X — Tórax Perfil (OIT)', desc:'Radiografia de tórax com perfil OIT.', price:37},
  {id:'raioxcombo', cat:'imagem', title:'Raio X — Tórax PA + Perfil (OIT)', desc:'Projeções PA e perfil conforme item de referência.', price:52},
  {id:'raioxlombar', cat:'imagem', title:'Raio X — Coluna Lombar', desc:'Radiografia de coluna lombar.', price:90},
  {id:'raioxcolunalombo', cat:'imagem', title:'Raio X — Coluna Lombo-Sacra PA', desc:'Radiografia lombo-sacra.', price:46},
  {id:'hemograma', cat:'lab', title:'Hemograma Completo', desc:'Exame hematológico de rotina.', price:20},
  {id:'hemoplaq', cat:'lab', title:'Hemograma com Contagem de Plaquetas', desc:'Hemograma com contagem de plaquetas.', price:20},
  {id:'glicemia', cat:'lab', title:'Glicemia em Jejum', desc:'Dosagem de glicose em jejum.', price:18},
  {id:'creatinina', cat:'lab', title:'Creatinina', desc:'Avaliação laboratorial da função renal.', price:20},
  {id:'colesterol', cat:'lab', title:'Colesterol Total e Frações', desc:'Painel de colesterol.', price:24},
  {id:'urina', cat:'lab', title:'Exame de Urina (EAS)', desc:'Análise de urina tipo 1.', price:15},
  {id:'vdrl', cat:'lab', title:'VDRL Lues', desc:'Exame sorológico de triagem.', price:20},
  {id:'tgo', cat:'lab', title:'TGO (AST)', desc:'Dosagem de aspartato aminotransferase.', price:22.5},
  {id:'tgp', cat:'lab', title:'TGP (ALT)', desc:'Dosagem de alanina aminotransferase.', price:22.5},
  {id:'ggt', cat:'lab', title:'Gama GT / GGT', desc:'Dosagem de gama glutamil transferase.', price:22.5},
  {id:'acido-urico', cat:'lab', title:'Ácido Úrico', desc:'Dosagem de ácido úrico.', price:20},
  {id:'potassio', cat:'lab', title:'Potássio', desc:'Dosagem de potássio sanguíneo.', price:20},
  {id:'sodio', cat:'lab', title:'Sódio Sanguíneo', desc:'Dosagem de sódio.', price:20},
  {id:'bilirrubinas', cat:'lab', title:'Bilirrubinas Totais e Frações', desc:'Avaliação de bilirrubinas.', price:25},
  {id:'carboxi', cat:'lab', title:'Carboxihemoglobina', desc:'Exame relacionado à exposição ocupacional ao monóxido de carbono.', price:28},
  {id:'beta-hcg', cat:'lab', title:'Beta-HCG Qualitativo', desc:'Teste laboratorial qualitativo.', price:25},
  {id:'cadmio', cat:'lab', title:'Cádmio', desc:'Dosagem para avaliação de exposição ocupacional.', price:35},
  {id:'chumbo', cat:'lab', title:'Chumbo Urinário', desc:'Dosagem para avaliação de exposição ocupacional.', price:35},
  {id:'cobre', cat:'lab', title:'Cobre', desc:'Dosagem laboratorial.', price:30},
  {id:'selênio', cat:'lab', title:'Selênio', desc:'Dosagem laboratorial.', price:35}
];
const $=id=>document.getElementById(id);
const normalize=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const money=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const onsite=new Set(['espirometria','aso','periodico','retorno','mudanca','audiometria','visao','ishihara','ecg']);
const storageKey='felipe-exam-request-v1';
let cart={};let expanded=false;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const p of products){const q=saved?.[p.id];if(Number.isInteger(q)&&q>0&&q<=999)cart[p.id]=q;}}catch{}
// Event hooks for a future analytics provider; no personal data is included.
function track(event,detail={}){window.dispatchEvent(new CustomEvent('site:analytics',{detail:{event,...detail}}));}
function notify(message){$('notice').textContent=message;$('notice').style.display='block';clearTimeout(window.noticeTimer);window.noticeTimer=setTimeout(()=>{$('notice').style.display='none';},2500);}
function filtered(){const q=normalize($('search').value);return products.filter(p=>($('category').value==='all'||p.cat===$('category').value)&&normalize(p.title+' '+p.desc+' '+({audicao:'audição visão',ocupacionais:'ocupacional',cardio:'cardiológico',imagem:'imagem',lab:'laboratorial'})[p.cat]).includes(q));}
function render(){const list=filtered(),isFiltering=$('search').value.trim()||$('category').value!=='all';const visible=expanded||isFiltering?list:list.slice(0,6);$('products').innerHTML=visible.map(p=>`<article class="card"><div class="eyebrow">${({ocupacionais:'Ocupacionais',audicao:'Audição e visão',cardio:'Cardiológicos',imagem:'Imagem',lab:'Laboratoriais'})[p.cat]}</div><h3 style="margin-top:20px">${p.title}</h3><p>${p.desc}</p><span class="location-badge">${onsite.has(p.id)?"No consultório":"Em parceiro"}</span><div class="price-row"><strong>${money(p.price)}</strong><button class="btn" data-add="${p.id}" aria-label="Adicionar ${p.title}">Adicionar +</button></div><small>Preço por pessoa</small></article>`).join('')||'<p class="empty">Nenhum exame encontrado. Tente outro termo ou fale com o consultório.</p>';$('showall').hidden=!!isFiltering||list.length<=6;$('showall').textContent=expanded?'Mostrar lista inicial':'Ver catálogo completo ('+products.length+')';}
function updateCart(){let total=0,count=0;const list=products.filter(p=>cart[p.id]);$('cartitems').innerHTML=list.map(p=>{const q=cart[p.id];count+=q;total+=q*p.price;return `<div class="cartrow"><div><h3>${p.title}</h3><p>${money(p.price)} por pessoa</p></div><div class="qty"><button data-change="${p.id}" data-delta="-1" aria-label="Diminuir quantidade de ${p.title}">−</button><span>${q}</span><button data-change="${p.id}" data-delta="1" aria-label="Aumentar quantidade de ${p.title}">+</button></div></div>`;}).join('')||'<p>Sua solicitação está vazia. Adicione exames ou fale diretamente com o consultório.</p>';$('count').textContent=count;$('total').textContent=money(total);$('send').disabled=count===0;try{localStorage.setItem(storageKey,JSON.stringify(cart));}catch{}}
$('products').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;const id=b.dataset.add;cart[id]=Math.min((cart[id]||0)+1,999);updateCart();track('request_add',{exam:id});notify('Exame adicionado à solicitação');});
$('cartitems').addEventListener('click',e=>{const b=e.target.closest('[data-change]');if(!b)return;const id=b.dataset.change;cart[id]=Math.min((cart[id]||0)+Number(b.dataset.delta),999);if(cart[id]<=0)delete cart[id];updateCart();});
$('search').addEventListener('input',()=>{render();clearTimeout(window.searchTimer);window.searchTimer=setTimeout(()=>track('catalog_search',{result_count:filtered().length}),600);});$('category').addEventListener('change',render);$('showall').addEventListener('click',()=>{expanded=!expanded;render();});
$('cartopen').addEventListener('click',()=>{$('cartdialog').showModal();track('request_open');});$('cartclose').addEventListener('click',()=>$('cartdialog').close());$('clear').addEventListener('click',()=>{cart={};updateCart();notify('Solicitação limpa');});
$('send').addEventListener('click',()=>{const items=products.filter(p=>cart[p.id]);if(!items.length)return;const total=items.reduce((n,p)=>n+p.price*cart[p.id],0);const lines=['Olá, Dr. Felipe! Gostaria de confirmar o atendimento para os seguintes exames:','',...items.map(p=>`${p.title} — ${cart[p.id]} pessoa(s) — ${money(p.price*cart[p.id])}`),'',`Total de referência: ${money(total)}`,'Gostaria de confirmar os valores, a disponibilidade, os locais de realização e os documentos necessários.'];track('whatsapp_request',{item_count:items.length});window.open('https://wa.me/5548920013350?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');});
document.querySelectorAll('[data-event]').forEach(a=>a.addEventListener('click',()=>track(a.dataset.event)));
render();updateCart();
