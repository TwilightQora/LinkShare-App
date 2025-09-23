// ===== Keys
const K = { links:"devlinks.links", profile:"devlinks.profile", skin:"devlinks.card.skin", theme:"devlinks.theme" };

// ===== Defaults
const DEFAULT_PROFILE = { name:"Your Name", email:"you@example.com", initials:"BR", avatar:null };
const DEFAULT_SKIN = {
  font:"system", barStart:"#059669", barEnd:"#10b981",
  surface:"#ffffff", text:"#0b1b13", muted:"#5b776a", ring:"#34d399",
  radius:22, shadowPct:40, avatarShape:"circle", avatarRing:"ring", linkShape:"pill"
};
const DEFAULT_TEMPLATE_LINKS = [
  { type:"preset", platform:"website",  url:"https://your-site.com" },
  { type:"preset", platform:"github",   url:"https://github.com/your-user" },
  { type:"preset", platform:"linkedin", url:"https://linkedin.com/in/your-profile" },
  { type:"preset", platform:"twitter",  url:"https://x.com/your-handle" }
];

// ===== Redes sociales ampliadas
const PLATFORMS = [
  { key:"website",  label:"Website",  className:"website" },
  { key:"github",   label:"GitHub",   className:"github" },
  { key:"gitlab",   label:"GitLab",   className:"gitlab" },
  { key:"linkedin", label:"LinkedIn", className:"linkedin" },
  { key:"facebook", label:"Facebook", className:"facebook" },
  { key:"twitter",  label:"X / Twitter", className:"twitter" },
  { key:"threads",  label:"Threads",  className:"threads" },
  { key:"instagram",label:"Instagram",className:"instagram" },
  { key:"tiktok",   label:"TikTok",   className:"tiktok" },
  { key:"youtube",  label:"YouTube",  className:"youtube" },
  { key:"twitch",   label:"Twitch",   className:"twitch" },
  { key:"discord",  label:"Discord",  className:"discord" },
  { key:"whatsapp", label:"WhatsApp", className:"whatsapp" },
  { key:"telegram", label:"Telegram", className:"telegram" },
  { key:"snapchat", label:"Snapchat", className:"snapchat" },
  { key:"pinterest",label:"Pinterest",className:"pinterest" },
  { key:"dribbble", label:"Dribbble", className:"dribbble" },
  { key:"behance",  label:"Behance",  className:"behance" },
  { key:"medium",   label:"Medium",   className:"medium" },
  { key:"reddit",   label:"Reddit",   className:"reddit" },
  { key:"stackoverflow", label:"Stack Overflow", className:"stackoverflow" },
  { key:"codepen",  label:"CodePen",  className:"codepen" },
  { key:"devto",    label:"dev.to",   className:"devto" },
  { key:"kaggle",   label:"Kaggle",   className:"kaggle" },
  { key:"spotify",  label:"Spotify",  className:"spotify" },
  { key:"applemusic", label:"Apple Music", className:"applemusic" },
  { key:"soundcloud", label:"SoundCloud", className:"soundcloud" },
  { key:"steam",    label:"Steam",    className:"steam" },
  { key:"itch",     label:"Itch.io",  className:"itch" },
  { key:"patreon",  label:"Patreon",  className:"patreon" },
  { key:"buymeacoffee",label:"Buy Me a Coffee", className:"buymeacoffee" },
  { key:"paypal",   label:"PayPal",   className:"paypal" },
  { key:"calendly", label:"Calendly", className:"calendly" }
];

// ===== Simple Icons slug map (para cargar iconos desde CDN)
const ICON_SLUG = {
  website: null, // usaremos un emoji globito
  github: "github",
  gitlab: "gitlab",
  linkedin: "linkedin",
  facebook: "facebook",
  twitter: "x",            // usa el logo 'X'; fallback a 'twitter' si falla
  threads: "threads",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
  twitch: "twitch",
  discord: "discord",
  whatsapp: "whatsapp",
  telegram: "telegram",
  snapchat: "snapchat",
  pinterest: "pinterest",
  dribbble: "dribbble",
  behance: "behance",
  medium: "medium",
  reddit: "reddit",
  stackoverflow: "stackoverflow",
  codepen: "codepen",
  devto: "devdotto",
  kaggle: "kaggle",
  spotify: "spotify",
  applemusic: "applemusic",
  soundcloud: "soundcloud",
  steam: "steam",
  itch: "itchdotio",
  patreon: "patreon",
  buymeacoffee: "buymeacoffee",
  paypal: "paypal",
  calendly: "calendly"
};

