// 파일 위치: index.html과 같은 폴더에 mdb.json을 두는 것을 권장
// 대안 경로 ./data/mdb.json도 시도

const state = {
  all: [],
  filtered: [],
  i: 0,
  showKo: false,
  clozeMode: false
};

const el = {
  filters: document.getElementById('filters'),
  card: document.getElementById('card')
};

init();

async function init(){
  await loadData();
  buildFilterUI();
  applyFilters();
  restoreIndex();
  render();
  attachGlobalKeys();
}

async function loadData(){
  try{
    let res = await fetch('./mdb.json', {cache: 'no-store'});
    if(!res.ok) res = await fetch('./data/mdb.json', {cache: 'no-store'});
    const json = await res.json();
    state.all = Array.isArray(json.sentences) ? json.sentences : [];
  }catch(err){
    console.error(err);
    el.card.innerHTML = `
      <div class="en">데이터를 불러오지 못했습니다.</div>
      <div class="ko">mdb.json 경로를 확인하세요. (예: ./mdb.json)</div>
    `;
  }
}

function buildFilterUI(){
  // 파트/레벨 셀렉트
  const parts = unique(state.all.map(s=>s.part)).sort((a,b)=>a-b);
  const levels = unique(state.all.map(s=>s.level));

  el.filters.innerHTML = `
    <select id="partSel" class="select">
      <option value="">Part 전체</option>
      ${parts.map(p=>`<option value="${p}">Part ${p}</option>`).join('')}
    </select>
    <select id="levelSel" class="select">
      <option value="">Level 전체</option>
      ${levels.map(l=>`<option value="${l}">${cap(l)}</option>`).join('')}
    </select>
  `;

  document.getElementById('partSel').addEventListener('change', ()=>{ applyFilters(true); });
  document.getElementById('levelSel').addEventListener('change', ()=>{ applyFilters(true); });
}

function applyFilters(resetIndex=false){
  const partVal = document.getElementById('partSel').value;
  const levelVal = document.getElementById('levelSel').value;

  state.filtered = state.all.filter(s=>{
    const byPart = partVal ? String(s.part) === String(partVal) : true;
    const byLevel = levelVal ? s.level === levelVal : true;
    return byPart && byLevel;
  });

  if(resetIndex) state.i = 0;
  if(state.filtered.length === 0){
    el.card.innerHTML = `
      <div class="en">조건에 맞는 문장이 없습니다.</div>
      <div class="ko">필터를 변경해 보세요.</div>
    `;
  }
}

function render(){
  if(state.filtered.length === 0) return;

  const s = state.filtered[state.i];

  // 표시 문장: 클로즈 모드면 s.cloze, 아니면 s.text
  const mainText = state.clozeMode && s.cloze ? s.cloze : s.text;

  // 보기 토글
  const koClass = state.showKo ? 'ko' : 'ko hidden';

  // 4지선다(있는 경우만)
  const choices = buildChoices(s);

  el.card.innerHTML = `
    <div class="badges">
      <span class="badge">Part ${s.part}</span>
      <span class="badge">${cap(s.level)}</span>
      <span class="badge">${s.topic}</span>
      <span class="badge">${s.pattern}</span>
    </div>

    <div class="en" id="en">${escapeHtml(mainText)}</div>
    <div id="ko" class="${koClass}">${escapeHtml(s.translation_ko || '')}</div>

    ${choices.html}

    <div class="controls">
      <button class="btn" id="prevBtn"><span class="material-symbols-outlined">chevron_left</span>이전</button>
      <button class="btn" id="nextBtn">다음<span class="material-symbols-outlined">chevron_right</span></button>
      <button class="btn ghost" id="toggleKo"><span class="material-symbols-outlined">translate</span>해석</button>
      <button class="btn ghost" id="toggleCloze"><span class="material-symbols-outlined">format_underlined</span>빈칸</button>
      ${s.audio ? `<button class="btn ghost" id="playAudio"><span class="material-symbols-outlined">volume_up</span>오디오</button>` : ''}
    </div>

    <div class="progress">${state.i+1} / ${state.filtered.length} | ${s.id}</div>

    <div id="explain" class="explain hidden">${escapeHtml(s.explanation || '')}</div>
  `;

  // 이벤트
  document.getElementById('prevBtn').addEventListener('click', prev);
  document.getElementById('nextBtn').addEventListener('click', next);
  document.getElementById('toggleKo').addEventListener('click', ()=>{
    state.showKo = !state.showKo; render();
  });
  document.getElementById('toggleCloze').addEventListener('click', ()=>{
    state.clozeMode = !state.clozeMode; render();
  });

  if(choices.exists){
    document.querySelectorAll('.choice').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const pick = e.currentTarget.dataset.val;
        checkAnswer(pick);
      });
    });
  }

  if(document.getElementById('playAudio')){
    document.getElementById('playAudio').addEventListener('click', ()=>{
      const audio = new Audio(s.audio);
      audio.play().catch(()=>{ /* 파일 없을 수 있음 */ });
    });
  }

  persistIndex();
}

function buildChoices(s){
  if(!s.answer || !Array.isArray(s.distractors) || s.distractors.length === 0){
    return { html: '', exists: false };
  }
  const arr = shuffle([s.answer, ...s.distractors].slice(0,4));
  const html = `
    <div class="choices">
      ${arr.map(v=>`<button class="choice" data-val="${escapeAttr(v)}">${escapeHtml(v)}</button>`).join('')}
    </div>
  `;
  return { html, exists: true };
}

function checkAnswer(pick){
  const s = state.filtered[state.i];
  const nodes = document.querySelectorAll('.choice');
  nodes.forEach(n=>{
    const v = n.dataset.val;
    if(v === s.answer){
      n.classList.add('correct');
    }else if(v === pick){
      n.classList.add('wrong');
    }
    n.disabled = true;
  });

  // 해설 표시
  const ex = document.getElementById('explain');
  if(ex && s.explanation){
    ex.classList.remove('hidden');
  }
}

function prev(){
  state.i = (state.i - 1 + state.filtered.length) % state.filtered.length;
  render();
}
function next(){
  state.i = (state.i + 1) % state.filtered.length;
  render();
}

function persistIndex(){
  const key = 'toeic_idx';
  localStorage.setItem(key, String(state.i));
}
function restoreIndex(){
  const key = 'toeic_idx';
  const saved = Number(localStorage.getItem(key));
  if(!Number.isNaN(saved) && saved >= 0 && saved < state.filtered.length){
    state.i = saved;
  }
}

/* 유틸 */
function unique(arr){ return [...new Set(arr.filter(v=>v!==undefined && v!==null))]; }
function cap(s){ return String(s||'').replace(/^\w/, c=>c.toUpperCase()); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function escapeHtml(s=''){ return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function escapeAttr(s=''){ return String(s).replace(/"/g, '&quot;'); }

function attachGlobalKeys(){
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });
}
