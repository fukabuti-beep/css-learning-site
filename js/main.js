/* ===================================
   CSS学習サイト - メインJavaScript
   =================================== */

// ===================================
// レッスンIDリスト
// ===================================
const LESSONS = [
  { id: '01-html-basics',           title: 'HTMLの基礎' },
  { id: '02-css-intro',             title: 'CSSとは何か' },
  { id: '03-selectors',             title: 'セレクター完全ガイド' },
  { id: '04-box-model',             title: 'ボックスモデル' },
  { id: '05-typography',            title: 'タイポグラフィ' },
  { id: '06-colors',                title: '色と背景' },
  { id: '07-flexbox',               title: 'Flexbox完全ガイド' },
  { id: '08-grid',                  title: 'CSS Grid完全ガイド' },
  { id: '09-positioning',           title: 'ポジショニング' },
  { id: '10-responsive',            title: 'レスポンシブデザイン' },
  { id: '11-transitions-animations',title: 'トランジション・アニメーション' },
  { id: '12-css-variables',         title: 'CSS変数（カスタムプロパティ）' },
  { id: '13-pseudo',                title: '疑似クラス・疑似要素' },
  { id: '14-design-principles',     title: 'デザイン原則' },
];

const STORAGE_KEY = 'css-learning-progress';

// ===================================
// 進捗管理
// ===================================
function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function markLessonComplete(lessonId) {
  const progress = getProgress();
  progress[lessonId] = true;
  saveProgress(progress);
  updateProgressUI();
  updateCompleteButton(lessonId);
}

function isCompleted(lessonId) {
  return !!getProgress()[lessonId];
}

function getCompletionCount() {
  const progress = getProgress();
  return LESSONS.filter(l => progress[l.id]).length;
}

function getProgressPercent() {
  return Math.round((getCompletionCount() / LESSONS.length) * 100);
}

// ===================================
// UI更新
// ===================================
function updateProgressUI() {
  const pct = getProgressPercent();

  // サイドバーの進捗バー
  const fill = document.querySelector('.overall-progress-fill');
  const label = document.querySelector('.overall-progress-label span');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct;

  // サイドバーの各リンク
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-lesson-id]');
  const progress = getProgress();
  sidebarLinks.forEach(link => {
    const id = link.dataset.lessonId;
    if (progress[id]) {
      link.classList.add('completed');
    } else {
      link.classList.remove('completed');
    }
  });

  // トップページのレッスンアイテム
  const lessonItems = document.querySelectorAll('.lesson-item[data-lesson-id]');
  lessonItems.forEach(item => {
    const id = item.dataset.lessonId;
    if (progress[id]) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  });

  // トップページの全体進捗
  const indexPct = document.getElementById('index-progress-pct');
  const indexFill = document.getElementById('index-progress-fill');
  if (indexPct) indexPct.textContent = pct;
  if (indexFill) indexFill.style.width = pct + '%';
}

function updateCompleteButton(lessonId) {
  const section = document.querySelector('.lesson-complete-section');
  const btn = document.getElementById('complete-btn');
  if (!section || !btn) return;

  section.classList.add('completed');
  btn.innerHTML = '✓ 完了済み！';
  btn.disabled = true;
  btn.style.opacity = '0.7';
}

// ===================================
// 現在のレッスンIDを取得
// ===================================
function getCurrentLessonId() {
  const path = window.location.pathname;
  const match = path.match(/lessons\/(.+)\.html/);
  return match ? match[1] : null;
}

// ===================================
// 完了ボタン（レッスンページ用）
// ===================================
window.markComplete = function () {
  const lessonId = getCurrentLessonId();
  if (lessonId) {
    markLessonComplete(lessonId);
  }
};

// ===================================
// コードコピー機能
// ===================================
function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyCode(btn));
  });
}

window.copyCode = function (btn) {
  const codeBlock = btn.closest('.code-block');
  const code = codeBlock ? codeBlock.querySelector('code') : null;
  if (!code) return;

  const text = code.innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ コピー済み';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'コピー';
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // フォールバック
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✓ コピー済み';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'コピー';
      btn.classList.remove('copied');
    }, 2000);
  });
};

// ===================================
// 読書進捗バー
// ===================================
function initScrollProgressBar() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(pct, 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
}

// ===================================
// スクロールアニメーション
// ===================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ===================================
// モバイルサイドバー
// ===================================
function initMobileSidebar() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!menuBtn || !sidebar) return;

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay && overlay.classList.toggle('active');
  });

  overlay && overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });
}

