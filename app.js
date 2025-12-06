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
    if(sec && sec.dataset.title) document.title = `INanimO — ${sec.dataset.title}`;
  }

  // クリック → ハッシュ書き換え
  /* links.forEach(a => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if(href && href.startsWith('#')){
      e.preventDefault();
      history.pushState(null, '', href);
      setActive(href);
    }
  })); */

  links.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    history.pushState(null, '', href);
    setActive(href);

    // 📱 スマホメニューを閉じる処理
    const nav = document.querySelector('.nav');
    const menuBtn = document.getElementById('menu-toggle');
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuBtn.classList.remove('active');
    }
  });
});


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
      {label:"About", url:"neanion/"},
      {label:"DL&Streaming", url:"https://lnk.to/neanion"},
      {label:"MusicVideo", url:"https://youtu.be/-AcBYQc19eE?si=cIgl4UnQXiVQbQO1"}, 
    ]
  },
  numbness: {
    title: "NUMBNESS",
    cover: "assets/numbness.jpg",
    desc:  "何も感じずにいられることが、大人になるということでしょうか。<br>2025.9.10 Release",
    links: [
      {label:"About", url:"NUMBNESS/"},
      {label:"DL&Streaming", url:"https://lnk.to/numbness"},
      //{label:"MusicVideo", url:"https://youtu.be/-AcBYQc19eE?si=cIgl4UnQXiVQbQO1"},  
    ]
  },
 tendousetsu: {
    title: "天動説",
    cover: "assets/tendousetsu.JPG",
    desc:  "太陽が照らしてくれるのを待っている。まるで天動説のように。<br>2025.11.10 Release",
    links: [
      {label:"About", url:"tendousetsu/"},
      {label:"DL&Streaming", url:"https://lnk.to/Tendousetsu"},
      {label:"MusicVideo", url:"https://youtu.be/3L26d93b6Rs"},  
    ]
  },
　SekiryoSenka: {
    title: "寂寥戦歌",
    cover: "assets/Sekiryo Senka.PNG",
    desc:  "寂寥感を背負って生きる。<br>2025.12.08 Release",
    links: [
      {label:"About", url:"Sekiryo Senka/"},
      {label:"DL&Streaming", url:"https://lnk.to/"},
      {label:"MusicVideo", url:"https://youtu.be/_0yFN1Pfp_c"},  
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
        　${item.links.map(l => `<a href="${l.url}" rel="noopener noreferrer">${l.label}</a>`).join('')}
       </div>
     </div>
   `;

    // 🔽 追加：モーダル内リンクは確実に開く（PC対策）
    content.addEventListener('click', (e) => {
      const a = e.target.closest('.links a, a.pill, .modal-body a');
      if (!a) return;
      e.preventDefault();      // 既存のルーター横取りを無効化
      e.stopPropagation();     // 背景のクリックハンドラに渡さない
      window.open(a.href, '_blank', 'noopener');
    }); 

/*content.addEventListener('click', (e) => {
  const a = e.target.closest('.links a');
  if (!a) return;

  // まず通常遷移（ブラウザに任せる）
  // ※ preventDefault しないのが基本

  // ↑でうまくいかない環境向けの手動オープン
  e.preventDefault(); // ←基本OFF。必要なら下のフォールバック時だけ。

 /* const w = window.open(a.href, '_blank', 'noopener');
  if (!w) {
    // ブロック検知された時だけ案内
    e.preventDefault();
    alert('新規タブがブロックされました。ポップアップを許可するか、Ctrl/⌘キーを押しながらクリックしてください。');
  }
});*/


    modal.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
  }

  function close(){
    modal.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', () => open(t.dataset.key));
  });

  // 🔄 置き換え：背景クリックだけで閉じる（カード内は閉じない）
  modal.addEventListener('click', (e) => {
    const inCard = e.target.closest('.modal-content');
    const isClose = e.target.hasAttribute('data-close');
    if (!inCard || isClose) close();
  });

  window.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
})();

// 内部ナビだけ SPA 遷移にする（外部/target=_blankは素通り）
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  const isInternal = a.matches('[data-route]');
  if (!isInternal) return;        // ← ここで外部リンクは触らない
  e.preventDefault();
  history.pushState(null, '', a.getAttribute('href'));
  setActive(a.getAttribute('href'));
});

content.addEventListener('click', (e) => {
  const a = e.target.closest('.links a');
  if (!a) return;
  // モーダルを閉じてから同じウィンドウで遷移
  close();
});