// ===== Helpers
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const getJSON=(k,f)=>{try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;}}; // eslint-disable-line
const setJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const copy=(t)=>navigator.clipboard?.writeText(t);
const hexUp = (v)=>String(v||"").toUpperCase();

// ===== State
const state = {
  links:   getJSON(K.links, []),               // mezcla preset y custom
  profile: getJSON(K.profile, {...DEFAULT_PROFILE}),
  skin:    getJSON(K.skin,   {...DEFAULT_SKIN}),
  theme:   getJSON(K.theme,  "light"),
  zoom:    1
};

/* THEME */
function applyTheme(t){
  document.documentElement.setAttribute("data-theme", t);
  $("#themeToggle")?.setAttribute("aria-pressed", t==="dark" ? "true":"false");
}
function initTheme(){
  if(!state.theme){
    state.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light";
  }
  applyTheme(state.theme);
}

/* Topbar elevación on scroll */
(function(){
  const tb = document.getElementById("topbar");
  const setElev = ()=> tb.classList.toggle("elevated", window.scrollY > 6);
  window.addEventListener("scroll", setElev, {passive:true});
  setElev();
})();

/* TOASTS */
function showToast(msg, type="info", life=2800){
  const wrap = $("#toasts");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.style.setProperty("--life", life+"ms");
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.remove(); }, life + 700);
}

/* SKIN -> CSS vars + data attrs */
function applySkin(){
  const el = $("#previewCard"), s = state.skin;
  const fonts = {
    system:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif',
    inter:'"Inter", ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    poppins:'"Poppins", ui-sans-serif, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    merriweather:'"Merriweather", Georgia, "Times New Roman", serif',
    robotomono:'"Roboto Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    nunito:'"Nunito", ui-sans-serif, system-ui',
    lato:'"Lato", ui-sans-serif, system-ui',
    opensans:'"Open Sans", ui-sans-serif, system-ui',
    montserrat:'"Montserrat", ui-sans-serif, system-ui',
    playfair:'"Playfair Display", Georgia, serif',
    worksans:'"Work Sans", ui-sans-serif, system-ui',
    dmsans:'"DM Sans", ui-sans-serif, system-ui',
    sourcesans:'"Source Sans 3", ui-sans-serif, system-ui',
    ibmplex:'"IBM Plex Sans", ui-sans-serif, system-ui',
    spacegrotesk:'"Space Grotesk", ui-sans-serif, system-ui',
    outfit:'"Outfit", ui-sans-serif, system-ui',
    firacode:'"Fira Code", SFMono-Regular, Menlo, Consolas, monospace',
    jetbrains:'"JetBrains Mono", SFMono-Regular, Menlo, Consolas, monospace'
  };
  const pct = Math.max(0, Math.min(100, Number(s.shadowPct)||0));
  const blur = 10 + Math.round(pct*0.5);
  const alpha = 0.08 + pct/100*0.18;
  const shadow = `0 18px ${blur}px rgba(9,20,15,${alpha.toFixed(2)})`;

  el.style.setProperty('--card-font', fonts[s.font]||fonts.system);
  el.style.setProperty('--card-surface', s.surface);
  el.style.setProperty('--card-text', s.text);
  el.style.setProperty('--card-muted', s.muted);
  el.style.setProperty('--card-ring', s.ring);
  el.style.setProperty('--card-bar-start', s.barStart);
  el.style.setProperty('--card-bar-end', s.barEnd);
  el.style.setProperty('--card-radius', s.radius+'px');
  el.style.setProperty('--card-shadow', shadow);

  el.dataset.avatarShape = s.avatarShape || "circle";
  el.dataset.avatarRing  = s.avatarRing  || "ring";
  el.dataset.linkShape   = s.linkShape   || "pill";

  // mirror full
  const full = $("#previewCardFull");
  if(full){
    full.style.setProperty('--card-font', getComputedStyle(el).getPropertyValue('--card-font'));
    full.style.setProperty('--card-surface', s.surface);
    full.style.setProperty('--card-text', s.text);
    full.style.setProperty('--card-muted', s.muted);
    full.style.setProperty('--card-ring', s.ring);
    full.style.setProperty('--card-bar-start', s.barStart);
    full.style.setProperty('--card-bar-end', s.barEnd);
    full.style.setProperty('--card-radius', s.radius+'px');
    full.dataset.avatarShape = s.avatarShape;
    full.dataset.avatarRing  = s.avatarRing;
    full.dataset.linkShape   = s.linkShape;
  }

  applyFontPreview();
  updateColorSwatchUI();
}

