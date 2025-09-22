// Keys
const K = { links:"devlinks.links", profile:"devlinks.profile", skin:"devlinks.card.skin", theme:"devlinks.theme" };

// Defaults
const DEFAULT_PROFILE = { name:"Your Name", email:"you@example.com", initials:"BR", avatar:null };
const DEFAULT_SKIN = {
  font:"system", barStart:"#6d28d9", barEnd:"#8b5cf6",
  surface:"#ffffff", text:"#0f172a", muted:"#64748b", ring:"#8b5cf6",
  radius:22, shadowPct:40, avatarShape:"circle", avatarRing:"ring", linkShape:"pill"
};
const DEFAULT_TEMPLATE_LINKS = [
  { platform:"website",  url:"https://your-site.com" },
  { platform:"github",   url:"https://github.com/your-user" },
  { platform:"linkedin", url:"https://linkedin.com/in/your-profile" },
  { platform:"facebook", url:"https://facebook.com/your-profile" }
];
const PLATFORMS = [
  { key:"website",  label:"Website",  className:"website" },
  { key:"facebook", label:"Facebook", className:"facebook" },
  { key:"github",   label:"Github",   className:"github" },
  { key:"linkedin", label:"LinkedIn", className:"linkedin" },
];

// Helpers
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const getJSON=(k,f)=>{try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;}};
const setJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const copy=(t)=>navigator.clipboard?.writeText(t);

// State
const state = {
  links:   getJSON(K.links, []),
  profile: getJSON(K.profile, {...DEFAULT_PROFILE}),
  skin:    getJSON(K.skin,   {...DEFAULT_SKIN}),
  theme:   getJSON(K.theme,  "light")
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
    inter:'"Inter"',
    poppins:'"Poppins"',
    merriweather:'"Merriweather", Georgia, serif',
    robotomono:'"Roboto Mono", monospace',
    nunito:'"Nunito"', lato:'"Lato"', opensans:'"Open Sans"',
    montserrat:'"Montserrat"', playfair:'"Playfair Display", Georgia, serif',
    worksans:'"Work Sans"', dmsans:'"DM Sans"', sourcesans:'"Source Sans 3"',
    ibmplex:'"IBM Plex Sans"', spacegrotesk:'"Space Grotesk"', outfit:'"Outfit"',
    firacode:'"Fira Code", monospace', jetbrains:'"JetBrains Mono", monospace'
  };
  const pct = Math.max(0, Math.min(100, Number(s.shadowPct)||0));
  const blur = 10 + Math.round(pct*0.5);
  const alpha = 0.08 + pct/100*0.18;
  const shadow = `0 18px ${blur}px rgba(15,23,42,${alpha.toFixed(2)})`;

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

  // reflect inputs
  $("#fontSelect").value = s.font;
  $("#colorBarStart").value = s.barStart;
  $("#colorBarEnd").value   = s.barEnd;
  $("#colorSurface").value  = s.surface;
  $("#colorText").value     = s.text;
  $("#colorMuted").value    = s.muted;
  $("#colorRing").value     = s.ring;
  $("#rangeRadius").value   = s.radius;
  $("#rangeShadow").value   = s.shadowPct;
  $("#avatarRingSelect").value  = s.avatarRing;
  $("#linkShapeSelect").value   = s.linkShape;

  applyFontPreview();
}