// ===================================
// アクティブなサイドバーリンクをハイライト
// ===================================
function initActiveSidebarLink() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) return;

  const activeLink = document.querySelector(`.sidebar-link[data-lesson-id="${lessonId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    // スクロールして表示
    activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

// ===================================
// 完了ボタンの初期状態設定
// ===================================
function initCompleteButton() {
  const lessonId = getCurrentLessonId();
  if (!lessonId) return;

  if (isCompleted(lessonId)) {
    const section = document.querySelector('.lesson-complete-section');
    const btn = document.getElementById('complete-btn');
    if (section) section.classList.add('completed');
    if (btn) {
      btn.innerHTML = '✓ 完了済み！';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }
  }
}

// ===================================
// 初期化
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  updateProgressUI();
  initCopyButtons();
  initScrollProgressBar();
  initScrollAnimations();
  initMobileSidebar();
  initActiveSidebarLink();
  initCompleteButton();

  // 現在のレッスンを訪問済みとして記録（任意：自動マーク）
  // const lessonId = getCurrentLessonId();
  // if (lessonId) markLessonComplete(lessonId);
});

// ===================================
// 用語辞典データ
// ===================================
const GLOSSARY_DATA = {
  'html': { title: 'HTML', en: 'HyperText Markup Language', def: 'Webページの構造を定義するマークアップ言語。タグ（<>）を使ってコンテンツの意味と構造を表現します。CSSで見た目、JavaScriptで動作を担当。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'css': { title: 'CSS', en: 'Cascading Style Sheets', def: 'HTMLの見た目（色・フォント・レイアウト）を定義するスタイルシート言語。セレクターでHTML要素を選択し、プロパティで見た目を指定します。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'セレクター': { title: 'セレクター', en: 'CSS Selector', def: 'スタイルを適用するHTML要素を選択するパターン。クラス(.class)、ID(#id)、要素(div)、属性([type])、疑似クラス(:hover)などの種類があります。', category: 'CSS基礎', lesson: 'lessons/03-selectors.html' },
  'カスケード': { title: 'カスケード', en: 'Cascade', def: '複数のCSSルールが同じ要素に適用された場合に、どのスタイルが優先されるかを決める仕組み。詳細度・順序・重要度によって決まります。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  '詳細度': { title: '詳細度', en: 'Specificity', def: 'どのCSSセレクターが優先されるかを決める計算値。インラインスタイル(1000) > ID(100) > クラス(10) > 要素(1)の順で計算されます。', category: 'CSS基礎', lesson: 'lessons/03-selectors.html' },
  '継承': { title: '継承', en: 'Inheritance', def: '親要素のCSSプロパティが子要素に引き継がれる仕組み。font-familyやcolorは継承されますが、marginやborderは継承されません。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'ボックスモデル': { title: 'ボックスモデル', en: 'Box Model', def: 'すべてのHTML要素はボックス（箱）として扱われます。content（内容）+ padding（内側余白）+ border（枠線）+ margin（外側余白）の4層構造。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'マージン': { title: 'マージン', en: 'Margin', def: '要素の外側の余白。隣接する要素との間隔を作ります。上下のマージンは「マージン相殺」という現象が起きることがあります。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'パディング': { title: 'パディング', en: 'Padding', def: '要素の内側の余白。コンテンツとボーダーの間のスペース。背景色はパディング領域にも適用されます。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'Flexbox': { title: 'Flexbox', en: 'Flexible Box Layout', def: '1次元（横または縦）のレイアウトシステム。display: flexで有効化。justify-contentで主軸方向、align-itemsで交差軸方向の配置を制御します。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'CSS Grid': { title: 'CSS Grid', en: 'CSS Grid Layout', def: '2次元（縦横両方向）のレイアウトシステム。display: gridで有効化。grid-template-columnsで列、grid-template-rowsで行を定義します。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'position': { title: 'position', en: 'CSS Position', def: '要素の配置方法を指定するプロパティ。static（通常）、relative（相対）、absolute（絶対）、fixed（固定）、sticky（スティッキー）の5種類。', category: 'レイアウト', lesson: 'lessons/09-positioning.html' },
  'z-index': { title: 'z-index', en: 'Z-Index', def: '要素の重なり順を指定するプロパティ。数値が大きいほど手前に表示されます。positionがstaticの要素には効きません。', category: 'レイアウト', lesson: 'lessons/09-positioning.html' },
  'float': { title: 'float', en: 'CSS Float', def: '要素を左右に浮かせ、テキストや他の要素をその周りに回り込ませます。現在は主にFlexboxやGridに置き換えられています。', category: 'レイアウト', lesson: 'lessons/09-positioning.html' },
  'viewport': { title: 'viewport', en: 'Viewport', def: 'ブラウザでコンテンツが表示される領域。レスポンシブデザインではviewportのサイズに応じてレイアウトを変更します。<meta name="viewport">タグで設定。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'メディアクエリ': { title: 'メディアクエリ', en: 'Media Query', def: 'デバイスの画面幅・向き・解像度などに応じてCSSを切り替える@media構文。モバイルファーストではmin-widthを使用します。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'モバイルファースト': { title: 'モバイルファースト', en: 'Mobile First', def: 'まず小さい画面向けのスタイルを書き、min-widthメディアクエリで大きい画面のスタイルを追加していく設計思想。現代のWeb開発の標準的アプローチ。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'レスポンシブデザイン': { title: 'レスポンシブデザイン', en: 'Responsive Design', def: '一つのHTMLで様々なデバイス（スマートフォン・タブレット・PC）に最適な表示を提供するデザイン手法。Ethan Marcotteが2010年に提唱。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'transition': { title: 'transition', en: 'CSS Transition', def: 'CSSプロパティの変化をアニメーション化するプロパティ。duration（時間）、timing-function（緩急）、delay（遅延）を指定できます。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'animation': { title: 'animation', en: 'CSS Animation', def: '@keyframesで定義したアニメーションを要素に適用するプロパティ。繰り返し・方向・遅延などを細かく制御できます。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'transform': { title: 'transform', en: 'CSS Transform', def: '要素を2D/3D変形するプロパティ。translate（移動）、rotate（回転）、scale（拡大縮小）、skew（傾け）などの関数を組み合わせて使います。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  '@keyframes': { title: '@keyframes', en: '@keyframes', def: 'アニメーションの各ステップを定義するCSSアットルール。0%(from)〜100%(to)の間でプロパティの変化を指定します。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'カスタムプロパティ': { title: 'カスタムプロパティ', en: 'CSS Custom Property', def: '--variable-name形式で定義するCSS変数。var()関数で参照します。デザイントークンの管理やテーマ切り替えに使われます。', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  'CSS変数': { title: 'CSS変数', en: 'CSS Variable', def: '--variable-name形式で定義できる変数。:rootで定義するとグローバル変数になります。JavaScriptからも読み書き可能。', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  'clamp()': { title: 'clamp()', en: 'clamp()', def: 'clamp(最小値, 推奨値, 最大値)の形式で値の範囲を制限するCSS関数。フォントサイズやコンテナ幅のレスポンシブ調整に便利です。', category: 'モダンCSS', lesson: 'lessons/10-responsive.html' },
  '疑似クラス': { title: '疑似クラス', en: 'Pseudo-class', def: '要素の状態（:hover, :focus）や位置（:nth-child）に基づいてスタイルを適用するセレクター。コロン1つ(:)で記述します。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  '疑似要素': { title: '疑似要素', en: 'Pseudo-element', def: '要素の特定部分（::before, ::after）や状態（::placeholder）をスタイリングするセレクター。コロン2つ(::)で記述します。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  'font-family': { title: 'font-family', en: 'font-family', def: 'テキストのフォントを指定するCSSプロパティ。複数のフォントをカンマ区切りで指定し、最初に利用可能なフォントが使われます。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'line-height': { title: 'line-height', en: 'line-height', def: '行の高さ（行間）を指定するプロパティ。単位なしの数値（例: 1.6）で指定するのが推奨。本文には1.6〜1.8が読みやすい。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'rem': { title: 'rem', en: 'Root Em', def: 'ルート要素（html）のフォントサイズを基準にした相対単位。デフォルトは16px = 1rem。アクセシビリティに配慮したサイズ指定に適しています。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'em': { title: 'em', en: 'Em Unit', def: '親要素のフォントサイズを基準にした相対単位。入れ子になると計算が複雑になるため、現在はremの使用が推奨されます。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'グラデーション': { title: 'グラデーション', en: 'CSS Gradient', def: '2色以上の色を滑らかにつないだ背景効果。linear-gradient（直線）、radial-gradient（放射状）、conic-gradient（扇状）の3種類があります。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'opacity': { title: 'opacity', en: 'Opacity', def: '要素全体の不透明度を0（透明）〜1（不透明）で指定するプロパティ。子要素も含めて半透明になります。色の透明度のみ変えたい場合はrgba()を使用。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'コントラスト比': { title: 'コントラスト比', en: 'Contrast Ratio', def: '背景色とテキスト色の明度差の比率。WCAG AA基準では4.5:1以上（大きなテキストは3:1以上）が必要です。アクセシビリティの重要指標。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  'WCAG': { title: 'WCAG', en: 'Web Content Accessibility Guidelines', def: 'W3Cが策定するWebコンテンツのアクセシビリティガイドライン。A・AA・AAAの3段階があり、公共サービスではAA準拠が求められることが多い。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  'セマンティック': { title: 'セマンティック', en: 'Semantic HTML', def: 'コンテンツの意味をHTMLタグで表現すること。<header>, <nav>, <main>, <article>などのセマンティックタグを使うと、SEOやアクセシビリティが向上します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'DOM': { title: 'DOM', en: 'Document Object Model', def: 'HTMLをJavaScriptから操作するためのAPIインターフェース。ブラウザはHTMLをDOMツリーに変換し、JavaScriptで動的に変更できます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },

  /* ── CSS基礎：構文・概念 ── */
  'プロパティ': { title: 'プロパティ', en: 'CSS Property', def: 'CSSで「何を変えるか」を指定するキーワード。例：colorは文字色、font-sizeは文字サイズ、marginは余白を制御します。コロン（:）の左側に書きます。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  '値': { title: '値', en: 'CSS Value', def: 'CSSプロパティに対して「どのように変えるか」を指定する部分。例：color: red の red、font-size: 16px の 16px が値です。コロン（:）の右側に書きます。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  '宣言': { title: '宣言', en: 'CSS Declaration', def: 'CSSの「プロパティ: 値;」の1セットのこと。例：color: red; が1つの宣言です。宣言はセミコロン（;）で終わります。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'ルールセット': { title: 'ルールセット', en: 'CSS Rule Set', def: 'セレクターと{波括弧}で囲まれた宣言のまとまり。h1 { color: red; font-size: 2rem; } 全体がルールセットです。CSSの基本構造単位。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'セミコロン': { title: 'セミコロン', en: 'Semicolon', def: 'CSSの各宣言の末尾に付ける記号（;）。color: red; のように宣言の区切りを示します。最後の宣言でも省略しないのが慣習です。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  '波括弧': { title: '波括弧', en: 'Curly Braces', def: 'CSSのルールセットを囲む記号（{ }）。セレクターの後に開き波括弧{で始まり、すべての宣言を書いた後に閉じ波括弧}で終わります。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'CSSコメント': { title: 'CSSコメント', en: 'CSS Comment', def: '/* このように */ 書く注釈文。ブラウザには無視され、コードの説明や一時的な無効化に使います。複数行にわたって書くことも可能です。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'スタイルシート': { title: 'スタイルシート', en: 'Style Sheet', def: 'CSSルールをまとめたファイルまたは記述のこと。外部スタイルシート（.cssファイル）、内部スタイル（styleタグ）、インラインスタイル（style属性）の3種類があります。', category: 'CSS基礎', lesson: 'lessons/02-css-intro.html' },
  'display': { title: 'display', en: 'display property', def: '要素の表示方法を制御するCSSプロパティ。block（ブロック要素）、inline（インライン要素）、flex（フレックス）、grid（グリッド）、none（非表示）などを指定できます。', category: 'CSS基礎', lesson: 'lessons/07-flexbox.html' },
  'width': { title: 'width / height', en: 'Width & Height', def: '要素の横幅（width）と高さ（height）を指定するプロパティ。px（固定）、%（親要素比率）、vw/vh（画面サイズ比率）、auto（自動）などの値が使えます。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'background-color': { title: 'background-color', en: 'background-color', def: '要素の背景色を指定するプロパティ。color名（red）、16進数（#ff0000）、rgb()、hsl()などで指定できます。透明にするにはtransparentを使います。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'color-property': { title: 'color（プロパティ）', en: 'color property', def: 'テキストの色を指定するCSSプロパティ。background-colorと混同しやすいですが、colorは文字色のみに影響します。値はbackground-colorと同じ形式で指定。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'border': { title: 'border', en: 'border', def: '要素の枠線を指定するプロパティ。border: 太さ スタイル 色; の順で書きます。例：border: 2px solid #333; スタイルにはsolid（実線）、dashed（破線）、dotted（点線）などがあります。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'box-sizing': { title: 'box-sizing', en: 'box-sizing', def: '要素のサイズ計算方法を指定するプロパティ。border-boxを指定すると、widthにpadding・borderが含まれ、レイアウト計算が直感的になります。現代のCSSでは * { box-sizing: border-box; } が標準的。', category: 'CSS基礎', lesson: 'lessons/04-box-model.html' },
  'overflow': { title: 'overflow', en: 'overflow', def: 'コンテンツが要素の範囲をはみ出した際の処理を指定するプロパティ。visible（そのままはみ出す）、hidden（非表示）、scroll（スクロールバー表示）、auto（必要時のみスクロール）。', category: 'CSS基礎' },
  'cursor': { title: 'cursor', en: 'cursor', def: 'マウスカーソルの形状を指定するプロパティ。pointer（指アイコン）はリンクやボタンに、text（テキスト選択）は文字入力部に使います。', category: 'CSS基礎' },

  /* ── HTML基礎：タグ・要素 ── */
  'タグ': { title: 'タグ', en: 'HTML Tag', def: 'HTMLの命令を表す記号。<p>のように<>で囲んで書きます。ほとんどのタグは開始タグ<p>と終了タグ</p>のペアで使います。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  '属性': { title: '属性', en: 'HTML Attribute', def: 'HTMLタグに追加情報を与える記述。<a href="URL">のhref、<img src="画像">のsrcなどがあります。属性名="値"の形式で開始タグ内に書きます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'id属性': { title: 'id属性', en: 'id attribute', def: 'HTML要素に一意の識別名をつける属性。ページ内で同じidは1回しか使えません。CSSでは#nameで選択、JavaScriptではgetElementByIdで取得できます。', category: 'HTML基礎', lesson: 'lessons/03-selectors.html' },
  'class属性': { title: 'class属性', en: 'class attribute', def: 'HTML要素に分類名をつける属性。同じclass名を複数の要素に使えます。CSSでは.nameで選択します。スペース区切りで複数のクラスを同時に指定することも可能。', category: 'HTML基礎', lesson: 'lessons/03-selectors.html' },
  'ブロック要素': { title: 'ブロック要素', en: 'Block-level Element', def: '横幅いっぱいに広がり、前後に改行が入る要素。div, p, h1〜h6, ul, li, header, main などがブロック要素です。CSSで display: block; を指定した要素も同様。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'インライン要素': { title: 'インライン要素', en: 'Inline Element', def: 'テキストと同じ行に並ぶ要素。span, a, strong, em, img などがインライン要素です。width・heightの指定は効きません（imgは例外）。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'head要素': { title: 'head要素', en: '<head> element', def: 'ページの設定情報を書く場所。ブラウザには表示されず、タイトル(<title>)、CSSの読み込み(<link>)、文字コード(<meta charset>)などを記述します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'body要素': { title: 'body要素', en: '<body> element', def: 'ブラウザに実際に表示されるコンテンツを書く場所。テキスト・画像・リンク・ボタンなど、ユーザーが見るすべての要素をbody内に記述します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'インデント': { title: 'インデント', en: 'Indentation', def: 'コードの入れ子構造を視覚的に分かりやすくするためにつける字下げ。スペース2個またはタブ1個が一般的です。インデントを正しくつけると構造が把握しやすくなります。', category: 'HTML基礎' },

  /* ── レイアウト詳細 ── */
  'フレックスコンテナ': { title: 'フレックスコンテナ', en: 'Flex Container', def: 'display: flex; を指定した要素のこと。直接の子要素がフレックスアイテムになります。justify-content・align-itemsで子要素の配置を制御します。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'フレックスアイテム': { title: 'フレックスアイテム', en: 'Flex Item', def: 'フレックスコンテナの直接の子要素のこと。flex-grow（伸び率）、flex-shrink（縮み率）、flex-basis（基本サイズ）でサイズを制御できます。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'gap': { title: 'gap', en: 'gap', def: 'FlexboxやGridで要素間の隙間を指定するプロパティ。gap: 行間 列間; の形式。かつてのgrid-gapを置き換えるモダンな書き方で、marginより直感的に間隔を制御できます。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'justify-content': { title: 'justify-content', en: 'justify-content', def: 'Flexbox・Gridで主軸方向の子要素の配置を制御するプロパティ。flex-start（左寄せ）、center（中央）、flex-end（右寄せ）、space-between（両端揃え）、space-around（均等）。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'align-items': { title: 'align-items', en: 'align-items', def: 'Flexbox・Gridで交差軸方向の子要素の配置を制御するプロパティ。stretch（引き伸ばし）、center（中央）、flex-start（上揃え）、flex-end（下揃え）、baseline（ベースライン揃え）。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'flex-wrap': { title: 'flex-wrap', en: 'flex-wrap', def: 'フレックスアイテムが1行に収まらない場合の折り返しを制御するプロパティ。nowrap（折り返さない）、wrap（折り返す）、wrap-reverse（逆方向に折り返す）。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'grid-template-columns': { title: 'grid-template-columns', en: 'grid-template-columns', def: 'CSSグリッドの列の数とサイズを定義するプロパティ。repeat(3, 1fr)で3等分、repeat(auto-fill, minmax(200px, 1fr))でレスポンシブグリッドを作れます。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'fr単位': { title: 'fr単位', en: 'Fraction Unit (fr)', def: 'CSSグリッドで空きスペースを分割するための単位。1fr 2fr なら1:2の比率で列幅を分割します。%と違い、gapを考慮した上で残りのスペースを分割するのが特徴。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },

  /* ── 単位・数値 ── */
  'px': { title: 'px', en: 'Pixel', def: 'CSSの絶対単位。画面の物理的なピクセル数を基準にした固定サイズ。1px = 画面の最小点1個分。ブラウザのフォントサイズ変更の影響を受けないため、アクセシビリティの観点からremの使用が推奨されます。', category: 'CSS基礎' },
  'パーセント': { title: '%（パーセント）', en: 'Percentage', def: '親要素のサイズを基準にした相対単位。width: 50%; なら親の横幅の半分になります。heightに%を使う場合は親要素に高さが定義されている必要があります。', category: 'CSS基礎' },
  'vw-vh': { title: 'vw / vh', en: 'Viewport Width / Height', def: 'ブラウザの表示領域（viewport）を基準にした単位。1vw = 画面幅の1%、1vh = 画面高さの1%。hero画像の高さにheight: 100vh;、フルワイドのセクションにwidth: 100vw;がよく使われます。', category: 'レスポンシブ' },

  /* ── タイポグラフィ追加 ── */
  'font-weight': { title: 'font-weight', en: 'font-weight', def: 'フォントの太さを指定するプロパティ。normal（400）、bold（700）、またはbolder、lighterや100〜900の数値で指定します。多くのWebフォントは400と700のみ使用可能。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'text-align': { title: 'text-align', en: 'text-align', def: 'テキストの水平方向の揃えを指定するプロパティ。left（左寄せ）、center（中央揃え）、right（右寄せ）、justify（両端揃え）を指定できます。ブロック要素に指定します。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'letter-spacing': { title: 'letter-spacing', en: 'letter-spacing', def: '文字間のスペース（カーニング）を調整するプロパティ。正の値で間隔を広げ、負の値で詰めます。見出しに使うと高級感が出ます。単位はem、remまたはpxで指定。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'Webフォント': { title: 'Webフォント', en: 'Web Font', def: 'ユーザーのPCにないフォントをWebサーバーから読み込む仕組み。Google Fontsが有名で、<link>タグで読み込んでfont-familyで指定します。読み込みに時間がかかるため数を絞るのが推奨。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },

  /* ── 色追加 ── */
  'hex': { title: '16進数カラーコード', en: 'Hex Color', def: '#rrggbb の形式で色を指定する方法。#ff0000は赤、#0000ffは青、#ffffff は白、#000000 は黒です。各2桁が赤(R)・緑(G)・青(B)の強さを00〜ffで表します。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'rgb': { title: 'rgb() / rgba()', en: 'RGB Color', def: 'rgb(赤, 緑, 青) の形式で色を指定。各値は0〜255。rgba()の4番目の値は不透明度（0〜1）。例：rgba(0,0,0,0.5) は半透明の黒。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'hsl': { title: 'hsl() / hsla()', en: 'HSL Color', def: 'hsl(色相, 彩度, 輝度) で色を指定。色相は0〜360（赤→黄→緑→青→紫→赤）、彩度・輝度は%。直感的に色を調整しやすいため、デザイナーに人気の指定方式。', category: '色・背景', lesson: 'lessons/06-colors.html' },

  /* ── モダンCSS追加 ── */
  'root': { title: ':root', en: ':root pseudo-class', def: 'HTMLのルート要素（html要素）を指すCSSの疑似クラス。CSS変数（カスタムプロパティ）を定義する場所として使われます。:root { --main-color: #6C63FF; }', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  'var': { title: 'var()', en: 'var() function', def: 'CSS変数の値を参照するための関数。var(--変数名) の形式で書きます。var(--primary, blue) のように第2引数でフォールバック値を指定できます。', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  'calc': { title: 'calc()', en: 'calc() function', def: '異なる単位を組み合わせた計算ができるCSS関数。例：width: calc(100% - 80px); Flexbox・Gridが普及した現在でも、複雑なサイズ計算に便利です。', category: 'モダンCSS' },
  'min-max-width': { title: 'min-width / max-width', en: 'min-width / max-width', def: '要素の最小・最大幅を制限するプロパティ。max-width: 1200px; でコンテンツが広がりすぎるのを防ぎ、min-width: 320px; でスマートフォンで崩れないようにします。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'aspect-ratio': { title: 'aspect-ratio', en: 'aspect-ratio', def: '要素の縦横比を指定するプロパティ。aspect-ratio: 16/9; で動画のような比率を維持できます。widthかheightのどちらかを指定すれば、もう片方は自動計算されます。', category: 'CSS基礎' },

  /* ── HTML基礎：タグ詳細 ── */
  'DOCTYPE': { title: 'DOCTYPE宣言', en: 'DOCTYPE Declaration', def: 'HTMLファイルの先頭に書く <!DOCTYPE html> という宣言。ブラウザに「これはHTML5で書かれたページです」と伝えます。省略すると互換モードで動作し、レイアウトが崩れる原因になります。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'lang属性': { title: 'lang属性', en: 'lang attribute', def: 'html要素に付けてページの言語を示す属性。<html lang="ja"> と書くと日本語ページと宣言できます。スクリーンリーダーが正しい言語で読み上げ、SEOにも影響します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'charset': { title: 'charset（文字コード）', en: 'charset', def: '<meta charset="UTF-8"> でページの文字エンコーディングを指定します。UTF-8は世界中の文字を扱える標準エンコーディングです。必ずhead要素の最初に書きましょう。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'meta要素': { title: 'meta要素', en: '<meta> element', def: 'ページのメタ情報（設定・説明）をHTMLに埋め込む要素。charset（文字コード）、viewport（表示設定）、description（ページの説明文）などをname/content属性で指定します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'link要素': { title: 'link要素', en: '<link> element', def: '外部リソース（CSSファイル・フォントなど）をHTMLに読み込む要素。<link rel="stylesheet" href="style.css"> でCSSを、Google Fontsのlink要素でWebフォントを読み込みます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'h1-h6': { title: '見出し要素（h1〜h6）', en: 'Heading Elements', def: 'ページのタイトルや見出しを表す要素。h1が最も重要で1ページに1つが推奨、h2〜h6は階層的に使います。SEOと構造的なマークアップに重要です。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'p要素': { title: 'p要素', en: '<p> element', def: '段落（Paragraph）を表すHTML要素。文章のまとまりをp要素で囲みます。ブロック要素なので前後に余白が自動で入ります。改行だけしたい場合はbrタグを使います。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'strong-em': { title: 'strong / em要素', en: 'strong / em elements', def: 'テキストを強調する要素。strong（重要な強調＝太字）とem（アクセント強調＝イタリック）。見た目だけでなくスクリーンリーダーにも強調として伝わります。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'a要素': { title: 'a要素（アンカー）', en: '<a> element', def: 'ハイパーリンクを作るHTML要素。href属性でリンク先URLを指定します。target="_blank" で新しいタブで開き、href="#id名" でページ内の別の箇所にジャンプできます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'img要素': { title: 'img要素', en: '<img> element', def: '画像を表示するHTML要素。終了タグなしの空要素です。src属性で画像ファイルのパスを、alt属性で代替テキストを指定します。widthとheightも指定するとCLS（レイアウトシフト）を防げます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'alt属性': { title: 'alt属性', en: 'alt attribute', def: 'img要素に必須の代替テキスト属性。画像が表示できない場合に表示され、スクリーンリーダーが読み上げます。装飾目的の画像はalt=""（空）で、内容のある画像には内容を説明するテキストを書きます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'ul-ol-li': { title: 'ul / ol / li要素', en: 'List Elements', def: 'リストを作る要素。ul（Unordered List）は順序なしリスト（●）、ol（Ordered List）は番号付きリスト。li（List Item）は各リスト項目。Flexboxと組み合わせてナビゲーションメニューによく使います。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'form要素': { title: 'form要素', en: '<form> element', def: 'ユーザー入力を収集するための入れ物要素。action属性でデータの送信先URL、method属性でGET/POSTを指定します。内部にinput・textarea・button要素を配置します。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'input要素': { title: 'input要素', en: '<input> element', def: 'ユーザーが値を入力するフォームコントロール。type属性でtext（文字）、email（メール）、password（パスワード）、checkbox、radio、submitなど様々な入力形式を切り替えられます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'textarea': { title: 'textarea', en: '<textarea> element', def: '複数行テキストを入力できるフォームコントロール。rows/cols属性で初期サイズを指定します。CSSのresizeプロパティで、ユーザーによるサイズ変更を制御できます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'button要素': { title: 'button要素', en: '<button> element', def: 'クリック可能なボタンを作るHTML要素。type="submit" でフォーム送信、type="button" でJavaScriptの動作を実行します。<a>をボタンに見せるより、アクセシビリティが高いです。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },
  'table要素': { title: 'table要素', en: '<table> elements', def: '表を作るHTML要素のグループ。table（表全体）、thead（ヘッダー行グループ）、tbody（本体行グループ）、tr（行）、th（見出しセル）、td（データセル）を組み合わせます。', category: 'HTML基礎', lesson: 'lessons/01-html-basics.html' },

  /* ── タイポグラフィ追加 ── */
  'font-style': { title: 'font-style', en: 'font-style', def: 'フォントのスタイルを指定するプロパティ。normal（通常）、italic（イタリック体）、oblique（斜体）を指定できます。デザイン的な斜体にはitalicを使いますが、強調にはem要素が適切です。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'text-decoration': { title: 'text-decoration', en: 'text-decoration', def: 'テキストの装飾線を指定するプロパティ。underline（下線）、overline（上線）、line-through（取り消し線）、none（なし）を指定できます。リンクの下線を消す text-decoration: none; がよく使われます。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'text-transform': { title: 'text-transform', en: 'text-transform', def: 'テキストの大文字・小文字変換を指定するプロパティ。uppercase（全大文字）、lowercase（全小文字）、capitalize（各語の先頭を大文字）を指定できます。デザイン的なボタンラベルによく使われます。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'word-spacing': { title: 'word-spacing', en: 'word-spacing', def: '単語間のスペースを調整するプロパティ。正の値で間隔を広げ、負の値で詰めます。英語テキストのデザイン調整に使われますが、日本語には効果がほぼありません。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'フォントスタック': { title: 'フォントスタック', en: 'Font Stack', def: 'font-familyで複数のフォントをカンマ区切りで指定したリスト。最初のフォントが利用できない場合に次のフォントを使います。最後には必ずserif・sans-serifなどの汎用フォントファミリーを指定します。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },
  'serif-sansserif': { title: 'serif / sans-serif / monospace', en: 'Generic Font Families', def: 'フォントの汎用ファミリー名。serif（明朝体系・ひげ付き）、sans-serif（ゴシック体系・ひげなし）、monospace（等幅フォント・コード表示向け）。フォントスタックの最後に必ず指定します。', category: 'タイポグラフィ', lesson: 'lessons/05-typography.html' },

  /* ── 色・背景追加 ── */
  'background-image': { title: 'background-image', en: 'background-image', def: '要素の背景に画像やグラデーションを設定するプロパティ。url("画像パス")で画像を、linear-gradient()でグラデーションを指定します。複数の値をカンマ区切りで重ねることもできます。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'background-size': { title: 'background-size', en: 'background-size', def: '背景画像のサイズを指定するプロパティ。cover（要素全体を覆う・トリミングあり）、contain（全体を収める・余白あり）、または px や % で直接サイズを指定できます。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'background-position': { title: 'background-position', en: 'background-position', def: '背景画像の表示位置を指定するプロパティ。center（中央）、top left（左上）など方向キーワード、または 50% 50% のようにパーセントで指定できます。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'background-repeat': { title: 'background-repeat', en: 'background-repeat', def: '背景画像の繰り返し方法を指定するプロパティ。repeat（タイル状に繰り返す・デフォルト）、no-repeat（繰り返さない）、repeat-x / repeat-y（一方向のみ）を指定できます。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'background-attachment': { title: 'background-attachment', en: 'background-attachment', def: '背景画像をスクロールに連動させるかを指定するプロパティ。scroll（ページと一緒にスクロール・デフォルト）、fixed（ビューポートに固定・パララックス効果）、local（要素内スクロールに連動）。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'filter': { title: 'filter', en: 'CSS Filter', def: '要素にグラフィカルな効果をかけるプロパティ。blur()（ぼかし）、brightness()（明るさ）、contrast()（コントラスト）、grayscale()（グレースケール）、drop-shadow()（影）などを組み合わせて使います。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'backdrop-filter': { title: 'backdrop-filter', en: 'backdrop-filter', def: '要素の背景（背後のコンテンツ）にフィルター効果を適用するプロパティ。backdrop-filter: blur(10px) で「すりガラス（グラスモーフィズム）」効果を作れます。', category: '色・背景', lesson: 'lessons/06-colors.html' },
  'oklch': { title: 'oklch()', en: 'oklch() color function', def: '知覚的に均一な色空間で色を指定するCSS関数。oklch(明度 彩度 色相) の3値で指定します。hsl()と比べて、明度を変えても色が歪みにくく、鮮やかな色のグラデーションが作りやすいのが特徴です。', category: '色・背景', lesson: 'lessons/06-colors.html' },

  /* ── レイアウト追加 ── */
  'flex-direction': { title: 'flex-direction', en: 'flex-direction', def: 'Flexboxの主軸方向（アイテムの並び方）を指定するプロパティ。row（横並び・デフォルト）、column（縦並び）、row-reverse（逆順横並び）、column-reverse（逆順縦並び）。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'flex-grow': { title: 'flex-grow', en: 'flex-grow', def: 'フレックスアイテムが余白スペースをどれだけ伸びて埋めるかの比率を指定するプロパティ。flex-grow: 1 なら余白を均等に分け合います。0（デフォルト）は伸びません。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'flex-shrink': { title: 'flex-shrink', en: 'flex-shrink', def: 'フレックスアイテムがスペース不足のときにどれだけ縮むかの比率を指定するプロパティ。デフォルトは1（均等に縮む）。0を指定すると縮まなくなります。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'flex-basis': { title: 'flex-basis', en: 'flex-basis', def: 'フレックスアイテムの基本サイズ（伸縮前のサイズ）を指定するプロパティ。auto（デフォルト）または px/% などで指定します。flex: 1 1 200px のように flex ショートハンドで一括指定するのが一般的です。', category: 'レイアウト', lesson: 'lessons/07-flexbox.html' },
  'grid-column': { title: 'grid-column / grid-row', en: 'grid-column / grid-row', def: 'グリッドアイテムが占める列・行の範囲を指定するプロパティ。grid-column: 1 / 3 で1〜3列目にまたがります。grid-column: span 2 で現在位置から2列分を占有します。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'grid-template-areas': { title: 'grid-template-areas', en: 'grid-template-areas', def: 'グリッドのレイアウトを名前付きエリアで視覚的に定義するプロパティ。文字列でグリッドの形を描き、各アイテムに grid-area: 名前 を指定して配置します。レイアウト構造が一目で分かる強力な機能です。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'auto-fill-fit': { title: 'auto-fill / auto-fit', en: 'auto-fill / auto-fit', def: 'CSS Gridのrepeat()で使う特殊キーワード。auto-fillは空の列も確保し続け、auto-fitは空の列を折りたたみます。minmax()と組み合わせてメディアクエリ不要のレスポンシブグリッドを実現します。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'minmax': { title: 'minmax()', en: 'minmax() function', def: 'CSSグリッドのトラック（列・行）サイズの最小値と最大値を指定するCSS関数。minmax(200px, 1fr) は「最小200px、最大は残りのスペース」を意味します。レスポンシブグリッドに不可欠な関数です。', category: 'レイアウト', lesson: 'lessons/08-grid.html' },
  'inset': { title: 'inset', en: 'inset', def: 'top・right・bottom・left を一括で指定するCSSショートハンドプロパティ。inset: 0 は top: 0; right: 0; bottom: 0; left: 0; と同じ意味です。position: fixed や absolute の要素全体に広げる際によく使います。', category: 'レイアウト', lesson: 'lessons/09-positioning.html' },
  'sticky': { title: 'position: sticky', en: 'sticky positioning', def: '通常の配置で動きつつ、スクロール時に特定の位置で「貼り付く」ポジション値。position: sticky; top: 0; でスクロールするとナビゲーションが画面上部に固定されます。', category: 'レイアウト', lesson: 'lessons/09-positioning.html' },

  /* ── レスポンシブ追加 ── */
  'ブレークポイント': { title: 'ブレークポイント', en: 'Breakpoint', def: 'メディアクエリでレイアウトを切り替える画面幅の境界値。一般的にスマートフォン～480px、タブレット768px、ノートPC 1024px、デスクトップ1280px以上などが使われます。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'prefers-color-scheme': { title: 'prefers-color-scheme', en: 'prefers-color-scheme', def: 'ユーザーのOSのダークモード・ライトモード設定を検出するメディア特性。@media (prefers-color-scheme: dark) の中にダークテーマ用のスタイルを書きます。', category: 'レスポンシブ', lesson: 'lessons/12-css-variables.html' },
  'min-max-func': { title: 'min() / max()', en: 'min() / max() functions', def: '複数の値から最小値・最大値を返すCSS数学関数。width: min(100%, 1200px) は「100%と1200pxのどちらか小さい方」を選ぶため、コンテナの最大幅制限によく使われます。', category: 'レスポンシブ', lesson: 'lessons/10-responsive.html' },
  'コンテナクエリ': { title: 'コンテナクエリ', en: 'Container Query', def: 'ビューポートではなく親要素（コンテナ）のサイズに基づいてスタイルを変える@container構文。コンポーネント単位でレスポンシブ対応できるため、再利用性が高まります。', category: 'レスポンシブ' },

  /* ── アニメーション追加 ── */
  'timing-function': { title: 'timing-function（イージング）', en: 'Timing Function / Easing', def: 'アニメーションや遷移の速度変化のパターンを指定するもの。ease（緩やかに始まり緩やかに終わる）、linear（一定速度）、ease-in（徐々に加速）、ease-out（徐々に減速）などがあります。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'cubic-bezier': { title: 'cubic-bezier()', en: 'cubic-bezier()', def: '4つの数値でアニメーションの速度曲線を完全にカスタムするCSS関数。cubic-bezier(x1, y1, x2, y2) の形式。CSS Easingsなどのツールで視覚的に調整できます。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'will-change': { title: 'will-change', en: 'will-change', def: 'ブラウザに「この要素は近くアニメーションする」と事前通知するプロパティ。will-change: transform で GPU合成が有効になりアニメーションが滑らかになります。ただし使いすぎるとメモリを消費します。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },
  'prefers-reduced-motion': { title: 'prefers-reduced-motion', en: 'prefers-reduced-motion', def: 'ユーザーが「アニメーションを減らす」設定をしているかを検出するメディア特性。@media (prefers-reduced-motion: reduce) の中でアニメーションを無効にし、前庭感覚障害のあるユーザーへの配慮ができます。', category: 'アクセシビリティ', lesson: 'lessons/11-transitions-animations.html' },
  'animation-fill-mode': { title: 'animation-fill-mode', en: 'animation-fill-mode', def: 'アニメーション開始前・終了後の要素のスタイルを制御するプロパティ。both（開始前はfrom、終了後はtoのスタイルを維持）が最もよく使われます。', category: 'アニメーション', lesson: 'lessons/11-transitions-animations.html' },

  /* ── モダンCSS追加 ── */
  'デザイントークン': { title: 'デザイントークン', en: 'Design Token', def: 'デザインシステムで使う色・フォントサイズ・余白などの値を変数として定義したもの。CSS変数（--color-primary など）として実装されます。FigmaとCSSの間でデザイン値を一元管理できます。', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  'ダークモード': { title: 'ダークモード', en: 'Dark Mode', def: '暗い背景に明るいテキストを使ったUIテーマ。@media (prefers-color-scheme: dark) でOS設定に自動追従、または [data-theme="dark"] でJavaScriptから切り替えます。CSS変数と組み合わせると実装が容易です。', category: 'モダンCSS', lesson: 'lessons/12-css-variables.html' },
  ':focus-visible': { title: ':focus-visible', en: ':focus-visible', def: 'キーボード操作時のみフォーカスアウトラインを表示する疑似クラス。:focusだと全てのフォーカスに適用されますが、:focus-visibleはキーボード操作のみに限定します。マウスユーザーには表示されないため視覚的にすっきりします。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  ':not': { title: ':not()', en: ':not() pseudo-class', def: '指定したセレクターに一致しない要素を選択する疑似クラス。:not(.disabled) で .disabled クラスを持たない要素のみに適用できます。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  ':is': { title: ':is() / :where()', en: ':is() / :where() pseudo-class', def: '複数のセレクターをまとめて書ける疑似クラス。:is(h1, h2, h3) { } でh1〜h3全てに同じスタイルを適用できます。:where()は詳細度が0になる点が:is()と異なります。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  ':has': { title: ':has()', en: ':has() relational pseudo-class', def: '特定の子要素を持つ親要素を選択できる疑似クラス。:has(img) でimg要素を含む任意の親にスタイルを適用できます。「親セレクター」とも呼ばれ、2023年から主要ブラウザで対応されました。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  ':nth-child': { title: ':nth-child()', en: ':nth-child() pseudo-class', def: '兄弟要素の中での順番に基づいて要素を選択する疑似クラス。:nth-child(2n)で偶数番目、:nth-child(3n+1)で3n+1番目を選択できます。テーブルの縞模様やギャラリーのレイアウトに便利です。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  '::before-after': { title: '::before / ::after', en: '::before / ::after', def: '要素の直前・直後に仮想的な要素を挿入できる疑似要素。content プロパティが必須（空文字列でも可）。HTMLを変更せずにアイコン・装飾・アンダーラインアニメーションなどを追加できます。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  '::placeholder': { title: '::placeholder', en: '::placeholder pseudo-element', def: 'input や textarea のプレースホルダーテキストをスタイリングできる疑似要素。colorやfont-styleを変えてデザインに合わせたプレースホルダーが作れます。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  '::selection': { title: '::selection', en: '::selection pseudo-element', def: 'ユーザーがマウスでテキストを選択したときのハイライト色を変える疑似要素。background と color のみ指定できます。ブランドカラーで選択ハイライトをカスタマイズできます。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },
  'content-property': { title: 'contentプロパティ', en: 'content property', def: '::before や ::after 疑似要素に挿入する内容を指定するCSSプロパティ。テキスト文字列、空文字列("")、URLなどを指定できます。疑似要素では必須です。', category: 'モダンCSS', lesson: 'lessons/13-pseudo.html' },

  /* ── デザイン原則 ── */
  'CRAPデザイン原則': { title: 'CRAPデザイン原則', en: 'CRAP Design Principles', def: 'Robin Williamが提唱した4つのデザイン原則の頭文字。Contrast（コントラスト）、Repetition（反復）、Alignment（整列）、Proximity（近接）。この4つを意識するだけでデザインの品質が大幅に向上します。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  '視覚的ヒエラルキー': { title: '視覚的ヒエラルキー', en: 'Visual Hierarchy', def: '情報の重要度を視覚的に伝える技術。サイズ・色・コントラスト・余白・位置で要素に優先順位をつけ、ユーザーの視線を自然に重要な情報へ誘導します。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  'ホワイトスペース': { title: 'ホワイトスペース（余白）', en: 'White Space', def: 'デザインの中の「何もない空間」のこと。要素を詰め込みすぎず余白を十分にとることで、コンテンツの可読性・高級感・整理感が向上します。余白はデザインの重要な構成要素です。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  'タイポグラフィスケール': { title: 'タイポグラフィスケール', en: 'Typographic Scale', def: 'フォントサイズを比率（例：1.25倍のMajor Third）で段階的に定義したシステム。数学的な比率に基づくためサイズの組み合わせが自然と調和し、視覚的ヒエラルキーを作りやすくなります。', category: 'タイポグラフィ', lesson: 'lessons/14-design-principles.html' },
  '60-30-10ルール': { title: '60-30-10カラールール', en: '60-30-10 Color Rule', def: 'プロのデザイナーが使う配色の比率ルール。ベースカラー60%（背景・大きなエリア）、サブカラー30%（カード・サイドバー）、アクセントカラー10%（ボタン・強調）の配分で色を使います。', category: '色・背景', lesson: 'lessons/14-design-principles.html' },
  'visually-hidden': { title: 'visually-hidden', en: 'Visually Hidden', def: '視覚的には非表示だがスクリーンリーダーには読み上げられる要素を作るCSSテクニック。display:noneはスクリーンリーダーにも読まれないため、アクセシビリティのためにposition:absoluteなどで画面外に追い出します。', category: 'アクセシビリティ', lesson: 'lessons/14-design-principles.html' },
  'スクリーンリーダー': { title: 'スクリーンリーダー', en: 'Screen Reader', def: '画面を目で見ることができない視覚障害のあるユーザーがWebコンテンツを音声で読み上げるためのソフトウェア。適切なalt属性・セマンティックHTML・aria属性を使うことで、スクリーンリーダーでも使いやすいサイトが作れます。', category: 'アクセシビリティ' },

  /* ── 色彩理論 ── */
  '色相': { title: '色相（Hue）', en: 'Hue', def: '赤・青・緑などの「色み」そのもの。色相環上の角度（0〜360°）で表現されます。HSL色指定では最初の値が色相です。例：hsl(0, 100%, 50%) は赤、hsl(240, 100%, 50%) は青。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '彩度': { title: '彩度（Saturation）', en: 'Saturation', def: '色の鮮やかさ・濃さ。0%がグレー（無彩色）、100%が最も鮮やかな色になります。彩度を下げると落ち着いた・上品な印象になります。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '明度': { title: '明度（Lightness）', en: 'Lightness', def: '色の明るさ。HSLでは0%が黒、100%が白、50%が純色になります。デザインツール（Figma）のHSBとは異なるため注意が必要です。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '色相環': { title: '色相環', en: 'Color Wheel', def: '色を円形に配置した図。色相環上の位置関係から補色・類似色・三角配色などの調和のとれた配色ルールを導き出せます。Webデザインの配色選びに欠かせない概念です。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '補色': { title: '補色（Complementary Colors）', en: 'Complementary Colors', def: '色相環で真向かい（180°）の2色の関係。例：赤と緑、青とオレンジ。補色の組み合わせはインパクトが強く、ユーザーの視線を引きつけますが、大面積での使用は目が疲れやすいです。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '類似色': { title: '類似色（Analogous Colors）', en: 'Analogous Colors', def: '色相環で隣り合う（30〜60°）3〜4色の関係。自然でまとまりのある落ち着いた印象を作れます。ナチュラルなサイトや柔らかいデザインに向きます。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  '単色配色': { title: '単色配色（Monochromatic）', en: 'Monochromatic', def: '同じ色相で明度・彩度だけを変えた配色。洗練されたシンプルな印象になります。ブランドカラーの明暗バリエーション（100〜900のスケール）がこれに相当します。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
  'HSB': { title: 'HSB / HSV', en: 'HSB / HSV Color Model', def: 'Hue（色相）・Saturation（彩度）・Brightness（明度）で色を表現するモデル。FigmaなどデザインツールではHSBが主流です。CSSのHSLとは明度の定義が異なるため注意が必要です。', category: '色・背景', lesson: 'lessons/15-color-theory.html' },
};

// ===================================
// 用語ツールチップシステム
// ===================================
let activePopup = null;

function getBasePath() {
  return window.location.pathname.includes('/lessons/') ? '../' : '';
}

function createTermPopup(key, data, x, y) {
  if (activePopup) activePopup.remove();

  const basePath = getBasePath();
  const popup = document.createElement('div');
  popup.className = 'term-popup';
  popup.id = 'term-popup';
  popup.innerHTML = `
    <div class="term-popup-header">
      <span class="term-popup-title">${data.title}</span>
      <button class="term-popup-close" onclick="closeTermPopup()">✕</button>
    </div>
    <div class="term-popup-body">${data.def}</div>
    <div class="term-popup-footer">
      ${data.lesson ? `<a class="term-popup-lesson" href="${basePath}${data.lesson}">📖 レッスンで学ぶ</a>` : ''}
      <a class="term-popup-glossary" href="${basePath}glossary.html#${key}">辞典で見る →</a>
    </div>
  `;
  document.body.appendChild(popup);
  activePopup = popup;

  // ポジション調整
  const pw = popup.offsetWidth || 320;
  const ph = popup.offsetHeight || 180;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let left = x + 12;
  let top = y + 12;
  if (left + pw > vw - 16) left = x - pw - 12;
  if (top + ph > vh - 16) top = y - ph - 8;
  if (left < 8) left = 8;
  if (top < 8) top = 8;
  popup.style.left = left + 'px';
  popup.style.top = top + 'px';
}

window.closeTermPopup = function () {
  if (activePopup) {
    activePopup.remove();
    activePopup = null;
  }
};

function initTermTooltips() {
  const root = document.querySelector('.main-content') || document.querySelector('.hero-content') || document.body;
  const skipTags = new Set(['SCRIPT', 'STYLE', 'PRE', 'CODE', 'H1', 'H2', 'H3', 'H4', 'INPUT', 'TEXTAREA', 'A']);

  // 長い順に並べて、長い用語を優先してマッチ
  const termKeys = Object.keys(GLOSSARY_DATA).sort((a, b) =>
    GLOSSARY_DATA[b].title.length - GLOSSARY_DATA[a].title.length
  );

  const used = new Set();

  // テキストノードを処理: 元テキストのまま検索して干渉を防ぐ
  function processTextNode(node) {
    const parent = node.parentElement;
    if (!parent || skipTags.has(parent.tagName)) return;
    if (parent.closest('pre, code, .code-block, .sidebar, .nav, .term-link')) return;

    const text = node.textContent;
    if (!text.trim()) return;

    // 元テキストから全マッチを収集（修正済み文字列を検索しない＝干渉ゼロ）
    const matches = [];
    for (const key of termKeys) {
      if (used.has(key)) continue;
      const title = GLOSSARY_DATA[key].title;
      let from = 0;
      while (from < text.length) {
        const idx = text.indexOf(title, from);
        if (idx === -1) break;
        // 既存マッチと重複しないか確認
        const overlaps = matches.some(m => idx < m.end && idx + title.length > m.start);
        if (!overlaps) {
          matches.push({ start: idx, end: idx + title.length, key, title });
          used.add(key);
          break; // 1用語は1ページ1回のみリンク
        }
        from = idx + 1;
      }
    }

    if (matches.length === 0) return;

    // マッチ位置順にソートしてDOMフラグメントを構築
    matches.sort((a, b) => a.start - b.start);
    const frag = document.createDocumentFragment();
    let last = 0;
    for (const m of matches) {
      if (m.start > last) frag.appendChild(document.createTextNode(text.slice(last, m.start)));
      const span = document.createElement('span');
      span.className = 'term-link';
      span.dataset.term = m.key;
      span.textContent = m.title;
      frag.appendChild(span);
      last = m.end;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    parent.replaceChild(frag, node);
  }

  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (skipTags.has(node.tagName)) return;
      if (node.classList && (node.classList.contains('term-link') || node.classList.contains('code-block') || node.classList.contains('sidebar') || node.classList.contains('nav'))) return;
      // childNodesをスナップショット（DOM操作で変わるため）
      Array.from(node.childNodes).forEach(processNode);
    } else if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node);
    }
  }

  processNode(root);

  // クリックイベント委任
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.term-link');
    if (link) {
      e.stopPropagation();
      const key = link.dataset.term;
      const data = GLOSSARY_DATA[key];
      if (data) createTermPopup(key, data, e.clientX, e.clientY);
      return;
    }
    if (activePopup && !activePopup.contains(e.target)) {
      closeTermPopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTermPopup();
  });
}

// ===================================
// 共有システム
// ===================================
const SHARE_STORAGE_KEY = 'css-learning-shares';
const USER_NAME_KEY = 'css-learning-username';

function getUserName() {
  return localStorage.getItem(USER_NAME_KEY) || '';
}

function generateShareData(recipientName) {
  const progress = getProgress();
  const sharer = getUserName() || '匿名ユーザー';
  const shareData = {
    sharer,
    recipient: recipientName,
    progress,
    completedCount: Object.keys(progress).filter(k => progress[k]).length,
    timestamp: Date.now()
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
}

function generateShareURL(recipientName) {
  const encoded = generateShareData(recipientName);
  const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  return `${base}index.html#share=${encodeURIComponent(recipientName)}&data=${encoded}`;
}