/* ===== Icon helpers ===== */
function iconImgForPlatform(key){
  const slug = ICON_SLUG[key];
  if(!slug){
    // Website: usa un emoji globo para que siempre funcione
    return `<span role="img" aria-label="website">🌐</span>`;
  }
  const url = `https://cdn.simpleicons.org/${slug}/ffffff`;
  return `<img alt="" src="${url}" onerror="this.onerror=null;this.src='https://cdn.simpleicons.org/twitter/ffffff'">`;
}

/* PREVIEW */
function buildLinks(container){
  container.innerHTML = "";
  state.links.forEach(item=>{
    if(!item || !item.url) return;

    let label="", className="", iconEl="";

    if(item.type==="preset"){
      const p = PLATFORMS.find(x=>x.key===item.platform);
      if(!p) return;
      label = p.label; className = p.className;
      iconEl = `<span class="icon" aria-hidden="true">${iconImgForPlatform(p.key)}</span>`;
    }else{ // custom
      label = item.name || "Custom";
      className = "";
      if(item.iconType==="emoji" && item.iconEmoji){
        iconEl = `<span class="icon" aria-hidden="true">${item.iconEmoji}</span>`;
      }else if(item.iconType==="upload" && item.iconSrc){
        iconEl = `<span class="icon" aria-hidden="true"><img alt="" src="${item.iconSrc}"></span>`;
      }else{
        iconEl = `<span class="icon" aria-hidden="true">★</span>`;
      }
    }

    const a=document.createElement("a");
    a.className=`btn-link ${className}`.trim();
    a.href=item.url; a.target="_blank"; a.rel="noopener";

    if(item.type==="custom" && item.bg){
      a.style.background = item.bg;
      a.style.color      = item.textColor || "#fff";
    }

    a.innerHTML=`<span class="label" style="display:flex;align-items:center;gap:10px">${iconEl}<span>${label}</span></span><span class="chev">→</span>`;
    container.appendChild(a);
  });
}
function renderPreview(){
  $("#name").textContent  = state.profile.name || DEFAULT_PROFILE.name;
  $("#email").textContent = state.profile.email || DEFAULT_PROFILE.email;
  $("#email").href = `mailto:${state.profile.email || DEFAULT_PROFILE.email}`;
  $("#avatarTxt").textContent = (state.profile.initials || "BR").slice(0,3).toUpperCase();

  const img = $("#avatarImg");
  const wrap = $("#avatar");
  if (state.profile.avatar) { img.src = state.profile.avatar; wrap.classList.add("has-image"); }
  else { img.removeAttribute("src"); wrap.classList.remove("has-image"); }

  buildLinks($("#linksList"));

  // full preview mirrors
  $("#nameFull").textContent = $("#name").textContent;
  $("#emailFull").textContent = $("#email").textContent;
  $("#emailFull").href = $("#email").href;
  $("#avatarTxtFull").textContent = $("#avatarTxt").textContent;
  const imgFull = $("#avatarImgFull");
  if (state.profile.avatar) { imgFull.src = state.profile.avatar; $("#previewCardFull .avatar").classList.add("has-image"); }
  else { imgFull.removeAttribute("src"); $("#previewCardFull .avatar").classList.remove("has-image"); }
  buildLinks($("#linksListFull"));
}

