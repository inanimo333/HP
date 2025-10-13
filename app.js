/* =====================================================================
app.js（注釈付き）
- 役割1：ハッシュルーター（#news 等でセクション切替）
- 役割2：MUSICのモーダル（クリックで詳細＋リンクを動的生成）
===================================================================== */

/* 1) ルーター
   - data-route を持つ <a> をクリック → #hash に書き換え
   - hashchange / DOMContentLoaded で該当セクションだけ表示 */
(function router(){
  const routes = Array.from(document.querySelectorAll('.route'));
  const links  = Array.from(document.querySelectorAll('[data-route]'));

  function setActive(hash){
    if(!hash || hash==='#') hash = '#home';           // 初期表示は HOME
    const id = hash.slice(1);                          // 例: "#music" → "music"
    routes.forEach(r => r.style.display = (r.id===id?'block':'none'));
    // ナビのアクティブ表示（色）
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href')===hash));
    // スクロールは常に上へ（「ページ遷移」感）
    window.scrollTo({top:0, behavior:'smooth'});
    // タイトルをセクションに合わせる（任意）
    const sec = document.getElementById(id);
    if(sec && sec.dataset.title) document.title = `INanim0、、 — ${sec.dataset.title}`;
  }

  // クリック → ハッシュ書き換え
  links.forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      history.pushState(null, '', href);
      setActive(href);
    }
  }));

  window.addEventListener('hashchange', () => setActive(location.hash));
  window.addEventListener('DOMContentLoaded', () => setActive(location.hash || '#home'));
})();

/* 2) MUSICデータ
   - ここを書き換えるだけで、モーダル内容とリンクを更新できる
   - cover は /assets/*.jpg を想定 */
const musicData = {
  neanion: {
    title: "ネアニオン",
    cover: "assets/neanion.JPG",
    desc:  "僕らネアニオン、葦にしがみついている。<br>2025.10.17 Release",
    links: [
      {label:"SpecialSite", url:"neanion/"},
      {label:"DL&Streaming", url:"https://linkco.re/fMsg46gH"},
      {label:"MusicVideo", url:"https://youtu.be/-AcBYQc19eE?si=cIgl4UnQXiVQbQO1"}, 
    ]
  },
  numbness: {
    title: "NUMBNESS",
    cover: "assets/numbness.jpg",
    desc:  "何も感じずにいられることが、大人になるということでしょうか。<br>2025.9.10 Release",
    links: [
      {label:"SpecialSite", url:"NUMBNESS/"},
      {label:"DL&Streaming", url:"https://linkco.re/eqRu0BZX"},
      //{label:"MusicVideo", url:"https://youtu.be/-AcBYQc19eE?si=cIgl4UnQXiVQbQO1"},  
    ]
  },
};

/* 3) MUSIC モーダル
   - .tile（ジャケ）をクリック → musicData から情報を取得 → HTML差し込み
   - aria-hidden の切替で開閉を制御（キーボード操作/スクリーンリーダ配慮） */
(function musicModal(){
  const modal = document.getElementById('musicModal');
  const content = modal.querySelector('.modal-content');

  function open(key){
    const item = musicData[key];
    if(!item) return;
    content.innerHTML = `
     <div class="modal-body">
       <img class="modal-cover" src="${item.cover}" alt="${item.title}">
       <h3 class="modal-title">${item.title}</h3>
       <p class="modal-desc">${item.desc}</p>
       <div class="links">
         ${item.links.map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join('')}
       </div>
     </div>
   `;
    modal.setAttribute('aria-hidden', 'false');
  }
  function close(){ modal.setAttribute('aria-hidden', 'true'); }

  document.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', () => open(t.dataset.key));
  });
  modal.addEventListener('click', (e) => {
    if(e.target.hasAttribute('data-close') || e.target.classList.contains('modal-bg')) close();
  });

  window.addEventListener('keydown', (e) => { if(e.key==='Escape') close(); });
})();