function saveShare(recipientName, url) {
  const shares = getShares();
  shares.unshift({ name: recipientName, url, date: Date.now() });
  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(shares.slice(0, 20)));
}

function getShares() {
  try { return JSON.parse(localStorage.getItem(SHARE_STORAGE_KEY)) || []; } catch { return []; }
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ コピー済み';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }
}

function renderShareModal() {
  const shares = getShares();
  const existing = document.getElementById('share-modal-overlay');
  if (existing) existing.remove();

  const sharesHTML = shares.length > 0 ? `
    <div class="share-list">
      <div class="share-list-title">📋 共有済みリスト</div>
      ${shares.map(s => `
        <div class="share-list-item">
          <div>
            <div class="share-list-name">👤 ${s.name}</div>
            <div class="share-list-date">${new Date(s.date).toLocaleDateString('ja-JP')}</div>
          </div>
          <div class="share-list-actions">
            <button class="share-list-copy-btn" data-url="${encodeURIComponent(s.url)}">URLコピー</button>
          </div>
        </div>`).join('')}
    </div>` : '';

  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.id = 'share-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal" id="share-modal">
      <div class="share-modal-head">
        <h3>🔗 学習進捗を共有</h3>
        <button class="share-modal-close" id="share-modal-close">✕</button>
      </div>
      <div class="share-modal-body">
        <div class="share-form-group">
          <label>あなたの名前（共有先に表示されます）</label>
          <input class="share-input" id="share-username" type="text"
            placeholder="例: 山田 太郎"
            value="${getUserName()}">
        </div>
        <div class="share-form-group">
          <label>共有する相手の名前</label>
          <input class="share-input" id="share-recipient" type="text"
            placeholder="例: 鈴木 先生">
        </div>
        <button class="btn btn-primary" id="share-generate-btn" style="width:100%">
          🔗 共有リンクを生成
        </button>
        <div id="share-url-result" style="display:none; margin-top:1rem;">
          <label style="font-size:0.8rem; color:var(--text-muted);">共有URL（コピーして送信してください）</label>
          <div class="share-url-box">
            <div class="share-url-field" id="share-url-display"></div>
            <button class="btn btn-sm btn-primary" id="share-url-copy-btn">コピー</button>
          </div>
        </div>
        ${sharesHTML}
      </div>
    </div>`;
  document.body.appendChild(modal);

  setTimeout(() => modal.classList.add('open'), 10);

  document.getElementById('share-modal-close').onclick = closeShareModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeShareModal(); });

  document.getElementById('share-generate-btn').onclick = () => {
    const uname = document.getElementById('share-username').value.trim();
    const rname = document.getElementById('share-recipient').value.trim();
    if (!rname) { alert('共有する相手の名前を入力してください。'); return; }
    if (uname) localStorage.setItem(USER_NAME_KEY, uname);
    const url = generateShareURL(rname);
    saveShare(rname, url);
    document.getElementById('share-url-display').textContent = url;
    document.getElementById('share-url-result').style.display = 'block';
  };

  document.getElementById('share-url-copy-btn')?.addEventListener('click', function () {
    const url = document.getElementById('share-url-display').textContent;
    copyToClipboard(url, this);
  });

  document.querySelectorAll('.share-list-copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      copyToClipboard(decodeURIComponent(this.dataset.url), this);
    });
  });
}

function closeShareModal() {
  const overlay = document.getElementById('share-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 250);
  }
}

window.openShareModal = function () { renderShareModal(); };

// 共有ビューの検出と表示
function checkSharedView() {
  const hash = window.location.hash;
  if (!hash.startsWith('#share=')) return;
  try {
    const params = new URLSearchParams(hash.slice(1));
    const dataStr = params.get('data');
    if (!dataStr) return;
    const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
    showSharedViewBanner(data);
  } catch (e) {
    console.warn('共有データの解析に失敗:', e);
  }
}

function showSharedViewBanner(data) {
  const completed = Object.keys(data.progress || {}).filter(k => data.progress[k]).length;
  const pct = Math.round((completed / 14) * 100);

  const banner = document.createElement('div');
  banner.className = 'shared-view-banner';
  banner.innerHTML = `
    <div>
      📤 <strong>${data.sharer || '匿名ユーザー'}</strong> さんの学習進捗を共有ビューで表示中
      &nbsp;|&nbsp; 完了レッスン: <strong style="color:var(--accent)">${completed} / 14</strong>（${pct}%）
      ${data.recipient ? `&nbsp;|&nbsp; 共有先: ${data.recipient}` : ''}
    </div>
    <button class="shared-view-close" onclick="this.closest('.shared-view-banner').remove(); document.body.classList.remove('shared-view-active');">✕ 閉じる</button>
  `;
  document.body.insertAdjacentElement('afterbegin', banner);
  document.body.classList.add('shared-view-active');

  // 共有された進捗をUIに反映（読み取り専用）
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-lesson-id]');
  sidebarLinks.forEach(link => {
    if (data.progress[link.dataset.lessonId]) link.classList.add('completed');
  });
  const lessonItems = document.querySelectorAll('.lesson-item[data-lesson-id]');
  lessonItems.forEach(item => {
    if (data.progress[item.dataset.lessonId]) item.classList.add('completed');
  });
  const fill = document.querySelector('.overall-progress-fill');
  const pctEl = document.querySelector('#progressPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct;
  const indexFill = document.getElementById('index-progress-fill');
  const indexPct = document.getElementById('index-progress-pct');
  if (indexFill) indexFill.style.width = pct + '%';
  if (indexPct) indexPct.textContent = pct;
}

// ===================================
// 初期化に追加
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initTermTooltips();
  checkSharedView();
});


// ===================================
// 管理者ログインシステム
// ===================================
const ADMIN_HASH = 'e596c4d48b839277dbcfc4f5147c20d63069c7fdf289178ee78321c590ca9aa1'; // sha256('onoono28')
const ADMIN_SESSION_KEY = 'css-admin-session';

async function _hashPassword(password) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(password));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

async function adminLogin(password) {
  const hash = await _hashPassword(password);
  if (hash === ADMIN_HASH) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  updateAdminUI();
}
window.adminLogout = adminLogout;

function updateAdminUI() {
  const isAdmin = isAdminLoggedIn();
  // 共有ボタン: 常時表示（クリック時に管理者チェック）
  document.querySelectorAll('.share-nav-btn').forEach(btn => {
    btn.style.display = '';
  });
  // 管理者ボタンの表示切替
  document.querySelectorAll('.admin-login-btn').forEach(btn => {
    btn.textContent = isAdmin ? '🔐 管理者' : '🔒 管理者';
    if (isAdmin) btn.classList.add('admin-active');
    else btn.classList.remove('admin-active');
  });
}

function showAdminToast(msg) {
  const existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'admin-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3000);
}

function openAdminModal() {
  if (isAdminLoggedIn()) { openAdminPanel(); return; }
  const existing = document.getElementById('admin-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.id = 'admin-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal" id="admin-modal">
      <div class="share-modal-head">
        <h3>🔐 管理者ログイン</h3>
        <button class="share-modal-close" onclick="closeAdminModal()">✕</button>
      </div>
      <div class="share-modal-body">
        <div style="text-align:center;font-size:3rem;margin:0.5rem 0 1rem;">🔐</div>
        <p style="text-align:center;color:var(--text-muted);margin-bottom:1.5rem;font-size:0.875rem;">
          管理者としてログインすると<br>学習進捗の共有機能が使用できます。
        </p>
        <div class="share-form-group">
          <label>パスワード</label>
          <input class="share-input" id="admin-password" type="password"
            placeholder="管理者パスワードを入力" autocomplete="current-password">
        </div>
        <div id="admin-login-error"
          style="color:#ef4444;font-size:0.82rem;display:none;margin-bottom:0.75rem;text-align:center;padding:0.5rem;background:rgba(239,68,68,0.1);border-radius:6px;">
          ❌ パスワードが正しくありません
        </div>
        <button class="btn btn-primary" id="admin-login-submit" style="width:100%">ログイン →</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAdminModal(); });

  const pwInput = document.getElementById('admin-password');
  const submitBtn = document.getElementById('admin-login-submit');
  pwInput.focus();
  pwInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitBtn.click(); });

  submitBtn.onclick = async () => {
    const pw = pwInput.value;
    if (!pw) return;
    submitBtn.textContent = '確認中...';
    submitBtn.disabled = true;
    const ok = await adminLogin(pw);
    if (ok) {
      closeAdminModal();
      updateAdminUI();
      showAdminToast('✅ 管理者としてログインしました');
    } else {
      document.getElementById('admin-login-error').style.display = 'block';
      submitBtn.textContent = 'ログイン →';
      submitBtn.disabled = false;
      pwInput.value = '';
      pwInput.focus();
    }
  };
}

function openAdminPanel() {
  const existing = document.getElementById('admin-modal-overlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.id = 'admin-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal" id="admin-modal">
      <div class="share-modal-head">
        <h3>🔐 管理者パネル</h3>
        <button class="share-modal-close" onclick="closeAdminModal()">✕</button>
      </div>
      <div class="share-modal-body">
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:1.25rem;text-align:center;margin-bottom:1.25rem;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">✅</div>
          <div style="font-weight:700;color:var(--primary);margin-bottom:0.25rem;">管理者ログイン中</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">ブラウザを閉じると自動的にログアウトされます</div>
        </div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:1rem;line-height:1.6;">
          共有機能を使うには、ナビバーの <strong style="color:var(--text-primary)">🔗 共有</strong> ボタンをクリックしてください。
        </div>
        <button class="btn btn-ghost" onclick="adminLogout(); closeAdminModal();"
          style="width:100%;border-color:#ef4444;color:#ef4444;">🚪 ログアウト</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAdminModal(); });
}

function closeAdminModal() {
  const overlay = document.getElementById('admin-modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 250);
  }
}
window.openAdminModal = openAdminModal;
window.closeAdminModal = closeAdminModal;

// ===================================
// 共有URL改修: クエリパラメーター版
// ===================================

// generateShareURL を上書き（?share=&data= 形式）
function generateShareURL(recipientName) {
  const encoded = generateShareData(recipientName);
  // ルートパスを解決（lessons/ 配下でも正しく動く）
  const pathname = window.location.pathname;
  const rootPath = pathname.includes('/lessons/')
    ? pathname.split('/lessons/')[0] + '/'
    : pathname.replace(/[^/]+$/, '');
  const rootURL = window.location.origin + rootPath + 'index.html';
  return `${rootURL}?share=${encodeURIComponent(recipientName)}&data=${encoded}`;
}

// checkSharedView を上書き（URLSearchParams 版）
function checkSharedView() {
  const params = new URLSearchParams(window.location.search);
  const dataStr = params.get('data');
  if (!dataStr) return;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
    showSharedViewBanner(data);
  } catch (e) {
    console.warn('共有データの解析に失敗:', e);
  }
}

// 共有モーダルを管理者チェック付きに上書き
window.openShareModal = function () {
  if (!isAdminLoggedIn()) {
    showAdminToast('⚠️ 共有機能は管理者のみ使用できます');
    setTimeout(openAdminModal, 600);
    return;
  }
  renderShareModal();
};

// ===================================
// 管理者UI初期化
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  updateAdminUI();
  // クエリパラメーターの共有チェック
  checkSharedView();
});


// ===================================
// 常時共有システム（永続化・リアルタイム同期）
// ===================================
const PERSISTENT_SHARE_KEY = 'css-persistent-share';   // 受信者側ブラウザに保存
const LIVE_BROADCAST_KEY   = 'css-live-progress';      // 送信者側が更新をブロードキャスト

// ---- ストレージ操作 ----
function savePersistentShare(data) {
  const record = Object.assign({}, data, { active: true, savedAt: Date.now() });
  localStorage.setItem(PERSISTENT_SHARE_KEY, JSON.stringify(record));
}

function getPersistentShare() {
  try { return JSON.parse(localStorage.getItem(PERSISTENT_SHARE_KEY)); }
  catch { return null; }
}

function clearPersistentShare() {
  localStorage.removeItem(PERSISTENT_SHARE_KEY);
}

// 送信者が進捗をブロードキャスト（同一ブラウザの別タブへ）
function broadcastProgress() {
  const progress = getProgress();
  const sharer   = getUserName() || '管理者';
  localStorage.setItem(LIVE_BROADCAST_KEY, JSON.stringify({ progress, sharer, ts: Date.now() }));
}

// ---- バナー描画（完全書き換え版） ----
function showSharedViewBanner(data) {
  // 既存バナーを除去
  const existing = document.querySelector('.shared-view-banner');
  if (existing) existing.remove();

  const progress  = data.progress || {};
  const completed = Object.keys(progress).filter(k => progress[k]).length;
  const pct       = Math.round((completed / 14) * 100);

  const banner = document.createElement('div');
  banner.className = 'shared-view-banner';
  banner.id = 'shared-view-banner';
  banner.innerHTML = `
    <div class="svb-info">
      <span class="svb-dot"></span>
      <strong>${data.sharer || '匿名ユーザー'}</strong> の学習進捗を常時表示中
      &nbsp;|&nbsp;
      完了: <strong style="color:var(--accent)">${completed}/14</strong>（<span id="svb-pct">${pct}</span>%）
      ${data.recipient ? `&nbsp;|&nbsp; 共有先: ${data.recipient}` : ''}
      <span class="svb-live-badge" id="svb-live-badge" style="display:none">🔴 LIVE</span>
    </div>
    <div style="display:flex;gap:0.5rem;align-items:center;flex-shrink:0;">
      <button class="shared-view-close svb-hide-btn"
        onclick="hidePersistentBanner()" title="バナーを非表示（共有状態は維持）">
        👁 非表示
      </button>
      <button class="shared-view-close"
        onclick="endPersistentShare()" title="共有を完全に終了">
        ✕ 共有終了
      </button>
    </div>`;
  document.body.insertAdjacentElement('afterbegin', banner);
  document.body.classList.add('shared-view-active');

  _applySharedProgress(progress);
}

function _applySharedProgress(progress) {
  const pct = Math.round((Object.keys(progress).filter(k => progress[k]).length / 14) * 100);

  document.querySelectorAll('.sidebar-link[data-lesson-id]').forEach(link => {
    if (progress[link.dataset.lessonId]) link.classList.add('completed');
    else link.classList.remove('completed');
  });
  document.querySelectorAll('.lesson-item[data-lesson-id]').forEach(item => {
    if (progress[item.dataset.lessonId]) item.classList.add('completed');
    else item.classList.remove('completed');
  });
  const fill = document.querySelector('.overall-progress-fill');
  const pctEl = document.querySelector('#progressPct');
  if (fill) fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct;
  const indexFill = document.getElementById('index-progress-fill');
  const indexPct  = document.getElementById('index-progress-pct');
  if (indexFill) indexFill.style.width = pct + '%';
  if (indexPct)  indexPct.textContent = pct;

  const pctSpan = document.getElementById('svb-pct');
  if (pctSpan) pctSpan.textContent = pct;
}

// バナー非表示（共有は維持: sessionStorage でこのセッション中は再表示しない）
window.hidePersistentBanner = function () {
  const banner = document.getElementById('shared-view-banner');
  if (banner) { banner.remove(); document.body.classList.remove('shared-view-active'); }
  sessionStorage.setItem('svb-hidden', '1');
};

// 共有完全終了
window.endPersistentShare = function () {
  clearPersistentShare();
  sessionStorage.removeItem('svb-hidden');
  const banner = document.getElementById('shared-view-banner');
  if (banner) { banner.remove(); document.body.classList.remove('shared-view-active'); }
  showAdminToast('✅ 常時共有を終了しました');
};

// ---- checkSharedView 完全書き換え ----
function checkSharedView() {
  const params  = new URLSearchParams(window.location.search);
  const dataStr = params.get('data');

  if (dataStr) {
    // URL経由で新規共有データを受信 → localStorageに保存してURLをクリーン化
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
      savePersistentShare(data);
      // URLパラメーターを除去（リロードなし）
      const cleanURL = window.location.pathname + window.location.hash;
      history.replaceState(null, '', cleanURL);
      if (!sessionStorage.getItem('svb-hidden')) {
        showSharedViewBanner(data);
      }
    } catch (e) {
      console.warn('共有データの解析に失敗:', e);
    }
    return;
  }

  // localStorageに永続共有データがあれば復元
  const saved = getPersistentShare();
  if (saved && saved.active && !sessionStorage.getItem('svb-hidden')) {
    showSharedViewBanner(saved);
  }
}

// ---- リアルタイム同期（同一ブラウザの別タブ）----
window.addEventListener('storage', (e) => {
  if (e.key === LIVE_BROADCAST_KEY && e.newValue) {
    const saved = getPersistentShare();
    if (!saved || !saved.active) return;
    try {
      const broadcast = JSON.parse(e.newValue);
      // 保存されている共有データの進捗を最新に上書き
      saved.progress = broadcast.progress;
      saved.savedAt = Date.now();
      savePersistentShare(saved);
      // バナーが表示中なら即時反映
      const banner = document.getElementById('shared-view-banner');
      if (banner) {
        _applySharedProgress(broadcast.progress);
        const badge = document.getElementById('svb-live-badge');
        if (badge) {
          badge.style.display = 'inline-block';
          clearTimeout(badge._timer);
          badge._timer = setTimeout(() => { badge.style.display = 'none'; }, 3000);
        }
      }
    } catch { /* ignore */ }
  }
  // 管理者側の進捗変化もブロードキャスト対象
  if (e.key === STORAGE_KEY && isAdminLoggedIn()) {
    broadcastProgress();
  }
});

// 管理者がレッスンを完了したときも自動ブロードキャスト
const _origMarkComplete = markLessonComplete;
markLessonComplete = function(lessonId) {
  _origMarkComplete(lessonId);
  if (isAdminLoggedIn()) broadcastProgress();
};

// ---- 共有モーダル（管理者用） 完全書き換え ----
function renderShareModal() {
  const shares = getShares();
  const existing = document.getElementById('share-modal-overlay');
  if (existing) existing.remove();

  // 常時共有中の受信者を特定
  const activePersistent = getPersistentShare();

  const sharesHTML = shares.length > 0 ? `
    <div class="share-list">
      <div class="share-list-title">📋 共有済みリスト</div>
      ${shares.map(s => `
        <div class="share-list-item">
          <div>
            <div class="share-list-name">👤 ${s.name}</div>
            <div class="share-list-date">${new Date(s.date).toLocaleDateString('ja-JP')}</div>
          </div>
          <div class="share-list-actions">
            <button class="share-list-copy-btn" data-url="${encodeURIComponent(s.url)}">URLコピー</button>
          </div>
        </div>`).join('')}
    </div>` : '';

  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.id = 'share-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal" id="share-modal">
      <div class="share-modal-head">
        <h3>🔗 学習進捗を共有</h3>
        <button class="share-modal-close" id="share-modal-close">✕</button>
      </div>
      <div class="share-modal-body">

        <!-- 常時共有ステータス -->
        <div class="persistent-share-status" id="persistent-share-status">
          <div class="pss-header">
            <span class="pss-dot ${activePersistent ? 'active' : ''}"></span>
            <strong>常時共有</strong>
            <span class="pss-label">${activePersistent ? '● アクティブ' : '○ 未設定'}</span>
          </div>
          ${activePersistent ? `
          <div class="pss-recipient">
            共有先: <strong>${activePersistent.recipient || '不明'}</strong>
            &nbsp;|&nbsp; 保存日時: ${new Date(activePersistent.savedAt || activePersistent.timestamp).toLocaleString('ja-JP')}
          </div>
          <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
            <button class="btn btn-sm btn-primary" id="pss-update-btn" style="flex:1">🔄 進捗を更新して再共有</button>
            <button class="btn btn-sm btn-ghost" id="pss-revoke-btn" style="border-color:#ef4444;color:#ef4444">✕ 解除</button>
          </div>` : '<div style="font-size:0.8rem;color:var(--text-dim);margin-top:0.5rem;">共有URLを生成して相手が開くと自動的に常時共有が有効になります。</div>'}
        </div>

        <!-- 新規共有フォーム -->
        <div class="share-form-group">
          <label>あなたの名前（共有先に表示されます）</label>
          <input class="share-input" id="share-username" type="text"
            placeholder="例: 山田 太郎" value="${getUserName()}">
        </div>
        <div class="share-form-group">
          <label>共有する相手の名前</label>
          <input class="share-input" id="share-recipient" type="text"
            placeholder="例: 鈴木 先生" value="${activePersistent ? activePersistent.recipient || '' : ''}">
        </div>
        <button class="btn btn-primary" id="share-generate-btn" style="width:100%">
          🔗 常時共有リンクを生成
        </button>
        <div id="share-url-result" style="display:none;margin-top:1rem;">
          <label style="font-size:0.8rem;color:var(--text-muted);">共有URL（相手に送信してください）</label>
          <div class="share-url-box">
            <div class="share-url-field" id="share-url-display"></div>
            <button class="btn btn-sm btn-primary" id="share-url-copy-btn">コピー</button>
          </div>
          <p style="font-size:0.75rem;color:var(--text-dim);margin-top:0.5rem;line-height:1.6;">
            💡 このURLを相手が開くと、以降は自動的に常時共有が維持されます。<br>
            進捗が変わったら「進捗を更新して再共有」から新しいURLを送ってください。
          </p>
        </div>
        ${sharesHTML}
      </div>
    </div>`;
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('open'), 10);

  document.getElementById('share-modal-close').onclick = closeShareModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeShareModal(); });

  document.getElementById('share-generate-btn').onclick = () => {
    const uname = document.getElementById('share-username').value.trim();
    const rname = document.getElementById('share-recipient').value.trim();
    if (!rname) { showAdminToast('⚠️ 共有する相手の名前を入力してください'); return; }
    if (uname) localStorage.setItem(USER_NAME_KEY, uname);
    const url = generateShareURL(rname);
    saveShare(rname, url);
    document.getElementById('share-url-display').textContent = url;
    document.getElementById('share-url-result').style.display = 'block';
    broadcastProgress();
  };

  document.getElementById('share-url-copy-btn')?.addEventListener('click', function () {
    copyToClipboard(document.getElementById('share-url-display').textContent, this);
  });

  document.querySelectorAll('.share-list-copy-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      copyToClipboard(decodeURIComponent(this.dataset.url), this);
    });
  });

  // 常時共有: 更新ボタン
  document.getElementById('pss-update-btn')?.addEventListener('click', () => {
    const saved = getPersistentShare();
    if (!saved) return;
    const url = generateShareURL(saved.recipient);
    saveShare(saved.recipient, url);
    document.getElementById('share-url-display').textContent = url;
    document.getElementById('share-url-result').style.display = 'block';
    broadcastProgress();
    showAdminToast('✅ 進捗を更新しました。新URLを相手に送ってください。');
  });

  // 常時共有: 解除ボタン
  document.getElementById('pss-revoke-btn')?.addEventListener('click', () => {
    clearPersistentShare();
    closeShareModal();
    showAdminToast('🗑 常時共有を解除しました');
  });
}