/* FORMS (unificada) */
function renderForm(){
  const root=$("#linksFormList"); root.innerHTML="";
  state.links.forEach((item,idx)=>{
    const box=document.createElement("div");
    box.className="link-item"; box.dataset.index=idx;

    if(item.type==="custom"){
      box.innerHTML=`
        <div class="link-item-head">
          <span>Custom link #${idx+1}</span>
          <button type="button" class="remove-btn">Remove</button>
        </div>
        <div class="row">
          <label class="field" style="min-width:180px">
            <span class="field-label">Name</span>
            <input type="text" class="inp-name" placeholder="My site" value="${item.name||""}">
          </label>
          <label class="field" style="min-width:220px">
            <span class="field-label">URL</span>
            <input type="url" class="inp-url" placeholder="https://..." value="${item.url||""}">
          </label>
        </div>
        <div class="row" style="display:flex; gap:10px; flex-wrap:wrap; align-items:flex-end">
          <label class="field" style="min-width:180px">
            <span class="field-label">Icon type</span>
            <select class="sel-icon-type">
              <option value="emoji" ${item.iconType==="emoji"?"selected":""}>Emoji</option>
              <option value="upload" ${item.iconType==="upload"?"selected":""}>Upload image</option>
              <option value="none" ${item.iconType==="none"?"selected":""}>None</option>
            </select>
          </label>
          <label class="field emoji-field" style="${item.iconType==="emoji"?"":"display:none"}">
            <span class="field-label">Emoji</span>
            <input type="text" maxlength="2" class="inp-emoji" placeholder="⭐" value="${item.iconEmoji||""}">
          </label>
          <label class="field upload-field" style="${item.iconType==="upload"?"":"display:none"}">
            <span class="field-label">Icon image</span>
            <input type="file" accept="image/*" class="inp-icon-file">
          </label>
          <label class="field">
            <span class="field-label">Background</span>
            <input type="color" class="inp-bg" value="${item.bg||"#0f172a"}">
          </label>
          <label class="field">
            <span class="field-label">Text color</span>
            <input type="color" class="inp-tx" value="${item.textColor||"#ffffff"}">
          </label>
        </div>
      `;
    }else{
      box.innerHTML=`
        <div class="link-item-head">
          <span>Link #${idx+1}</span>
          <button type="button" class="remove-btn">Remove</button>
        </div>
        <div class="row">
          <label class="field" style="min-width:180px">
            <span class="field-label">Platform</span>
            <select class="sel-platform">
              ${PLATFORMS.map(p=>`<option value="${p.key}" ${p.key===item.platform?'selected':''}>${p.label}</option>`).join("")}
            </select>
          </label>
          <label class="field" style="min-width:220px">
            <span class="field-label">URL</span>
            <input type="url" class="inp-url" placeholder="https://..." value="${item.url||''}">
          </label>
        </div>
      `;
    }

    root.appendChild(box);
  });
}

