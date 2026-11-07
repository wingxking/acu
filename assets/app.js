(function application(){
'use strict';
const D=window.ACU; if(!D){document.body.textContent='数据加载失败，请刷新页面。';return;}
const page=document.body.dataset.page||'home';
const slug=document.body.dataset.slug||'';
const base=document.body.dataset.base||'./';
const meridians=D.meridians,points=D.points;
const byCode=Object.fromEntries(points.map(p=>[p.code,p]));
const byMeridian=Object.fromEntries(meridians.map(m=>[m.code,m]));
const current=meridians.find(m=>m.slug===slug);
const nowProgress=()=>{try{return JSON.parse(localStorage.getItem('acu-learning-progress')||'{}')}catch{return {}}};
let progress=nowProgress();
const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(p='')=>base+p;
const meridianLink=m=>link('meridians/'+m.slug+'/');
const pointLink=code=>{const m=byMeridian[code.match(/^[A-Z]+/)[0]];return m?meridianLink(m)+'#'+code:link('points/')};
const fullName=c=>D.names[c]||c;
const pointShort=c=>`${fullName(c)} <span class="mono">${c}</span>`;
const badge=(t,kind='')=>`<span class="pill ${kind}">${t}</span>`;
function icon(what){return {home:'⌂',route:'⌁',book:'▤',loc:'⊕',point:'✧',case:'◇',source:'↗',learn:'◫',safety:'♧'}[what]||'◇'}
function navLink(p,label,ico,active){return `<a class="nav-link ${active?'active':''}" href="${link(p)}"><span class="nav-icon">${icon(ico)}</span><span>${label}</span>${active?'<span class="nav-count">●</span>':''}</a>`}
function nav(){
 const main=`<div class="nav-group"><div class="nav-label">探索 · EXPLORE</div>
${navLink('','学习总览','home',page==='home')}
${navLink('learn/','循序学习','learn',page==='learn'||page==='lesson')}
${navLink('meridians/','十四经脉','route',page==='meridians'||page==='meridian')}
${navLink('points/','重点穴位检索','point',page==='points')}
${navLink('topics/','症状学习专题','case',page==='topics')}</div>`;
 const study=`<div class="nav-group"><div class="nav-label">基础课程 · FOUNDATIONS</div>${D.lessons.slice(0,5).map(l=>navLink('learn/'+l[0]+'/',l[1],'book',page==='lesson'&&slug===l[0])).join('')}</div>`;
 return `<aside class="sidebar" id="sidebar"><a href="${link('')}" class="brand"><div class="brand-mark">穴</div><div><div class="brand-title">经穴研习馆</div><div class="brand-caption">ACUPUNCTURE ATLAS</div></div></a><nav class="sidebar-nav" aria-label="主导航">${main}${study}<div class="nav-group"><div class="nav-label">研究 · REFERENCE</div>${navLink('learn/safety/','安全与证据','safety',page==='lesson'&&slug==='safety')}${navLink('sources/','标准与来源','source',page==='sources')}</div></nav><div class="sidebar-bottom"><strong>循序渐进 · 持续校订</strong><p>14 条经脉独立页面 · ${points.length} 个重点穴位详解。图为位置导览，不用于实际针刺。</p><div class="progress-bar" style="margin-top:12px"><div id="side-progress" class="progress-fill" style="width:0%"></div></div></div></aside>`;
}
function getCrumb(){
 if(page==='home')return '总览';
 if(page==='meridians')return '十四经脉';
 if(page==='meridian')return '十四经脉 / '+(current?.name||'');
 if(page==='points')return '重点穴位';
 if(page==='learn')return '学习路径';
 if(page==='lesson')return '学习路径 / '+(D.lessons.find(l=>l[0]===slug)?.[1]||'');
 if(page==='topics')return '症状专题';
 return '资料来源';
}
function layout(inner){
return `<div class="mobile-dim" id="mobile-dim"></div><div class="shell">${nav()}<div class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:13px"><button type="button" id="menu-toggle" class="menu-btn" aria-label="展开导航">☰</button><div class="breadcrumbs"><a href="${link('')}">经穴研习馆</a><span>/</span><b>${getCrumb()}</b></div></div><div class="top-actions"><span class="top-link">循证 · 可查 · 可持续学习</span><button type="button" id="open-search" class="search-btn" aria-label="搜索穴位和课程"><span>⌕ 搜索穴位 / 经络</span><b class="shortcut">/</b><span aria-hidden="true">⌕</span></button></div></header><main class="content" id="main-content">${inner}</main><footer class="foot"><span>© 经穴研习馆 · 中国国标定位为主、传统主治单独标注 · 本站为学习资料，非诊疗建议</span><span><a href="${link('sources/')}">标准与来源</a>　·　<a href="https://github.com/wingxking/acu" target="_blank" rel="noopener">GitHub</a></span></footer></div></div><div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="全站搜索"><div class="search-dialog"><div class="search-dialog-head"><span>⌕</span><input id="global-query" type="search" placeholder="搜索：太溪、KI3、骨度分寸、膀胱经…" autocomplete="off" aria-label="搜索内容"/><button id="close-search" class="close-btn" type="button" aria-label="关闭">×</button></div><div id="global-results" class="search-results"><div class="empty">输入穴位名称、编码、经脉或学习主题</div></div></div></div>`;
}
const drawPaths={
lu:'M78 116 Q72 142 62 158 L52 199 Q44 232 29 274 L16 290',li:'M18 291 L38 260 L54 213 L68 156 L81 109 Q91 87 102 73',st:'M95 73 Q87 92 84 120 L87 170 L95 215 L89 258 L86 326 L82 412',sp:'M80 414 Q90 354 94 312 L96 260 L104 209 Q107 164 102 120',ht:'M104 145 Q89 152 75 170 L58 215 L43 260 L27 293',si:'M26 296 L42 244 L58 180 Q78 151 83 126 Q94 92 111 73',bl:'M112 72 Q116 94 119 116 L119 200 L113 250 Q108 311 99 348 L94 416',ki:'M92 415 L93 345 L98 285 Q104 249 106 205 L107 156 L112 111',pc:'M104 150 Q84 160 70 186 L52 233 L37 276 L27 299',te:'M23 290 L43 247 L58 197 Q76 166 83 123 Q93 89 118 72',gb:'M129 73 Q148 87 143 115 L144 170 L138 215 L144 280 L146 350 L143 416',lr:'M93 419 L101 350 L105 293 L115 248 L122 188 L128 146',cv:'M111 244 L111 213 L111 175 L111 145 L111 112 L111 78',gv:'M108 251 L108 201 L108 153 L108 104 Q107 76 111 54'
};
function drawBody(color='#487c6b',active='cv',view='front',extraClass=''){
 const back=view==='back',flip=back?'translate(220,0) scale(-1,1)':'';
 const extra=back?'背面教学示意':'正面教学示意';
 const d=drawPaths[active]||drawPaths.cv;
 return `<svg class="${extraClass} body-figure" viewBox="0 0 220 448" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${extra}，经脉走向仅为概念路径">
 <g transform="${flip}" fill="#d6e4d9" stroke="#a8bfb0" stroke-width="1.5">
 <ellipse cx="110" cy="48" rx="25" ry="31"/>
 <path d="M100 76 L97 93 L79 100 Q67 103 62 117 L56 204 Q65 230 80 240 L89 248 L90 282 L78 405 Q77 423 87 430 Q95 429 97 414 L107 290 L112 273 L117 291 L127 414 Q129 429 137 430 Q146 425 144 404 L133 282 L134 248 L144 237 Q153 219 158 203 L155 118 Q154 105 140 100 L122 93 L120 76Z"/>
 <path d="M72 104 Q56 100 46 111 L29 183 L10 258 Q4 275 9 295 Q15 302 19 289 L43 219 L65 155 L79 116Z"/>
 <path d="M147 105 Q163 100 174 114 L191 185 L211 259 Q218 275 210 294 Q203 302 200 288 L177 220 L155 159Z"/>
 </g><g stroke="#f8fff9" stroke-width="1" fill="none" opacity=".55"><path d="M110 92 L110 257" stroke-dasharray="4 5"/><path d="M68 149 L152 149" stroke-dasharray="4 5"/><path d="M76 236 L145 236" stroke-dasharray="4 5"/></g>
 <path d="${d}" fill="none" stroke="${color}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" opacity=".14"/>
 <path d="${d}" fill="none" stroke="${color}" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>
 <circle cx="${(active==='gb')?143:active==='li'?18:active==='lu'?16:active==='cv'?111:active==='gv'?111:106}" cy="${active==='gb'?416:active==='li'?291:active==='lu'?290:active==='cv'?78:active==='gv'?54:205}" r="5" fill="${color}" stroke="#fff" stroke-width="2"/>
 <text x="111" y="446" text-anchor="middle" fill="#6f8c7a" font-size="9">${extra} · 非等比例定位图</text></svg>`;
}
function rulerSvg(){
const ticks=Array.from({length:13},(_,i)=>`<line x1="${35+i*41}" x2="${35+i*41}" y1="91" y2="${i%2===0?114:104}" stroke="#3c7969" stroke-width="${i%2===0?2.2:1}"/><text x="${35+i*41}" y="134" text-anchor="middle" font-size="12" fill="#426d5b">${i}</text>`).join('');
return `<svg class="ruler" viewBox="0 0 565 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="示意：本人前臂腕横纹至肘横纹规定为12骨度寸"><text x="35" y="28" font-size="16" font-weight="700" fill="#245c4d">前臂 · 12 骨度寸</text><text x="35" y="51" font-size="11" fill="#709181">不是固定厘米数，按本人两端标志间距等分</text><line x1="35" x2="527" y1="91" y2="91" stroke="#3c7969" stroke-width="3"/>${ticks}<text x="35" y="152" font-size="11" fill="#759586">腕横纹 0</text><text x="527" y="152" font-size="11" text-anchor="end" fill="#759586">肘横纹 12</text><rect x="35" y="72" width="82" height="9" rx="4" fill="#a5cbb5"/><text x="117" y="72" font-size="10" fill="#4a8371">内关 / 外关 2寸</text></svg>`;
}
function sectionHead(eyebrow,title,description,right=''){return `<div class="section-head"><div><div class="eyebrow">${eyebrow}</div><h2 class="section-title serif">${title}</h2>${description?`<p>${description}</p>`:''}</div>${right}</div>`}
function meridianCard(m,index){
let listed=points.filter(p=>p.meridian===m.code).length;
return `<a class="card meridian-card" href="${meridianLink(m)}" style="--dot:${m.color}"><div class="card-top"><span class="card-index mono">${String(index+1).padStart(2,'0')} / ${m.code}</span><span class="card-arrow">↗</span></div><h3>${m.name}</h3><p class="path-small">${m.path}</p><div class="card-footer"><span><i class="dot"></i>${m.nature}</span><span>${listed} 个精讲 · 全经 ${m.count} 穴</span></div></a>`;
}
function lessonCard(l){
const done=!!progress['lesson:'+l[0]];
return `<a href="${link('learn/'+l[0]+'/')}" class="card"><div class="card-top"><span class="card-index mono">${l[4]} / ${l[3]}</span>${done?badge('已学习'):'<span class="card-arrow">↗</span>'}</div><h3>${l[1]}</h3><p>${l[2]}</p><div class="card-footer"><span>课程 · 基础知识</span><span>${done?'✓ 已标记':'开始阅读 →'}</span></div></a>`;
}
function home(){
return `<section class="hero"><div class="hero-copy"><div class="eyebrow">A STRUCTURED ATLAS OF ACUPOINTS</div><h1 class="h1 serif">从经络入门，<br>把每一个穴位<span style="color:#397663">找准。</span></h1><p class="lead">循着十四经脉建立人体空间认识，以骨性标志、骨度分寸与解剖描述为依据，一条经脉、一堂课程地系统学习。</p><div class="hero-actions"><a href="${link('learn/')}" class="btn-primary">从第一课开始 <span>↗</span></a><a href="${link('meridians/')}" class="btn-outline">浏览十四经脉 ↗</a></div><div class="stat-row"><div><div class="stat-value">14 <span style="font-size:12px;font-weight:500">经脉</span></div><div class="stat-label">十二正经 + 任督二脉</div></div><div><div class="stat-value">362 <span style="font-size:12px;font-weight:500">经穴</span></div><div class="stat-label">国标总量 · 非本站已详解量</div></div><div><div class="stat-value">${points.length} <span style="font-size:12px;font-weight:500">穴位</span></div><div class="stat-label">当前重点精讲</div></div></div></div><div class="hero-visual">${drawBody('#2a7666','st','front')}<div class="hero-annotation">ANATOMICAL ORIENTATION · SCHEMATIC ONLY</div></div></section>
${sectionHead('LEARNING PATH','从零到系统，按知识层级学习','先认识经脉和人体方位，再学骨度定位、特定穴分类，最后回到各经脉逐一梳理。',`<a class="text-link" href="${link('learn/')}">查看完整学习路线 →</a>`)}
<div class="grid grid-4">${D.lessons.slice(0,4).map(lessonCard).join('')}</div>
${sectionHead('MERIDIAN EXPLORER','按经脉分章节深入','独立路径、要点详解、重点穴位和特定穴索引。每条经脉既能独立阅读，也能加入学习进度。',`<a class="text-link" href="${link('meridians/')}">全部 14 条经脉 →</a>`)}
<div class="grid grid-4">${meridians.filter(m=>['lu','li','st','sp','bl','ki','pc','te'].includes(m.slug)).map((m,i)=>meridianCard(m,i)).join('')}</div>
${sectionHead('THE METHOD','定位学习的三个层次','定位优先级：标准解剖部位与体表标志 → 骨度比例测量 → 手指同身寸辅助。')}
<div class="grid grid-3"><div class="card"><div class="feature"><div class="feature-icon">⌖</div><div><h4>01 · 体表标志</h4><p>先识别骨突、关节横纹、肌腱、凹陷，避免用“差不多”代替准确位置。</p></div></div></div><div class="card"><div class="feature"><div class="feature-icon">↔</div><div><h4>02 · 骨度分寸</h4><p>根据本人的骨性标志区段等比例折算，不把 1 寸误认为固定厘米。</p></div></div></div><div class="card"><div class="feature"><div class="feature-icon">≋</div><div><h4>03 · 分开证据层级</h4><p>标准定位、传统主治和现代疗效证据分别说明，避免相互混淆。</p></div></div></div></div>
<div style="margin-top:26px" class="notice"><strong>学习与安全：</strong>本站展示的是经络学与传统针灸知识，不提供自行针刺步骤。所有人体图线均为经脉概念性走向示意，不能替代实际解剖定位；急性或持续症状应接受医疗评估。</div>`;
}
function meridiansIndex(){
const regular=meridians.filter(m=>!['cv','gv'].includes(m.slug));const extra=meridians.filter(m=>['cv','gv'].includes(m.slug));
return `<div class="page-heading"><span class="eyebrow">THE FOURTEEN CHANNELS</span><h1 class="h1 serif">十四经脉 · 一经一课</h1><p class="lead">十二正经按手足、阴阳分组；任督二脉沿身体前后正中线。每个路由完整呈现循行导览、关键体表区域、已精讲穴位与特定穴。</p><div class="chip-list">${['手三阴','手三阳','足三阴','足三阳','奇经八脉'].map(t=>`<a class="tag" href="#${t}">${t}</a>`).join('')}</div></div>
${['手三阴','手三阳','足三阴','足三阳'].map(f=>`<section id="${f}">${sectionHead('TWELVE PRIMARY CHANNELS',f,'经脉的“阴阳”是传统分区命名，不是日照方向或现代解剖神经束。')}<div class="grid grid-3">${regular.filter(m=>m.family===f).map((m,i)=>meridianCard(m,i)).join('')}</div></section>`).join('')}
<section id="奇经八脉">${sectionHead('EXTRAORDINARY VESSELS','任脉与督脉','任督不在十二正经之内，但与其一起构成常说的十四经。')}<div class="grid grid-2">${extra.map((m,i)=>meridianCard(m,i)).join('')}</div></section><div class="notice" style="margin-top:25px"><strong>计数口径：</strong>现行 GB/T 12346—2021 收录 362 个经穴（含印堂 GV29），WHO 2008 标准为 361 穴。卡片“精讲”是本站已录入详解的数量，不表示整经只有这些穴位。</div>`;
}
function pointCards(data){
 return data.map(p=>`<article class="point-card" id="${p.code}"><div class="point-head"><h3 class="point-title">${p.name} <small class="mono">${p.code}</small></h3><a class="point-row-link" href="${pointLink(p.code)}" title="复制或打开经脉内位置">↗</a></div><div class="chip-list" style="margin-top:9px">${p.tags.slice(0,4).map(t=>`<span class="tag">${htmlEscape(t)}</span>`).join('')}</div><p class="point-where">${htmlEscape(p.where)}</p><details><summary>展开骨度、简便定位与传统主治</summary><div class="detail-row"><b>简便取穴 · 先确认体表标志</b><span>${htmlEscape(p.how)}</span></div><div class="detail-row"><b>骨度 / 关键参照</b><span>${htmlEscape(p.cun)}</span></div><div class="detail-row"><b>传统主治 · 不是疗效保证</b><span>${htmlEscape(p.trad)}</span></div>${p.caution?`<div class="detail-row safety"><b>安全提醒</b><span>${htmlEscape(p.caution)}</span></div>`:''}</details></article>`).join('');
}
function fiveShuMini(m){
const a=D.fiveshu[m.code];if(!a)return '';
return `<div class="card"><h3 style="margin:0 0 13px;font-size:15px">本经五输穴</h3><p class="kicker" style="margin-bottom:15px">井 → 荥 → 输 → 经 → 合 · 传统五行：${m.family.includes('阴')?'木 / 火 / 土 / 金 / 水':'金 / 水 / 木 / 火 / 土'}</p><div class="chip-list">${a.map((x,i)=>`<a href="${pointLink(x)}" class="tag">${['井','荥','输','经','合'][i]} · ${fullName(x)} <span class="mono">${x}</span></a>`).join('')}</div><div class="aside-note">未提供详细卡片的名称可在五输穴总课中先认识，后续逐条校订定位。</div></div>`;
}
function meridianPage(){
if(!current)return '<p>没有找到经脉。</p>';
const m=current;
const ps=points.filter(p=>p.meridian===m.code).sort((a,b)=>Number(a.code.match(/\d+/)[0])-Number(b.code.match(/\d+/)[0]));
const hasFive=!!D.fiveshu[m.code];
return `<div class="page-heading"><span class="eyebrow">CHANNEL STUDY / ${m.code}</span><div class="subnav"><a href="${link('meridians/')}">← 返回十四经</a><a href="#route">循行导览</a><a href="#points">重点穴位</a>${hasFive?'<a href="#special">特定穴</a>':''}<a href="#study">学习确认</a></div></div>
<section class="meridian-hero"><div class="card meridian-intro"><div class="chip-list">${badge(m.family)}${badge(m.nature,'gold')}${badge(m.direction,'gray')}</div><h1 class="h1 serif">${m.name}</h1><p class="lead" style="margin-top:17px">${m.path}</p><div class="metric-list"><div class="metric"><b>${m.count}</b><span>全经国标穴位数</span></div><div class="metric"><b>${ps.length}</b><span>本站已精讲</span></div><div class="metric"><b>${m.code}</b><span>国际编码</span></div></div><div class="notice green"><strong>本经核心：</strong>${m.highlight}</div><p class="kicker" style="margin-top:20px">主要体表区域：${m.region}</p></div><div class="diagram-card" id="meridian-diagram" data-code="${m.slug}" data-color="${m.color}"><div class="switcher"><button class="selected" type="button" data-view="front">正面</button><button type="button" data-view="back">背面</button></div><div id="diagram-svg">${drawBody(m.color,m.slug,'front')}</div><div class="diagram-label">经络循行“概念性路径”示意<br>不显示精确穴点坐标，不可据图针刺</div></div></section>
${sectionHead('ORIENTATION','这条经脉怎么走？','先记方向和身体分区，再将穴位与解剖标志对应，而非把线看成真实神经或血管。')}
<div class="grid grid-2" id="route"><div class="card"><div class="eyebrow">DIRECTION</div><h3 class="serif" style="margin:10px 0 13px;font-size:22px">${m.direction}</h3><p style="color:var(--muted);font-size:13px;line-height:2">${m.path}</p></div><div class="card"><div class="eyebrow">SURFACE ANATOMY</div><h3 class="serif" style="margin:10px 0 13px;font-size:22px">主要区域</h3><p style="color:var(--muted);font-size:13px;line-height:2">${m.region}</p><p class="kicker">左右成对经脉的标准穴位总数通常不按左右重复计算；任督走正中线。</p></div></div>
${sectionHead('KEY ACUPOINTS',`重点穴位 · ${ps.length} 个`,'每张卡片可展开“标准位置摘录 → 简便取穴 → 骨度参照 → 传统主治 → 风险提示”。本站不提供进针角度或深度。')}
<div class="article-grid" id="points"><div><div class="point-list">${pointCards(ps)}</div></div><aside class="aside-card"><h4>本经穴位速查</h4>${ps.map(p=>`<a href="#${p.code}">${p.name} <span class="mono" style="float:right">${p.code}</span></a>`).join('')}<p class="aside-note">精讲列表是分阶段整理的重点穴位，不是该经全部穴位名录。</p></aside></div>
${hasFive?`<div id="special">${sectionHead('CLASSIFICATION','本经特定穴索引','分层理解“经脉五行”和“五输穴五行”是两个不同概念。')}${fiveShuMini(m)}</div>`:''}
<div id="study" style="margin-top:45px" class="card"><div class="card-top"><div><div class="eyebrow">YOUR PROGRESS</div><h3 style="font-size:20px;margin:8px 0">完成本经学习了吗？</h3><p>掌握本经走向、关键骨性标志，以及至少三个重点穴位的定位区别后再标记。</p></div><button class="btn-primary mark-btn" data-progress="meridian:${m.slug}">${progress['meridian:'+m.slug]?'✓ 已完成':'标记已学习 ✓'}</button></div></div>`;
}
function pointIndex(){
return `<div class="page-heading"><span class="eyebrow">ACUPOINT INDEX</span><h1 class="h1 serif">重点穴位检索</h1><p class="lead">目前已校订整理 ${points.length} 个重点穴位；全经 362 个穴位的标准定位不等于本站已完成逐穴详解。可按名称、编码、骨度关键词、经脉与身体区域检索。</p></div>
<div class="toolbar"><input id="point-query" class="field" type="search" placeholder="搜索：内踝、腕横纹、太溪、KI3…" aria-label="搜索穴位"/><select class="field select" id="point-meridian" aria-label="按经脉筛选"><option value="">所有经脉</option>${meridians.map(m=>`<option value="${m.code}">${m.name}</option>`).join('')}</select><select id="point-region" class="field select" aria-label="按身体区域筛选"><option value="">全身区域</option>${[...new Set(points.map(p=>p.region))].sort().map(r=>`<option value="${r}">${r}</option>`).join('')}</select><span class="result-count" id="point-count">${points.length} 个结果</span></div><div class="point-list" id="filtered-points">${pointCards(points.slice(0,60))}</div><div style="margin-top:20px" class="notice">提示：已展示的是“有详细定位的重点穴位”，尚未给每个经穴都填入精准位置；不要把未列出误认为该穴不存在。</div>`;
}
function learnIndex(){
const complete=D.lessons.filter(l=>progress['lesson:'+l[0]]).length;
return `<div class="page-heading"><span class="eyebrow">CURRICULUM / 8 LESSONS</span><h1 class="h1 serif">系统学习路径</h1><p class="lead">从“经脉定位的地图”开始，不急着背所有穴位。每节学习后可标记完成；进度保存在当前浏览器本地。</p><div class="card" style="max-width:560px;margin-top:24px"><div class="card-top"><strong style="font-size:13px">基础课程学习进度</strong><span class="mono" style="font-size:12px;color:var(--jade)">${complete} / 8</span></div><div class="progress-bar" style="margin-top:14px"><div class="progress-fill" style="width:${complete/8*100}%"></div></div></div></div>${sectionHead('THE FOUNDATION','第一阶段 · 建立空间认知','把十二经脉、任督二脉与骨性标志放进同一张全身地图。')}<div class="grid grid-3">${D.lessons.slice(0,4).map(lessonCard).join('')}</div>${sectionHead('CLINICAL LITERACY','第二阶段 · 理解分类与边界','先理解特定穴的传统理论，再认识其与临床证据之间的差别。')}<div class="grid grid-3">${D.lessons.slice(4).map(lessonCard).join('')}</div>`;
}
function nameLink(code){return `<a class="point-row-link" href="${pointLink(code)}">${fullName(code)} <span class="mono">${code}</span></a>`}
function table(headers,rows){return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function lessonHTML(id){
switch(id){
case 'intro':return `<h2>01 · 什么是经络与经穴？</h2><p>“经络”是传统中医用于描述脏腑联系、体表分区与传统诊疗关系的概念模型；不能简单等同于一根独立可见的神经、动脉或筋膜线。“经穴”是有标准名称与体表定位的传统穴点。</p><div class="highlight"><b>十四经 = 十二正经 + 任脉 + 督脉。</b> 以现行国标 GB/T 12346—2021 的计数为 362 个经穴（包含印堂 GV29）；WHO 2008 定位标准为 361 个。</div><h2>02 · 经脉先按手足与阴阳分组</h2>${table(['经脉组','代表经脉','主要体表分区'],[['手三阴','肺、心包、心','上肢相对内侧'],['手三阳','大肠、三焦、小肠','上肢相对外侧'],['足三阳','胃、胆、膀胱','下肢前、外、后侧'],['足三阴','脾、肝、肾','下肢内侧不同分区'],['任督二脉','任脉 / 督脉','身体前、后正中线']])}<h2>03 · 五问学习法</h2><div class="step-list">${[['是什么','经穴的定义和经脉归属'],['在哪里','能摸到什么骨性标志、横纹、肌腱'],['如何量','是否需要骨度比例；哪段是标准起讫点'],['有什么属性','井荥输经合、原络郄、背俞或八脉交会'],['传统主治与证据','分别记录传统用途和现代医学证据']].map((a,i)=>`<div class="step"><span class="step-no">${i+1}</span><div><strong>${a[0]}</strong><p>${a[1]}</p></div></div>`).join('')}</div><p>下一节从左右、前后、阴阳与经脉循行方向入手，形成整体位置感。</p>`;
case 'orientation':return `<h2>01 · 阴阳不是“阳光能照到的地方”</h2><p>太阳、少阳、阳明、太阴、少阴、厥阴首先是六经系统的命名。初学可用人体站立时的分区帮助记忆，但不能套用“太阳=背后全部”“阳明=前面全部”等绝对规则；每条经脉在头、胸、手、足存在转折。</p>${table(['分区','人体记忆方位（教学概括）','对应经脉'],[['阳明','上肢前外侧、下肢前面','手阳明大肠 / 足阳明胃'],['少阳','上肢外侧中线、下肢外侧','手少阳三焦 / 足少阳胆'],['太阳','上肢后外侧、下肢后面','手太阳小肠 / 足太阳膀胱'],['太阴','上肢前内侧、下肢内侧偏前','手太阴肺 / 足太阴脾'],['厥阴','上肢内侧中线、下肢内侧中段','手厥阴心包 / 足厥阴肝'],['少阴','上肢内侧偏后、下肢内侧偏后','手少阴心 / 足少阴肾']])}<h2>02 · 经典循行方向口诀</h2><div class="quote">手三阴从胸走手，手三阳从手走头，足三阳从头走足，足三阴从足走腹胸。</div><p>它是系统记忆的总体规律，不等于一条真实直线。经脉图上的“线”应理解为传统循行概念和串联结构。</p><h2>03 · 十二正经的表里配对</h2>${table(['阴经','阳经','传统五行'],[['肺 LU','大肠 LI','金'],['脾 SP','胃 ST','土'],['心 HT','小肠 SI','火'],['肾 KI','膀胱 BL','水'],['心包 PC','三焦 TE','相火（传统火类）'],['肝 LR','胆 GB','木']])}<p>学习时先辨清“上肢内侧/外侧”与“下肢前后位置”，再在每条经脉路由看详细体表分布。</p>`;
case 'bone-cun':return `<h2>01 · 骨度分寸不是“尺骨”</h2><p><b>骨度分寸</b>（bone proportional cun）以本人的体表骨性标志之间的长度为分段，把该段等比例划为规定寸数。“尺骨”则只是前臂小指侧的一根具体骨骼，两者不是一回事。</p><div class="formula">目标距离 = 本人该段实际长度 × 目标寸数 ÷ 该段规定总寸数</div>${rulerSvg()}<h2>02 · 常用分段速查</h2>${table(['身体分段','标准骨度寸','应用举例'],[['腕横纹 → 肘横纹','12寸','内关2寸、间使3寸、郄门5寸'],['前发际正中 → 后发际正中','12寸','百会前发际上5寸'],['前额两发角之间','9寸','头维等头部横向参照'],['两乳头之间（仅作传统胸部辅助基准）','8寸','胸部横向比例需综合肋间及其他基准'],['胸剑联合 → 脐中','8寸','中脘脐上4寸'],['脐中 → 耻骨联合上缘','5寸','关元脐下3寸、中极脐下4寸'],['内踝尖 → 足底','3寸','照海内踝下1寸配合骨缘凹陷'],['外踝尖 → 腘横纹','16寸','丰隆外踝尖上8寸、悬钟上3寸'],['内踝尖 → 腘横纹','15寸','三阴交内踝上3寸、蠡沟上5寸']])}<h2>03 · 实际怎么量？</h2><div class="step-list">${[['先找两个端点','例如腕横纹与肘横纹，不要先摆手指。'],['确定该段规定总寸数','腕至肘 = 12骨度寸。'],['按本人比例取目标寸数','2寸就是该段距离的 2/12，而不是所有人都等于固定厘米数。'],['最后回到解剖标志','穴位常同时要求“肌腱之间”“骨缘凹陷”等，不可只量不摸。']].map((x,i)=>`<div class="step"><span class="step-no">${i+1}</span><div><strong>${x[0]}</strong><p>${x[1]}</p></div></div>`).join('')}</div><div class="notice"><strong>注意：</strong>指寸法可以辅助，但手指宽度无法代替所有局部骨度。不同身体区段也不能把某处“一寸”的厘米长度照搬到另一处。</div>`;
case 'landmarks':return `<h2>01 · 先认识脊柱</h2>${table(['脊柱段','数量','骨性识别要点'],[['颈椎 C1–C7','7节','C7常见突出，需动态与T1区分'],['胸椎 T1–T12','12节','胸椎与肋骨相连；肩胛标志随姿势变化'],['腰椎 L1–L5','5节','腰部常以髂嵴最高点连线接近L4作辅助，个体存在差异'],['骶骨','通常5节融合','骶后孔定位涉及复杂体表触诊'],['尾骨','常见3–5节融合','不用于粗略推算上方穴位']])}<h2>02 · 背俞穴第一侧线</h2><p>膀胱经背俞常采用“某椎棘突下，后正中线旁开 1.5 寸”描述；第二条较外侧背部线常为旁开 3 寸。<b>旁开是横向比例，不是从棘突尖斜量。</b> 肩胛下角常被近似作为T7参考，但受体位变化影响，不能单靠该标志完成椎体精确编号。</p>${table(['传统对应','穴位','水平标志'],D.backshu.map(x=>[x[0]+'俞',nameLink(x[1]),x[2]+'棘突下水平，旁开1.5寸（骶部依骶孔）']))}<h2>03 · 易混淆的骨与肌腱标志</h2><div class="grid grid-2"><div class="card"><h3>内踝 vs 外踝</h3><p>内踝属于胫骨远端，外踝属于腓骨远端。太溪 KI3 在内踝后、照海 KI6 在内踝下；昆仑 BL60 在外踝后、申脉 BL62 在外踝下。</p></div><div class="card"><h3>腘窝与半腱肌</h3><p>腘横纹中点为委中 BL40，外侧靠股二头肌腱，内侧可辨半腱肌腱；腘窝有重要血管神经，学习触诊不等于允许深压。</p></div></div><h2>04 · 体位很重要</h2><p>腕掌侧与腕背侧、肘屈与伸、肩外展与自然下垂会改变凹陷与肌腱的可见性。先使用该穴位要求的体位，再结合标准文本确认。</p>`;
case 'fiveshu':return `<h2>01 · 井、荥、输、经、合：水流比喻</h2><div class="quote">所出为井，所溜为荥，所注为输，所行为经，所入为合。</div><p>这是传统五输穴以水流由小到大类比末端至肘膝方向的说法：井如源头、荥如小流、输如注入、经如通道、合如汇入。它不意味着人体真的存在对应的可见水流通道。</p>${table(['类别','位置理解','阴经五行','阳经五行'],[['井','手足末端','木','金'],['荥','指趾附近','火','水'],['输','掌跖关节附近','土','木'],['经','腕踝至前臂/小腿','金','火'],['合','肘膝附近','水','土']])}<h2>02 · 十二经各五输穴（60个）</h2>${table(['经脉','井','荥','输','经','合'],Object.entries(D.fiveshu).map(([code,arr])=>[byMeridian[code]?.short||code,...arr.map(c=>nameLink(c))]))}<h2>03 · 为什么肾经属水，太溪又属土？</h2><p>“肾经属水”是传统脏腑五行归类；“太溪为输穴属土”是<b>阴经五输穴内部的五行次序</b>。两者属于不同分类轴，不矛盾。阴经的原穴通常与输穴重合，阳经另有原穴。</p>`;
case 'special':return `<h2>01 · 原、络、郄三个不同维度</h2><p><b>原穴</b>：传统称原气输注之处；<b>络穴</b>：与络脉相联的特定穴；<b>郄穴</b>：传统认为经气深聚处。它们不是解剖组织类型，也不是针刺部位安全性的保证。</p>${table(['经脉','原穴','络穴','郄穴'],D.yuanluoxi.map(x=>[byMeridian[x[0]]?.short||x[0],nameLink(x[1]),nameLink(x[2]),nameLink(x[3])]))}<div class="highlight">十二正经各有一个原穴；十五络包括十二经的络穴、任脉络、督脉络、脾之大络；十六郄包括十二经和阴/阳维、阴/阳跷各一。</div><h2>02 · 八脉交会穴：四组常见配对</h2>${table(['一穴','另一穴','传统联系'],D.confluent.map(x=>[nameLink(x[0]),nameLink(x[1]),x[2]]))}<h2>03 · 六腑下合穴</h2><p>下合穴“合于下”属于传统特定穴系统，不等于普通合穴全部都属于下合穴。</p>${table(['对应六腑','下合穴'],D.lowerHe.map(x=>[x[0],nameLink(x[1])]))}<h2>04 · 背俞与募穴</h2><p>背俞位于背腰骶区域的膀胱经侧线；募穴主要在胸腹区域。传统用来表达与脏腑相关的不同穴位分类。准确触诊须先识别椎骨、肋间与横向骨度寸。</p>${table(['对应','背俞','关键定位'],D.backshu.map(x=>[x[0],nameLink(x[1]),x[2]+'棘突下水平 / 侧线1.5寸']))}`;
case 'zangfu':return `<h2>01 · 五脏六腑的五行归类</h2>${table(['五行','五脏（传统）','六腑（传统）','对应经脉'],[['木','肝','胆','足厥阴肝 / 足少阳胆'],['火','心','小肠','手少阴心 / 手太阳小肠'],['火（相火）','心包','三焦','手厥阴心包 / 手少阳三焦'],['土','脾','胃','足太阴脾 / 足阳明胃'],['金','肺','大肠','手太阴肺 / 手阳明大肠'],['水','肾','膀胱','足少阴肾 / 足太阳膀胱']])}<h2>02 · 三焦在哪里？</h2><p>“三焦”在传统中医学中是上焦、中焦、下焦的功能分区和气化、水液运行概念，并不对应现代解剖学中一个可以单独解剖取出的器官。把三焦画成某一个具体“实体脏器”是误导。</p><h2>03 · 经脉位置与脏腑名称之间的关系</h2><p>经脉名称中的“肺、脾、肾、胃”等是传统脏腑系统的命名。不同经脉经过身体不同体表区域，不应按现代器官投影位置简单画出单一经线。</p><div class="notice"><strong>区别三个层面：</strong>传统脏腑与五行关系是理论模型；骨、筋、肌肉、血管属于现代解剖学；某疗法是否有效属于需要独立临床证据的问题。</div>`;
case 'safety':return `<h2>01 · “酸、麻、胀”不等于扎准了</h2><p>触压或针刺后出现酸胀可来自多种组织刺激；针刺触到神经、血管或其他深部结构也可能产生异常感受。<b>麻、电击样痛、放射痛或出血不是精准定位的可靠验证方式。</b> 禁止通过追求强烈“得气感”来自行判断针刺安全。</p>${table(['感觉或表现','应如何理解'],[['轻度局部压感','可作为普通触诊反馈，不证明治疗效果'],['明显麻木、放电样痛','可能提示神经受刺激，立即停止按压并评估'],['明显搏动','可能接近血管，不要在该点用力按压'],['瘀青、持续痛或肿胀','停止刺激，如持续或加重应就医'],['皮肤红肿、破损、感染','不要在该处按揉、针刺或艾灸']])}<h2>02 · 避免自行针刺的高风险部位</h2><p>眼周、颈部、胸背部、锁骨上下窝、腋窝、深部臀区、腘窝及重要血管神经邻近区域都存在风险。针刺须由具备资质的专业人员在无菌条件下进行；非专业者不应自行操作进针方向、深度、放血或艾灸。</p><h2>03 · 特殊情况</h2><ul><li><b>妊娠：</b>合谷、三阴交、昆仑、至阴及下腹/腰骶等部位传统上存在特殊禁忌或慎用，孕期穴位刺激应先咨询产科医生。</li><li><b>抗凝治疗或出血倾向：</b>针刺、放血风险增加，需提前向医生说明。</li><li><b>腰背痛红旗：</b>如出现进行性下肢无力、鞍区麻木、大小便功能异常、发热伴背痛或明显外伤，请及时就医。</li><li><b>关节红肿热痛：</b>首先排除痛风、感染或其他炎症；急性发炎部位不建议自行按摩刺激。</li></ul><h2>04 · 如何理解“传统主治”？</h2><p>本网站的“传统主治”记录的是历史中医用法，不等于已证明某穴单独可以治疗这些疾病。针灸对某些慢性疼痛等情况已有研究，但疗效随疾病、研究设计及比较方法而异，且可能包含非特异性影响。见本站<a class="point-row-link" href="${link('sources/')}">来源与证据页面</a>。</p>`;
default:return '<p>正在校订课程。</p>';
}
}
function lessonPage(){
const l=D.lessons.find(x=>x[0]===slug);if(!l)return '<p>课程不存在。</p>';
const i=D.lessons.indexOf(l);
return `<div class="subnav"><a href="${link('learn/')}">← 返回学习路径</a><a href="${link('meridians/')}">进入十四经脉</a></div><header class="lesson-hero"><div class="eyebrow">LESSON ${l[4]} / ${l[3]}</div><h1 class="h1 serif">${l[1]}</h1><p class="lead">${l[2]}</p>${badge(`第 ${i+1} / ${D.lessons.length} 课`,'gold')}</header><div class="article-grid"><article class="card lesson-body">${lessonHTML(slug)}<hr class="divider"/><div class="card-top"><button class="btn-primary mark-btn" type="button" data-progress="lesson:${l[0]}">${progress['lesson:'+l[0]]?'✓ 已完成本课':'标记本课已学习 ✓'}</button>${D.lessons[i+1]?`<a class="text-link" href="${link('learn/'+D.lessons[i+1][0]+'/')}">下一课：${D.lessons[i+1][1]} →</a>`:`<a class="text-link" href="${link('meridians/')}">进入经脉学习 →</a>`}</div></article><aside class="aside-card"><h4>课程目录</h4>${D.lessons.map((x,j)=>`<a href="${link('learn/'+x[0]+'/')}">${progress['lesson:'+x[0]]?'✓ ':''}${x[4]} · ${x[1]}</a>`).join('')}<div class="aside-note">内容采用中文教学摘录。详细取穴始终以现行国标和合格医师实际定位为准。</div></aside></div>`;
}
function topicsPage(){
return `<div class="page-heading"><div class="eyebrow">TOPIC-BASED LEARNING</div><h1 class="h1 serif">症状专题 · 从问题返回经脉</h1><p class="lead">把常见问题当成定位练习的入口：认识可能关联的传统穴位，同时学习何时应就医。这里不是“症状→穴位→自行针刺”的处方页面。</p></div><div class="grid grid-2">${D.topics.map(t=>`<section class="card"><div class="card-top">${badge('学习专题','gold')}<span class="card-index">${t[0].toUpperCase()}</span></div><h3>${t[1]}</h3><p>${t[2]}</p><div class="chip-list" style="margin-top:16px">${t[3].map(x=>`<a class="tag" href="${pointLink(x)}">${fullName(x)} <span class="mono">${x}</span></a>`).join('')}</div></section>`).join('')}</div><div class="notice" style="margin-top:22px"><strong>重要：</strong>鼻炎、痛风性关节炎、腰椎间盘相关疼痛等可能需要针对病因的诊断与治疗；穴位知识不能替代正规的评估。</div>`;
}
function sourcePage(){
const sources=[
['国家标准 GB/T 12346—2021《经穴名称与定位》','2021年实施，现行推荐性国家标准；本馆穴位编码与定位描述的首要依据。','https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=397548AE7248D3D87DD15E0AB8107185'],
['中国针灸标准网：经穴名称与定位介绍','说明该国家标准规定 362 个经穴、骨度分寸与体表标志。','https://www.ntcamsac.ac.cn/cms/content?id=105'],
['WHO Standard Acupuncture Point Locations in the Western Pacific Region','2008年西太平洋区域标准，涵盖361穴；与2021国标口径存在差异。','https://iris.who.int/bitstream/handle/10665/353407/9789290613831-eng.pdf?sequence=1'],
['WHO Standard Acupuncture Nomenclature','WHO传统经穴命名、跨语言对照的参考资料。','https://www.who.int/publications/i/item/9290611057'],
['NCCIH · Acupuncture: Effectiveness and Safety','美国国家补充与整合健康中心对针灸疗效研究及相关风险的综合性介绍。','https://www.nccih.nih.gov/health/acupuncture-effectiveness-and-safety'],
['GB/T 40997—2021《经外奇穴名称与定位》','经外奇穴应与十四经经穴分开分类，例如百虫窝等。','https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=D2AEF8AD07C0150E19859079579EF99F']
];
return `<div class="page-heading"><div class="eyebrow">SOURCES & EDITORIAL POLICY</div><h1 class="h1 serif">标准、来源与校订原则</h1><p class="lead">明确哪些来自国家标准、哪些是传统中医概念、哪些是现代医学证据。保持内容可核对、可持续扩展，而非制造“穴位图看着准”的错觉。</p></div><div class="card">${sources.map((s,i)=>`<div class="source-item"><span class="source-bubble mono">${String(i+1).padStart(2,'0')}</span><div><h3>${s[0]}</h3><p>${s[1]}</p><a href="${s[2]}" target="_blank" rel="noopener noreferrer">查看原始来源 ↗</a></div></div>`).join('')}</div>${sectionHead('EDITORIAL POLICY','资料校订规则','对定位、理论、证据和图像采用不同标签与质量标准。')}<div class="grid grid-2"><div class="card"><h3>标准定位</h3><p>统一编码、解剖参照、骨度分寸、取穴体位与易错点。国标为主，WHO 用于国际标准对照。详情是教学性转述，不是对标准全文的复制。</p></div><div class="card"><h3>传统主治</h3><p>用“传统用于……”表述历史针灸学主治，不等于某一穴位可治愈疾病，也不提供自行针刺方法。</p></div><div class="card"><h3>图示边界</h3><p>人体线图为方向性、分区性示意，无法通过一张小型 SVG 精确定位全部穴点。精确穴位图需要骨骼、肌腱、皮肤与体位校准。</p></div><div class="card"><h3>持续修订</h3><p>目前是14经脉、141个重点穴位的教学版。其余经穴保留国标总数但不填未经逐条核验的精确定位。发现争议将记录并修正。</p></div></div><div class="notice" style="margin-top:24px"><strong>版权：</strong>本站文字与示意图为独立编写的教学材料；引用标准名称、链接与事实信息，不复制第三方完整图谱或受版权保护的插图。</div>`;
}
let content='';
switch(page){case 'home':content=home();break;case 'meridians':content=meridiansIndex();break;case 'meridian':content=meridianPage();break;case 'points':content=pointIndex();break;case 'learn':content=learnIndex();break;case 'lesson':content=lessonPage();break;case 'topics':content=topicsPage();break;case 'sources':content=sourcePage();break;default:content=home();}
document.getElementById('app').innerHTML=layout(content);
const overlay=document.getElementById('search-overlay'),query=document.getElementById('global-query'),results=document.getElementById('global-results');
const openSearch=()=>{overlay.classList.add('open');query.value='';results.innerHTML='<div class="empty">搜索名称、编号、位置或课程</div>';query.focus()};
const closeSearch=()=>{overlay.classList.remove('open');document.getElementById('open-search').focus()};
document.getElementById('open-search').addEventListener('click',openSearch);
document.getElementById('close-search').addEventListener('click',closeSearch);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeSearch()});
document.addEventListener('keydown',e=>{if((e.key==='/'&& !/INPUT|TEXTAREA/.test(document.activeElement.tagName))||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')){e.preventDefault();openSearch()}if(e.key==='Escape'&&overlay.classList.contains('open'))closeSearch()});
query.addEventListener('input',()=>{
const q=query.value.trim().toLowerCase();
if(!q){results.innerHTML='<div class="empty">输入关键词查找经络、穴位和课程</div>';return;}
const matches=[
...points.filter(p=>[p.name,p.code,p.where,p.how,p.tags.join(' ')].join(' ').toLowerCase().includes(q)).map(p=>({title:p.name+' · '+p.code,small:byMeridian[p.meridian]?.name+' · '+p.where.slice(0,32)+'…',href:pointLink(p.code)})),
...meridians.filter(m=>(m.name+m.code+m.path+m.region).toLowerCase().includes(q)).map(m=>({title:m.name,small:'经脉路由 · '+m.path,href:meridianLink(m)})),
...D.lessons.filter(l=>l.slice(1,3).join(' ').toLowerCase().includes(q)).map(l=>({title:l[1],small:'学习课程 · '+l[2],href:link('learn/'+l[0]+'/')}))
].slice(0,20);
results.innerHTML=matches.length?matches.map(x=>`<a class="search-result" href="${x.href}"><span><strong>${htmlEscape(x.title)}</strong><small>${htmlEscape(x.small)}</small></span><span>↗</span></a>`).join(''):'<div class="empty">没有找到内容，试试编码或骨性标志名称</div>';
});
const menu=document.getElementById('menu-toggle'),side=document.getElementById('sidebar'),dim=document.getElementById('mobile-dim');
const closeMenu=()=>{side.classList.remove('open');dim.classList.remove('show')};
menu.addEventListener('click',()=>{side.classList.toggle('open');dim.classList.toggle('show')});
dim.addEventListener('click',closeMenu);
const updateProgressBar=()=>{const total=meridians.length+D.lessons.length;const complete=Object.keys(nowProgress()).filter(k=>nowProgress()[k]).length;document.getElementById('side-progress').style.width=Math.min(100,complete/total*100)+'%'};
updateProgressBar();
document.querySelectorAll('.mark-btn').forEach(button=>button.addEventListener('click',()=>{
const k=button.dataset.progress;progress=nowProgress();progress[k]=!progress[k];try{localStorage.setItem('acu-learning-progress',JSON.stringify(progress))}catch{}
button.textContent=progress[k]?'✓ 已完成 · 点击取消':'标记已学习 ✓';
button.classList.toggle('done',!!progress[k]);updateProgressBar();
}));
const diagram=document.getElementById('meridian-diagram');
if(diagram){diagram.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
diagram.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('selected',b===button));
diagram.querySelector('#diagram-svg').innerHTML=drawBody(diagram.dataset.color,diagram.dataset.code,button.dataset.view);
}))}
const pInput=document.getElementById('point-query'),pMeridian=document.getElementById('point-meridian'),pRegion=document.getElementById('point-region');
if(pInput){
 const params=new URLSearchParams(window.location.search);
 pInput.value=params.get('q')||'';
 const filter=()=>{
 const q=pInput.value.trim().toLowerCase(),m=pMeridian.value,r=pRegion.value;
 const filtered=points.filter(p=>(!m||p.meridian===m)&&(!r||p.region===r)&&(!q||[p.name,p.code,p.where,p.how,p.trad,p.tags.join(' ')].join(' ').toLowerCase().includes(q)));
 document.getElementById('point-count').textContent=filtered.length+' 个结果';
 document.getElementById('filtered-points').innerHTML=filtered.length?pointCards(filtered):'<div class="empty">无匹配穴位，可尝试其他关键词。</div>';
 };
 [pInput,pMeridian,pRegion].forEach(e=>e.addEventListener(e===pInput?'input':'change',filter));filter();
}
if(window.location.hash&&page==='meridian'){
 const el=document.getElementById(window.location.hash.slice(1));if(el){requestAnimationFrame(()=>el.scrollIntoView({block:'start'}))}
}
})();