/* PREVIEW */
function buildLinks(container){
  container.innerHTML = "";
  state.links.forEach(item=>{
    const p = PLATFORMS.find(x=>x.key===item.platform);
    if(!p || !item.url) return;
    const a=document.createElement("a");
    a.className=`btn-link ${p.className}`;
    a.href=item.url; a.target="_blank"; a.rel="noopener";
    a.innerHTML=`<span class="label">${p.label}</span><span class="chev">→</span>`;
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

  // sync styles to full card
  const s = state.skin;
  const full = $("#previewCardFull");
  full.style.setProperty('--card-font', getComputedStyle($("#previewCard")).getPropertyValue('--card-font'));
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

/* FORMS */
function renderForm(){
  const root=$("#linksFormList"); root.innerHTML="";
  state.links.forEach((item,idx)=>{
    const box=document.createElement("div");
    box.className="link-item"; box.dataset.index=idx;
    box.innerHTML=`
      <div class="link-item-head">
        <span>Link #${idx+1}</span>
        <button type="button" class="remove-btn">Remove</button>
      </div>
      <div class="row">
        <label class="field">
          <span class="field-label">Platform</span>
          <select class="sel-platform">
            ${PLATFORMS.map(p=>`<option value="${p.key}" ${p.key===item.platform?'selected':''}>${p.label}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span class="field-label">URL</span>
          <input type="url" class="inp-url" placeholder="https://..." value="${item.url||''}">
        </label>
      </div>
    `;
    root.appendChild(box);
  });
}

/* PHOTO CROPPER */
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

/* FONT PREVIEW — show sample in select */
function applyFontPreview(){
  const select = $("#fontSelect");
  const map = {
    system:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Inter, Arial, sans-serif',
    inter:'"Inter"', poppins:'"Poppins"', merriweather:'"Merriweather", serif',
    robotomono:'"Roboto Mono", monospace', nunito:'"Nunito"', lato:'"Lato"',
    opensans:'"Open Sans"', montserrat:'"Montserrat"', playfair:'"Playfair Display", serif',
    worksans:'"Work Sans"', dmsans:'"DM Sans"', sourcesans:'"Source Sans 3"',
    ibmplex:'"IBM Plex Sans"', spacegrotesk:'"Space Grotesk"', outfit:'"Outfit"',
    firacode:'"Fira Code", monospace', jetbrains:'"JetBrains Mono", monospace'
  };
  select.style.fontFamily = map[state.skin.font] || map.system;
  Array.from(select.options).forEach(opt=>{
    opt.style.fontFamily = map[opt.value] || map.system;
  });
}

/* AVATAR SHAPE PICKER */
function renderShapePicker(){
  const host=$("#avatarShapePicker"); host.innerHTML="";
  ["circle","rounded","squircle","hex","diamond"].forEach(shape=>{
    const btn=document.createElement("button");
    btn.type="button"; btn.className="shape-opt"; btn.dataset.shape=shape;
    btn.innerHTML=`<div class="mini"></div><div style="font-size:11px;margin-top:6px;text-transform:capitalize;color:var(--muted)">${shape}</div>`;
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

/* PUBLISH — build encoded link to viewer.html */
function buildPublishLink(){
  const snapshot = { profile: state.profile, links: state.links, skin: state.skin };
  const json = JSON.stringify(snapshot);
  const data = encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
  const url = `${location.origin}${location.pathname.replace(/[^/]+$/, '')}viewer.html?data=${data}`;
  return url;
}

/* EVENTS */
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

  // preview panel (book-like flip)
  $("#previewBtn").addEventListener("click", ()=>{
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

  // theme toggle
  $("#themeToggle").addEventListener("click", ()=>{
    state.theme = (state.theme==="dark") ? "light" : "dark";
    applyTheme(state.theme);
  });

  // add new link
  $("#addLinkBtn").addEventListener("click", ()=>{
    state.links.push({platform:"website", url:""});
    renderForm(); renderPreview();
  });

  // remove / update links
  $("#linksFormList").addEventListener("click", e=>{
    const rm=e.target.closest(".remove-btn"); if(!rm) return;
    const box=e.target.closest(".link-item"); const idx=Number(box.dataset.index);
    state.links.splice(idx,1); renderForm(); renderPreview();
  });
  $("#linksFormList").addEventListener("input", e=>{
    const box=e.target.closest(".link-item"); if(!box) return;
    const idx=Number(box.dataset.index);
    const plat=box.querySelector(".sel-platform").value;
    const url=box.querySelector(".inp-url").value.trim();
    state.links[idx]={platform:plat,url}; renderPreview();
  });

  // reset template
  $("#resetTemplateBtn").addEventListener("click", ()=>{
    state.links = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE_LINKS));
    state.skin  = {...DEFAULT_SKIN};
    renderForm(); renderPreview(); applySkin(); renderShapePicker();
    showToast("Default template loaded", "info");
  });

  // profile fields
  $("#inpName").addEventListener("input", e=>{ state.profile.name=e.target.value; renderPreview(); });
  $("#inpEmail").addEventListener("input", e=>{ state.profile.email=e.target.value; renderPreview(); });
  $("#inpInitials").addEventListener("input", e=>{ state.profile.initials=e.target.value.toUpperCase(); renderPreview(); });

  // avatar upload/edit
  $("#inpAvatarFile").addEventListener("change", e=>{
    const file=e.target.files && e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>openCropper(reader.result);
    reader.readAsDataURL(file);
  });
  $("#btnEditPhoto").addEventListener("click", ()=>{
    if(!state.profile.avatar){ showToast("Upload a photo first","error"); return; }
    openCropper(state.profile.avatar);
  });
  $("#btnClearPhoto").addEventListener("click", ()=>{
    state.profile.avatar=null;
    $("#inpAvatarFile").value="";
    renderPreview();
  });

  // cropper dragging + zoom
  const stage=$("#cropStage");
  stage.addEventListener("pointerdown", e=>{
    crop.dragging=true; crop.start.x=e.clientX; crop.start.y=e.clientY;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener("pointermove", e=>{
    if(!crop.dragging) return;
    crop.tx+=(e.clientX-crop.start.x);
    crop.ty+=(e.clientY-crop.start.y);
    crop.start.x=e.clientX; crop.start.y=e.clientY;
    clampPan(); applyCropTransform();
  });
  stage.addEventListener("pointerup", e=>{ crop.dragging=false; stage.releasePointerCapture?.(e.pointerId); });
  stage.addEventListener("pointercancel", ()=>{ crop.dragging=false; });
  stage.addEventListener("wheel", e=>{
    e.preventDefault();
    crop.scale=Math.min(3,Math.max(0.5,crop.scale+(e.deltaY>0?-0.06:0.06)));
    computeMinCoverScale();
    if(crop.scale<crop.minCoverScale) crop.scale=crop.minCoverScale;
    $("#zoomRange").value=Number(crop.scale.toFixed(2));
    clampPan(); applyCropTransform();
  }, {passive:false});

  $("#zoomRange").addEventListener("input", e=>{
    crop.scale=Number(e.target.value); computeMinCoverScale();
    if(crop.scale<crop.minCoverScale){
      crop.scale=crop.minCoverScale; e.target.value=crop.scale.toFixed(2);
    }
    clampPan(); applyCropTransform();
  });
  $("#rotateRange").addEventListener("input", e=>{
    crop.rotate=Number(e.target.value); computeMinCoverScale();
    if(crop.scale<crop.minCoverScale){
      crop.scale=crop.minCoverScale;
      $("#zoomRange").value=crop.scale.toFixed(2);
    }
    clampPan(); applyCropTransform();
  });

  $("#applyCropBtn").addEventListener("click", ()=>{
    state.profile.avatar=exportCropped(512);
    renderPreview(); closeModal();
    showToast("Photo updated","success");
  });
  $("#resetCropBtn").addEventListener("click", ()=>{
    crop.scale=1; crop.rotate=0; crop.tx=0; crop.ty=0;
    computeMinCoverScale();
    if(crop.scale<crop.minCoverScale) crop.scale=crop.minCoverScale;
    $("#zoomRange").value=crop.scale.toFixed(2);
    $("#rotateRange").value=0;
    clampPan(); applyCropTransform();
  });
  $("#closeModalBtn").addEventListener("click", closeModal);
  $(".modal-backdrop").addEventListener("click", closeModal);

  // appearance live
  $("#fontSelect").addEventListener("change", e=>{
    state.skin.font=e.target.value; applySkin(); renderPreview();
  });
  $("#colorBarStart").addEventListener("input", e=>{
    state.skin.barStart=e.target.value; applySkin(); renderPreview();
  });
  $("#colorBarEnd").addEventListener("input", e=>{
    state.skin.barEnd=e.target.value; applySkin(); renderPreview();
  });
  $("#colorSurface").addEventListener("input", e=>{
    state.skin.surface=e.target.value; applySkin(); renderPreview();
  });
  $("#colorText").addEventListener("input", e=>{
    state.skin.text=e.target.value; applySkin(); renderPreview();
  });
  $("#colorMuted").addEventListener("input", e=>{
    state.skin.muted=e.target.value; applySkin(); renderPreview();
  });
  $("#colorRing").addEventListener("input", e=>{
    state.skin.ring=e.target.value; applySkin(); renderPreview();
  });
  $("#rangeRadius").addEventListener("input", e=>{
    state.skin.radius=Number(e.target.value); applySkin(); renderPreview();
  });
  $("#rangeShadow").addEventListener("input", e=>{
    state.skin.shadowPct=Number(e.target.value); applySkin();
  });
  $("#avatarRingSelect").addEventListener("change", e=>{
    state.skin.avatarRing=e.target.value; applySkin(); renderPreview();
  });
  $("#linkShapeSelect").addEventListener("change", e=>{
    state.skin.linkShape=e.target.value; applySkin(); renderPreview();
  });

  // avatar shape previews
  renderShapePicker();

  // publish section
  const copyBtn=$("#copyPublishLink");
  if(copyBtn){
    copyBtn.addEventListener("click", async ()=>{
      try{
        await copy(buildPublishLink());
        showToast("Link copied","success");
      }catch{ showToast("Could not copy","error"); }
    });
  }
  const openBtn=$("#openPublishLink");
  if(openBtn){
    openBtn.addEventListener("click", ()=>window.open(buildPublishLink(),"_blank","noopener"));
  }

  // save all
  $("#saveAllBtn").addEventListener("click", ()=>{
    setJSON(K.links,state.links);
    setJSON(K.profile,state.profile);
    setJSON(K.skin,state.skin);
    setJSON(K.theme,state.theme);
    showToast("All changes saved","success");
  });
}

/* CLOSE MODAL */
function closeModal(){
  const modal=$("#photoModal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden","true");
}

/* BOOT */
(function(){
  initTheme();
  $("#inpName").value=state.profile.name||"";
  $("#inpEmail").value=state.profile.email||"";
  $("#inpInitials").value=state.profile.initials||"";

  // appearance seed
  $("#fontSelect").value=state.skin.font;
  $("#colorBarStart").value=state.skin.barStart;
  $("#colorBarEnd").value=state.skin.barEnd;
  $("#colorSurface").value=state.skin.surface;
  $("#colorText").value=state.skin.text;
  $("#colorMuted").value=state.skin.muted;
  $("#colorRing").value=state.skin.ring;
  $("#rangeRadius").value=state.skin.radius;
  $("#rangeShadow").value=state.skin.shadowPct;
  $("#avatarRingSelect").value=state.skin.avatarRing;
  $("#linkShapeSelect").value=state.skin.linkShape;

  renderForm();
  renderPreview();
  applySkin();
  renderShapePicker();
  wire();

  if($("#publishLink")) $("#publishLink").value=buildPublishLink();
})();