/* =================== PHOTO CROPPER =================== */
const crop = { img:null, natural:{w:0,h:0}, baseFit:1, scale:1, rotate:0, tx:0, ty:0, dragging:false, start:{x:0,y:0}, stageSize:320, minCoverScale:1 };
function computeMinCoverScale(){
  const L=crop.stageSize, w0=crop.natural.w*crop.baseFit, h0=crop.natural.h*crop.baseFit;
  const rad=Math.abs(crop.rotate)*Math.PI/180, c=Math.abs(Math.cos(rad)), s=Math.abs(Math.sin(rad));
  const wRot=w0*c+h0*s, hRot=w0*s+h0*c; crop.minCoverScale=Math.max(L/wRot, L/hRot, 1);
}
function clampPan(){
  const L=crop.stageSize, w0=crop.natural.w*crop.baseFit*crop.scale, h0=crop.natural.h*crop.baseFit*crop.scale;
  const rad=Math.abs(crop.rotate)*Math.PI/180, c=Math.abs(Math.cos(rad)), s=Math.abs(Math.sin(rad));
  const halfW=(w0*c+h0*s)/2, halfH=(w0*s+h0*c)/2;
  const maxTx=Math.max(0, halfW-L/2), maxTy=Math.max(0, halfH-L/2);
  crop.tx=Math.max(-maxTx, Math.min(maxTx, crop.tx));
  crop.ty=Math.max(-maxTy, Math.min(maxTy, crop.ty));
}
function openCropper(src){
  const modal=$("#photoModal"), stage=$("#cropStage"), img=$("#cropImg");
  modal.classList.remove("hidden"); modal.setAttribute("aria-hidden","false");
  crop.img=new Image();
  crop.img.onload=()=>{
    crop.natural.w=crop.img.naturalWidth; crop.natural.h=crop.img.naturalHeight;
    const r=stage.getBoundingClientRect(); crop.stageSize=Math.min(r.width,r.height);
    crop.baseFit=crop.stageSize/Math.min(crop.natural.w,crop.natural.h);
    crop.scale=1; crop.rotate=0; crop.tx=0; crop.ty=0;
    img.src=src; img.style.width=(crop.natural.w*crop.baseFit)+"px"; img.style.height=(crop.natural.h*crop.baseFit)+"px"; img.style.left="50%"; img.style.top="50%";
    computeMinCoverScale(); crop.scale=Math.max(crop.scale,crop.minCoverScale);
    $("#zoomRange").value=Number(crop.scale.toFixed(2)); $("#rotateRange").value=0;
    clampPan(); applyCropTransform();
  };
  crop.img.src=src;
}
function applyCropTransform(){
  $("#cropImg").style.transform=`translate(calc(-50% + ${crop.tx}px), calc(-50% + ${crop.ty}px)) rotate(${crop.rotate}deg) scale(${crop.scale})`;
}
function exportCropped(size=512){
  const canvas=document.createElement("canvas"); canvas.width=canvas.height=size;
  const ctx=canvas.getContext("2d"); ctx.clearRect(0,0,size,size); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality="high";
  const ratio=size/crop.stageSize;
  ctx.translate(size/2 + crop.tx*ratio, size/2 + crop.ty*ratio);
  ctx.rotate(crop.rotate*Math.PI/180);
  const totalScale=crop.baseFit*crop.scale*ratio; ctx.scale(totalScale,totalScale);
  ctx.drawImage(crop.img, -crop.natural.w/2, -crop.natural.h/2);
  return canvas.toDataURL("image/png");
}

/* FONT PREVIEW — el select enseña la fuente */
function applyFontPreview(){
  const select = $("#fontSelect");
  const map = {
    system:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif',
    inter:'"Inter"', poppins:'"Poppins"', merriweather:'"Merriweather", Georgia, serif',
    robotomono:'"Roboto Mono", monospace', nunito:'"Nunito"', lato:'"Lato"',
    opensans:'"Open Sans"', montserrat:'"Montserrat"', playfair:'"Playfair Display", Georgia, serif',
    worksans:'"Work Sans"', dmsans:'"DM Sans"', sourcesans:'"Source Sans 3"',
    ibmplex:'"IBM Plex Sans"', spacegrotesk:'"Space Grotesk"', outfit:'"Outfit"',
    firacode:'"Fira Code", monospace', jetbrains:'"JetBrains Mono", monospace'
  };
  if(select){
    select.style.fontFamily = map[state.skin.font] || map.system;
    Array.from(select.options).forEach(opt=>{ opt.style.fontFamily = map[opt.value] || map.system; });
  }
}

/* AVATAR SHAPE PICKER */
function renderShapePicker(){
  const host=$("#avatarShapePicker"); if(!host) return;
  host.innerHTML="";
  ["circle","rounded","squircle","hex","diamond"].forEach(shape=>{
    const btn=document.createElement("button");
    btn.type="button"; btn.className="shape-opt"; btn.dataset.shape=shape; btn.title=shape;
    btn.innerHTML=`<div class="mini"></div><div style="font-size:11px;margin-top:6px;text-transform:capitalize;color:var(--muted);text-align:center">${shape}</div>`;
    if(state.skin.avatarShape===shape) btn.classList.add("active");
    btn.addEventListener("click", ()=>{
      $$(".shape-opt", host).forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      state.skin.avatarShape = shape;
      $("#previewCard").dataset.avatarShape = shape;
      $("#previewCardFull").dataset.avatarShape = shape;
    });
    host.appendChild(btn);
  });
}

/* ======== Color swatches ======== */
const COLOR_FIELDS = [
  { key:"barStart", label:"Topbar start" },
  { key:"barEnd",   label:"Topbar end" },
  { key:"surface",  label:"Surface" },
  { key:"text",     label:"Text" },
  { key:"muted",    label:"Muted" },
  { key:"ring",     label:"Ring" },
];