// ---- 管理者パネルを常時共有情報付きに更新 ----
function openAdminPanel() {
  const existing = document.getElementById('admin-modal-overlay');
  if (existing) existing.remove();

  const ps = getPersistentShare();
  const psHtml = ps ? `
    <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25);border-radius:10px;padding:0.9rem 1rem;margin-bottom:1rem;font-size:0.82rem;">
      <div style="font-weight:700;color:#22c55e;margin-bottom:0.3rem;">📡 常時共有アクティブ</div>
      <div style="color:var(--text-muted);">共有先: <strong style="color:var(--text-primary)">${ps.recipient || '不明'}</strong></div>
    </div>` : '';

  const modal = document.createElement('div');
  modal.className = 'share-modal-overlay';
  modal.id = 'admin-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal" id="admin-modal">
      <div class="share-modal-head">
        <h3>🔐 管理者パネル</h3>
        <button class="share-modal-close" onclick="closeAdminModal()">✕</button>
      </div>
      <div class="share-modal-body">
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.3);border-radius:12px;padding:1.25rem;text-align:center;margin-bottom:1rem;">
          <div style="font-size:2rem;margin-bottom:0.5rem;">✅</div>
          <div style="font-weight:700;color:var(--primary);margin-bottom:0.25rem;">管理者ログイン中</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">ブラウザを閉じると自動的にログアウトされます</div>
        </div>
        ${psHtml}
        <button class="btn btn-primary" onclick="closeAdminModal(); window.openShareModal();"
          style="width:100%;margin-bottom:0.6rem;">🔗 共有管理を開く</button>
        <button class="btn btn-ghost" onclick="adminLogout(); closeAdminModal();"
          style="width:100%;border-color:#ef4444;color:#ef4444;">🚪 ログアウト</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeAdminModal(); });
}