function renderColorSwatches(){
  const grid = $("#colorSwatchGrid"); if(!grid) return;
  grid.innerHTML = "";

  // Preview gradiente
  const grad = document.createElement("div");
  grad.className = "color-field";
  grad.innerHTML = `
    <div class="swatch" data-key="barPreview" style="--card-bar-start:${state.skin.barStart};--card-bar-end:${state.skin.barEnd}"></div>
    <div class="meta">
      <div class="label">Topbar (preview)</div>
      <div class="value">Start ${hexUp(state.skin.barStart)} → End ${hexUp(state.skin.barEnd)}</div>
    </div>`;
  grid.appendChild(grad);

  // Campos
  COLOR_FIELDS.forEach(({key,label})=>{
    const field = document.createElement("div");
    field.className = "color-field";
    field.innerHTML = `
      <button type="button" class="swatch" data-key="${key}" aria-label="Pick ${label}" title="${label}"></button>
      <div class="meta">
        <div class="label">${label}</div>
        <div class="value" id="val-${key}"></div>
      </div>
      <input type="color" class="hidden-color" id="picker-${key}" style="position:absolute;opacity:0;pointer-events:none;width:0;height:0" />
    `;
    grid.appendChild(field);
  });

  updateColorSwatchUI();

  // Eventos
  COLOR_FIELDS.forEach(({key})=>{
    const sw = $(`.swatch[data-key="${key}"]`);
    const inp = $(`#picker-${key}`);
    sw.addEventListener("click", ()=>{
      inp.value = state.skin[key];
      inp.click();
      $$(".swatch").forEach(x=>x.classList.remove("selected"));
      sw.classList.add("selected");
    });
    inp.addEventListener("input", (e)=>{
      state.skin[key] = e.target.value;
      applySkin();
    });
  });
}

function updateColorSwatchUI(){
  COLOR_FIELDS.forEach(({key})=>{
    const v = state.skin[key];
    const sw = $(`.swatch[data-key="${key}"]`);
    const lab = $(`#val-${key}`);
    if(sw) sw.style.background = v;
    if(lab) lab.textContent = hexUp(v);
  });
  const grad = $(`.swatch[data-key="barPreview"]`);
  const gradMeta = grad?.parentElement?.querySelector(".value");
  if(grad){
    grad.style.setProperty("--card-bar-start", state.skin.barStart);
    grad.style.setProperty("--card-bar-end", state.skin.barEnd);
  }
  if(gradMeta){
    gradMeta.textContent = `Start ${hexUp(state.skin.barStart)} → End ${hexUp(state.skin.barEnd)}`;
  }
}

/* PUBLISH — build encoded link to viewer.html */
function buildPublishLink(){
  const snapshot = { profile: state.profile, links: state.links, skin: state.skin };
  const json = JSON.stringify(snapshot);
  const data = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  const url = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}viewer.html?data=${data}`;
  return url;
}

/* =================== EVENTS =================== */
function wire(){
  // tabs
  $$(".tab").forEach(t=>{
    t.addEventListener("click",e=>{
      e.preventDefault();
      $$(".tab").forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
      $("#linksEditor").style.display="none";
      $("#profileDetails").classList.add("hidden");
      $("#appearance").classList.add("hidden");
      $("#publish").classList.add("hidden");
      const tab=t.dataset.tab;
      if(tab==="links") $("#linksEditor").style.display="";
      if(tab==="profile") $("#profileDetails").classList.remove("hidden");
      if(tab==="appearance") $("#appearance").classList.remove("hidden");
      if(tab==="publish") $("#publish").classList.remove("hidden");
    });
  });

  // full preview
  $("#openFullPreview").addEventListener("click", ()=>{
    const panel = $("#fullPreview");
    panel.classList.remove("hidden","closing");
    renderPreview();
    requestAnimationFrame(()=>panel.classList.add("open"));
  });
  $("#closeFullPreview").addEventListener("click", ()=>{
    const panel = $("#fullPreview");
    panel.classList.remove("open"); panel.classList.add("closing");
    setTimeout(()=>panel.classList.add("hidden"), 600);
  });

  // theme
  $("#themeToggle").addEventListener("click", ()=>{
    state.theme = (state.theme==="dark") ? "light" : "dark";
    applyTheme(state.theme);
  });

  // links: botones internos de Social links
  $("#addPresetLinkBtn").addEventListener("click", ()=>{
    state.links.push({type:"preset", platform:"website", url:""});
    renderForm(); renderPreview();
  });
  $("#addCustomLinkBtn").addEventListener("click", ()=>{
    state.links.push({type:"custom", name:"", url:"", iconType:"emoji", iconEmoji:"⭐", bg:"#0f172a", textColor:"#ffffff"});
    renderForm(); renderPreview();
  });

  // list events
  $("#linksFormList").addEventListener("click", e=>{
    const rm=e.target.closest(".remove-btn"); if(!rm) return;
    const box=e.target.closest(".link-item"); const idx=Number(box.dataset.index);
    state.links.splice(idx,1); renderForm(); renderPreview();
  });
  $("#linksFormList").addEventListener("input", e=>{
    const box=e.target.closest(".link-item"); if(!box) return;
    const idx=Number(box.dataset.index);
    const item = state.links[idx];
    if(item.type==="custom"){
      const typeSel = box.querySelector(".sel-icon-type").value;
      item.name = box.querySelector(".inp-name").value;
      item.url  = box.querySelector(".inp-url").value.trim();
      item.iconType = typeSel;
      const emojiField  = box.querySelector(".emoji-field");
      const uploadField = box.querySelector(".upload-field");
      emojiField.style.display  = typeSel==="emoji" ? "" : "none";
      uploadField.style.display = typeSel==="upload" ? "" : "none";
      const emoji = box.querySelector(".inp-emoji")?.value;
      if(emoji!==undefined) item.iconEmoji = emoji;
      item.bg = box.querySelector(".inp-bg").value;
      item.textColor = box.querySelector(".inp-tx").value;
    }else{
      const plat=box.querySelector(".sel-platform").value;
      const url=box.querySelector(".inp-url").value.trim();
      item.platform = plat; item.url = url;
    }
    renderPreview();
  });
  // file change for custom icon
  $("#linksFormList").addEventListener("change", e=>{
    const fileInp = e.target.closest(".inp-icon-file"); if(!fileInp) return;
    const box=e.target.closest(".link-item"); const idx=Number(box.dataset.index);
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => { state.links[idx].iconSrc = reader.result; renderPreview(); };
    reader.readAsDataURL(file);
  });

  // reset template
  $("#resetTemplateBtn").addEventListener("click", ()=>{
    state.links = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_LINKS));
    state.skin  = {...DEFAULT_SKIN};
    renderForm(); renderPreview(); applySkin(); renderShapePicker(); renderColorSwatches();
    $("#cardSizeRange").value = state.zoom = 1;
    $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);
    showToast("Default template loaded", "info");
  });

  // profile
  $("#inpName").addEventListener("input", e=>{ state.profile.name=e.target.value; renderPreview(); });
  $("#inpEmail").addEventListener("input", e=>{ state.profile.email=e.target.value; renderPreview(); });
  $("#inpInitials").addEventListener("input", e=>{ state.profile.initials=e.target.value.toUpperCase(); renderPreview(); });

  // photo upload/edit
  $("#inpAvatarFile").addEventListener("change", (e)=>{
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader(); reader.onload = () => { openCropper(reader.result); }; reader.readAsDataURL(file);
  });
  $("#btnEditPhoto").addEventListener("click", ()=>{
    const src = state.profile.avatar; if(!src){ showToast("Upload a photo first", "error"); return; }
    openCropper(src);
  });
  $("#btnClearPhoto").addEventListener("click", ()=>{
    state.profile.avatar = null; $("#inpAvatarFile").value = ""; renderPreview();
  });

  // cropper
  const stage=$("#cropStage");
  stage.addEventListener("pointerdown", (e)=>{ crop.dragging=true; crop.start.x=e.clientX; crop.start.y=e.clientY; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener("pointermove", (e)=>{ if(!crop.dragging) return; crop.tx += (e.clientX-crop.start.x); crop.ty += (e.clientY-crop.start.y); crop.start.x=e.clientX; crop.start.y=e.clientY; clampPan(); applyCropTransform(); });
  stage.addEventListener("pointerup", (e)=>{ crop.dragging=false; stage.releasePointerCapture?.(e.pointerId); });
  stage.addEventListener("pointercancel", ()=>{ crop.dragging=false; });
  stage.addEventListener("wheel", (e)=>{ e.preventDefault(); const d=e.deltaY>0?-0.06:0.06; crop.scale=Math.min(3, Math.max(0.5, crop.scale + d)); computeMinCoverScale(); if(crop.scale<crop.minCoverScale) crop.scale=crop.minCoverScale; $("#zoomRange").value=Number(crop.scale.toFixed(2)); clampPan(); applyCropTransform(); }, {passive:false});
  $("#zoomRange").addEventListener("input", e=>{ crop.scale=Number(e.target.value); computeMinCoverScale(); if(crop.scale<crop.minCoverScale){ crop.scale=crop.minCoverScale; e.target.value=crop.scale.toFixed(2);} clampPan(); applyCropTransform(); });
  $("#rotateRange").addEventListener("input", e=>{ crop.rotate=Number(e.target.value); computeMinCoverScale(); if(crop.scale<crop.minCoverScale){ crop.scale=crop.minCoverScale; $("#zoomRange").value=crop.scale.toFixed(2);} clampPan(); applyCropTransform(); });
  $("#applyCropBtn").addEventListener("click", ()=>{ const dataURL=exportCropped(512); state.profile.avatar=dataURL; renderPreview(); closeModal(); showToast("Photo updated","success"); });
  $("#resetCropBtn").addEventListener("click", ()=>{ crop.scale=1; crop.rotate=0; crop.tx=0; crop.ty=0; computeMinCoverScale(); if(crop.scale<crop.minCoverScale) crop.scale=crop.minCoverScale; $("#zoomRange").value=crop.scale.toFixed(2); $("#rotateRange").value=0; clampPan(); applyCropTransform(); });
  $("#closeModalBtn").addEventListener("click", closeModal);
  $(".modal-backdrop").addEventListener("click", closeModal);

  // appearance
  $("#fontSelect").addEventListener("change", e=>{ state.skin.font=e.target.value; applySkin(); });
  $("#rangeRadius").addEventListener("input", e=>{ state.skin.radius=Number(e.target.value); applySkin(); });
  $("#rangeShadow").addEventListener("input", e=>{ state.skin.shadowPct=Number(e.target.value); applySkin(); });
  $("#avatarRingSelect").addEventListener("change", e=>{ state.skin.avatarRing=e.target.value; applySkin(); });
  $("#linkShapeSelect").addEventListener("change", e=>{ state.skin.linkShape=e.target.value; applySkin(); });

  // card size (preview)
  $("#cardSizeRange").addEventListener("input", e=>{
    state.zoom = Number(e.target.value);
    $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);
  });

  // save all
  $("#saveAllBtn").addEventListener("click", ()=>{
    setJSON(K.links, state.links);
    setJSON(K.profile, state.profile);
    setJSON(K.skin, state.skin);
    setJSON(K.theme, state.theme);
    showToast("All changes saved", "success");
  });

  // publish
  $("#btnGenerateLink").addEventListener("click", ()=>{
    const url = buildPublishLink();
    $("#publishUrl").value = url;
    $("#btnCopyLink").disabled = false;
    const a = $("#btnOpenLink");
    a.href = url; a.style.pointerEvents="auto"; a.style.opacity="1";
    showToast("Share link ready", "success");
  });
  $("#btnCopyLink").addEventListener("click", ()=>{
    const url = $("#publishUrl").value; if(!url) return;
    copy(url); showToast("Link copied", "info");
  });
}

/* CLOSE MODAL */
function closeModal(){
  const modal = $("#photoModal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
}

/* BOOT */
(function(){
  initTheme();

  // seed inputs
  $("#inpName").value = state.profile.name;
  $("#inpEmail").value = state.profile.email;
  $("#inpInitials").value = state.profile.initials;

  $("#cardZoomWrap").style.setProperty('--card-scale', state.zoom);

  if(!state.links || !state.links.length){
    state.links = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_LINKS));
  }

  renderShapePicker();
  renderForm();
  renderPreview();
  renderColorSwatches();
  applySkin();
  wire();
})();