// ---- CSS追加（svb-dot, pss-*）----
(function injectPersistentShareCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .svb-info { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; }
    .svb-dot {
      width:8px; height:8px; border-radius:50%; background:#22c55e; flex-shrink:0;
      box-shadow:0 0 6px #22c55e; animation:svb-pulse 2s ease infinite;
    }
    @keyframes svb-pulse {
      0%,100%{ opacity:1; } 50%{ opacity:0.4; }
    }
    .svb-live-badge {
      font-size:0.72rem; font-weight:700; color:#ef4444;
      animation:svb-pulse 1s ease infinite;
    }
    .svb-hide-btn { background:rgba(255,255,255,0.06) !important; }
    .persistent-share-status {
      background:var(--surface-2,#1a1a28);
      border:1px solid rgba(99,102,241,0.25);
      border-radius:12px; padding:1rem; margin-bottom:1.25rem;
    }
    .pss-header { display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem; }
    .pss-dot {
      width:9px; height:9px; border-radius:50%; background:#64748b; flex-shrink:0;
    }
    .pss-dot.active {
      background:#22c55e; box-shadow:0 0 6px #22c55e; animation:svb-pulse 2s ease infinite;
    }
    .pss-label { font-size:0.78rem; color:var(--text-muted); }
    .pss-recipient { font-size:0.8rem; color:var(--text-dim); }
  `;
  document.head.appendChild(style);
})();

// ---- DOMContentLoaded 再バインド ----
document.addEventListener('DOMContentLoaded', () => {
  checkSharedView();
});


// ===================================
// file:// プロトコル対応パッチ
// ===================================

// generateShareURL を完全書き換え（file:// でも動作）
function generateShareURL(recipientName) {
  const encoded = generateShareData(recipientName);
  // file:// の場合 origin が "null" になるため href ベースで解決
  const href = window.location.href.replace(/[?#].*$/, '');
  const rootURL = href.includes('/lessons/')
    ? href.split('/lessons/')[0] + '/index.html'
    : href.replace(/[^/]+$/, '') + 'index.html';
  return `${rootURL}?share=${encodeURIComponent(recipientName)}&data=${encoded}`;
}

// checkSharedView を完全書き換え（file:// でも URLSearchParams は動作する）
function checkSharedView() {
  const params  = new URLSearchParams(window.location.search);
  const dataStr = params.get('data');

  if (dataStr) {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
      savePersistentShare(data);
      // URLをクリーンにする（file:// では replaceState が動作しない場合があるが無害）
      try {
        history.replaceState(null, '', window.location.pathname + window.location.hash);
      } catch (e) { /* file:// では無視 */ }
      if (!sessionStorage.getItem('svb-hidden')) {
        showSharedViewBanner(data);
      }
    } catch (e) {
      console.warn('共有データの解析に失敗:', e);
    }
    return;
  }

  const saved = getPersistentShare();
  if (saved && saved.active && !sessionStorage.getItem('svb-hidden')) {
    showSharedViewBanner(saved);
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  checkSharedView();
});


// ===================================
// 共有状態サーバー非依存パッチ
// ===================================

// ファイルベースURLを記憶（file://で開いたとき）
(function() {
  if (window.location.protocol === 'file:') {
    const fileBase = window.location.href.replace(/[?#].*$/, '').replace(/[^/\\]+$/, '');
    localStorage.setItem('css-file-base', fileBase);
  }
})();

// 共有URLを生成（localhost / file:// 両方のURLを返す）
function generateShareURLs(recipientName) {
  const encoded = generateShareData(recipientName);
  const param = `?share=${encodeURIComponent(recipientName)}&data=${encoded}`;

  const urls = {};

  // 現在のプロトコルに基づくURL
  const curHref = window.location.href.replace(/[?#].*$/, '');
  const curRoot = curHref.includes('/lessons/')
    ? curHref.split('/lessons/')[0] + '/index.html'
    : curHref.replace(/[^/]+$/, '') + 'index.html';
  urls.current = curRoot + param;

  // file:// ベースURL（記憶されていれば）
  const fileBase = localStorage.getItem('css-file-base');
  if (fileBase && window.location.protocol !== 'file:') {
    urls.file = fileBase + 'index.html' + param;
  }

  return urls;
}

// generateShareURL を上書き（後方互換）
function generateShareURL(recipientName) {
  return generateShareURLs(recipientName).current;
}

// 共有コード（URLなし・プロトコル非依存の base64 文字列）
function generateShareCode(recipientName) {
  return generateShareData(recipientName);
}

// 共有コードからデータ展開
function decodeShareCode(code) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  } catch (e) {
    return null;
  }
}

// 共有モーダルを上書き（コード表示を追加）
const _origOpenShareModal = window.openShareModal;
window.openShareModal = function() {
  renderShareModalV2();
};

function renderShareModalV2() {
  const existing = document.getElementById('share-modal-overlay');
  if (existing) existing.remove();

  const shares = getShares();
  const sharesHTML = shares.length ? `
    <div class="share-history">
      <div class="share-history-title">共有履歴</div>
      ${shares.slice(0, 5).map(s => `
        <div class="share-history-item">
          <span>${s.name}</span>
          <button class="btn btn-xs btn-secondary share-list-copy-btn" data-url="${encodeURIComponent(s.url)}">URLコピー</button>
        </div>`).join('')}
    </div>` : '';

  const modal = document.createElement('div');
  modal.id = 'share-modal-overlay';
  modal.className = 'share-modal-overlay';
  modal.innerHTML = `
    <div class="share-modal">
      <div class="share-modal-header">
        <h3>🔗 進捗を共有する</h3>
        <button class="share-modal-close" id="share-modal-close">✕</button>
      </div>
      <div class="share-modal-body">
        <div class="share-form-group">
          <label>あなたの名前</label>
          <input class="share-input" id="share-username" type="text" placeholder="例: 山田 太郎" value="${getUserName()}">
        </div>
        <div class="share-form-group">
          <label>共有する相手の名前</label>
          <input class="share-input" id="share-recipient" type="text" placeholder="例: 鈴木 先生">
        </div>
        <button class="btn btn-primary" id="share-generate-btn" style="width:100%">
          🔗 共有リンク／コードを生成
        </button>

        <div id="share-url-result" style="display:none; margin-top:1.25rem;">
          <div class="share-result-tabs">
            <button class="share-tab active" data-tab="url">URLで共有</button>
            <button class="share-tab" data-tab="code">コードで共有（サーバー不要）</button>
          </div>

          <!-- URL タブ -->
          <div id="share-tab-url" class="share-tab-panel" style="margin-top:0.75rem;">
            <label style="font-size:0.78rem; color:var(--text-muted);">共有URL（コピーして相手に送信）</label>
            <div class="share-url-box">
              <div class="share-url-field" id="share-url-display" style="font-size:0.72rem; word-break:break-all;"></div>
              <button class="btn btn-sm btn-primary" id="share-url-copy-btn">コピー</button>
            </div>
            <div id="share-file-url-wrap" style="display:none; margin-top:0.5rem;">
              <label style="font-size:0.75rem; color:var(--accent);">📂 サーバーなし版URL（file://）</label>
              <div class="share-url-box">
                <div class="share-url-field" id="share-file-url-display" style="font-size:0.68rem; word-break:break-all; color:var(--accent);"></div>
                <button class="btn btn-sm btn-secondary" id="share-file-url-copy-btn">コピー</button>
              </div>
            </div>
          </div>

          <!-- コード タブ -->
          <div id="share-tab-code" class="share-tab-panel" style="display:none; margin-top:0.75rem;">
            <label style="font-size:0.78rem; color:var(--text-muted);">共有コード（サーバー不要・URLなし）</label>
            <p style="font-size:0.72rem; color:var(--text-dim); margin:0.4rem 0 0.6rem;">このコードをメールやメッセージで送り、受信者はサイト上の「コードを入力」から貼り付けます。</p>
            <div class="share-url-box">
              <div class="share-url-field" id="share-code-display" style="font-size:0.62rem; word-break:break-all; font-family:monospace; max-height:4rem; overflow:auto;"></div>
              <button class="btn btn-sm btn-primary" id="share-code-copy-btn">コピー</button>
            </div>
          </div>
        </div>

        ${sharesHTML}
      </div>
    </div>`;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('open'), 10);

  document.getElementById('share-modal-close').onclick = closeShareModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeShareModal(); });

  // タブ切り替え
  modal.querySelectorAll('.share-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      modal.querySelectorAll('.share-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const target = this.dataset.tab;
      document.getElementById('share-tab-url').style.display = target === 'url' ? 'block' : 'none';
      document.getElementById('share-tab-code').style.display = target === 'code' ? 'block' : 'none';
    });
  });

  // 生成ボタン
  document.getElementById('share-generate-btn').onclick = () => {
    const uname = document.getElementById('share-username').value.trim();
    const rname = document.getElementById('share-recipient').value.trim();
    if (!rname) { alert('共有する相手の名前を入力してください。'); return; }
    if (uname) localStorage.setItem(USER_NAME_KEY, uname);

    const urls = generateShareURLs(rname);
    const code = generateShareCode(rname);
    saveShare(rname, urls.current);

    document.getElementById('share-url-display').textContent = urls.current;
    document.getElementById('share-code-display').textContent = code;
    document.getElementById('share-url-result').style.display = 'block';

    if (urls.file) {
      document.getElementById('share-file-url-display').textContent = urls.file;
      document.getElementById('share-file-url-wrap').style.display = 'block';
    }
  };

  document.getElementById('share-url-copy-btn')?.addEventListener('click', function() {
    copyToClipboard(document.getElementById('share-url-display').textContent, this);
  });
  document.getElementById('share-file-url-copy-btn')?.addEventListener('click', function() {
    copyToClipboard(document.getElementById('share-file-url-display').textContent, this);
  });
  document.getElementById('share-code-copy-btn')?.addEventListener('click', function() {
    copyToClipboard(document.getElementById('share-code-display').textContent, this);
  });

  document.querySelectorAll('.share-list-copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      copyToClipboard(decodeURIComponent(this.dataset.url), this);
    });
  });
}

// 受信者側: 共有コード入力ボタンをページに追加
function injectShareCodeInput() {
  if (document.getElementById('share-code-input-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'share-code-input-btn';
  btn.textContent = '📋 共有コードを入力';
  btn.style.cssText = `
    position: fixed; bottom: 1.5rem; right: 1.5rem;
    z-index: 8000; padding: 0.6rem 1rem;
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.35);
    color: #a5b4fc; border-radius: 10px;
    font-size: 0.78rem; font-weight: 600;
    cursor: pointer; font-family: inherit;
    backdrop-filter: blur(8px);
    transition: all 0.2s;
  `;
  btn.onmouseenter = () => { btn.style.background = 'rgba(99,102,241,0.28)'; };
  btn.onmouseleave = () => { btn.style.background = 'rgba(99,102,241,0.15)'; };
  btn.onclick = openShareCodeDialog;
  document.body.appendChild(btn);
}

function openShareCodeDialog() {
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 1rem;
  `;
  dialog.innerHTML = `
    <div style="background:#12121a; border:1px solid rgba(255,255,255,0.1); border-radius:16px;
                padding:2rem; max-width:420px; width:100%; box-shadow:0 32px 64px rgba(0,0,0,0.5);">
      <h3 style="margin:0 0 0.5rem; font-size:1.1rem;">📋 共有コードを貼り付け</h3>
      <p style="font-size:0.8rem; color:#64748b; margin:0 0 1rem;">送られてきた共有コードを以下に貼り付けてください。</p>
      <textarea id="share-code-paste-input" style="width:100%; height:6rem; background:#0a0a0f;
        border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:#f1f5f9;
        font-family:monospace; font-size:0.72rem; padding:0.6rem; resize:vertical;
        box-sizing:border-box;" placeholder="共有コードをここに貼り付け..."></textarea>
      <div style="display:flex; gap:0.75rem; margin-top:0.75rem;">
        <button id="share-code-apply-btn" style="flex:1; padding:0.7rem; background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border:none; border-radius:10px; color:white; font-weight:700; cursor:pointer; font-size:0.9rem;">
          適用する
        </button>
        <button id="share-code-cancel-btn" style="padding:0.7rem 1rem; background:transparent;
          border:1px solid rgba(255,255,255,0.15); border-radius:10px; color:#94a3b8;
          cursor:pointer; font-size:0.9rem;">
          閉じる
        </button>
      </div>
      <div id="share-code-error" style="margin-top:0.5rem; font-size:0.78rem; color:#ef4444; display:none;">
        コードが無効です。正確にコピーされているか確認してください。
      </div>
    </div>`;
  document.body.appendChild(dialog);

  document.getElementById('share-code-cancel-btn').onclick = () => dialog.remove();
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.remove(); });

  document.getElementById('share-code-apply-btn').onclick = () => {
    const code = document.getElementById('share-code-paste-input').value.trim();
    const data = decodeShareCode(code);
    if (!data) {
      document.getElementById('share-code-error').style.display = 'block';
      return;
    }
    savePersistentShare(data);
    dialog.remove();
    showSharedViewBanner(data);
  };
}

// checkSharedView を完全上書き（URL params / hash / localStorage / 全対応）
function checkSharedView() {
  // 1. URLクエリパラメーター (?share=&data=)
  const params = new URLSearchParams(window.location.search);
  const dataStr = params.get('data');
  if (dataStr) {
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(dataStr))));
      savePersistentShare(data);
      try { history.replaceState(null, '', window.location.pathname + window.location.hash); } catch(e){}
      if (!sessionStorage.getItem('svb-hidden')) showSharedViewBanner(data);
    } catch(e) { console.warn('共有データ解析エラー:', e); }
    return;
  }

  // 2. URLハッシュ (#share=&data=) 旧形式
  const hash = window.location.hash;
  if (hash.startsWith('#share=')) {
    try {
      const hp = new URLSearchParams(hash.slice(1));
      const hdata = hp.get('data');
      if (hdata) {
        const data = JSON.parse(decodeURIComponent(escape(atob(hdata))));
        savePersistentShare(data);
        try { history.replaceState(null, '', window.location.pathname); } catch(e){}
        if (!sessionStorage.getItem('svb-hidden')) showSharedViewBanner(data);
        return;
      }
    } catch(e) {}
  }

  // 3. localStorage から永続共有を復元
  const saved = getPersistentShare();
  if (saved && saved.active && !sessionStorage.getItem('svb-hidden')) {
    showSharedViewBanner(saved);
  }
}

// CSS追加（タブ／コードUI）
(function injectShareStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .share-result-tabs { display:flex; gap:0.4rem; flex-wrap:wrap; }
    .share-tab {
      padding: 0.4rem 0.75rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
      background: transparent; color: var(--text-muted); font-size: 0.78rem;
      font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.2s;
    }
    .share-tab:hover { background: rgba(255,255,255,0.05); color: var(--text); }
    .share-tab.active {
      background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.45);
      color: #a5b4fc;
    }
    .share-tab-panel {}
  `;
  document.head.appendChild(style);
})();

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  checkSharedView();
  injectShareCodeInput();
});
