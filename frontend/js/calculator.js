/* EVE PI Template Calculator - Main Script */
'use strict';

/* ================= Data Constants ================= */
const CCU_BUDGET = [
  {cpu:1675,  pg:6000 },
  {cpu:7057,  pg:9000 },
  {cpu:12136, pg:12000},
  {cpu:17215, pg:15000},
  {cpu:21315, pg:17000},
  {cpu:25415, pg:19000},
];

const STRUCT = {
  basic:    {cpu:200,  pg:800,  name:'Basic Facility (P1)'},
  advanced: {cpu:500,  pg:700,  name:'Advanced Facility (P2/P3)'},
  hightech: {cpu:1100, pg:400,  name:'High-Tech Plant (P4)'},
  ecu:      {cpu:400,  pg:2600, name:'Extractor (ECU)'},
  head:     {cpu:110,  pg:550,  name:'Extractor Head'},
  storage:  {cpu:500,  pg:700,  name:'Storage'},
  launchpad:{cpu:3600, pg:700,  name:'Launchpad'},
};

const UPGRADE_OLD = [
  {cap:250,   cpu:0,   pg:0  },
  {cap:500,   cpu:165, pg:98 },
  {cap:1000,  cpu:366, pg:206},
  {cap:2000,  cpu:598, pg:322},
  {cap:4000,  cpu:853, pg:443},
  {cap:8000,  cpu:1130,pg:570},
  {cap:16000, cpu:1427,pg:701},
  {cap:32000, cpu:1740,pg:836},
  {cap:64000, cpu:2070,pg:974},
  {cap:128000,cpu:2415,pg:1115},
  {cap:256000,cpu:2774,pg:1259},
];

const NEW_CAPS = [1250, 2500, 5000, 10000, 20000, 40000];

function buildNewLevels(mapMode){
  return NEW_CAPS.map(c=>{
    let pick=UPGRADE_OLD[0];
    for(const o of UPGRADE_OLD){
      if(mapMode==='floor'){ if(o.cap<=c) pick=o; else break; }
      else { if(o.cap>=c){ pick=o; break; } }
    }
    return {cap:c, cpu:pick.cpu, pg:pick.pg};
  });
}

function getVersion(){
  const ver = $id('linkVer').value;
  if(ver==='old') return {id:'old', label:'Legacy (2022)', levels:UPGRADE_OLD};
  const mm = $id('mapMode').value;
  return {id:'new', label:'New (2026)', levels:buildNewLevels(mm)};
}

const TIERS = {
  P1P2:{fact:'advanced', in:1920, out:120, inV:'vP1', outV:'vP2', label:'P1→P2', note:'2×40 P1/h → 5 P2/h'},
  P2P3:{fact:'advanced', in:720, out:72, inV:'vP2', outV:'vP3', label:'P2→P3', note:'30 P2/h → 3 P3/h'},
  P3P4:{fact:'hightech', in:432, out:24, inV:'vP3', outV:'vP4', label:'P3→P4', note:'18 P3/h → 1 P4/h'},
};

const MINING_IN=144000, MINING_OUT=960;

const PLANETS={
  11:{name:'Temperate', basic:2481, adv:0, ht:0, ecu:3068, stor:2562, lp:2256},
  12:{name:'Ice', basic:2493, adv:0, ht:0, ecu:3061, stor:2257, lp:2552},
  13:{name:'Gas', basic:2492, adv:0, ht:0, ecu:3060, stor:2536, lp:2543},
  2014:{name:'Oceanic', basic:2490, adv:0, ht:0, ecu:3063, stor:2535, lp:2542},
  2015:{name:'Lava', basic:2469, adv:0, ht:0, ecu:3062, stor:2558, lp:2555},
  2016:{name:'Barren', basic:2473, adv:2474, ht:2475, ecu:2848, stor:2541, lp:2544},
  2017:{name:'Storm', basic:2483, adv:0, ht:0, ecu:3067, stor:2561, lp:2557},
  2063:{name:'Plasma', basic:2471, adv:0, ht:0, ecu:3064, stor:2560, lp:2556},
};

const MINING_RES=[
  {p0:2073,p0n:'Micro Organisms',p1:2393,p1n:'Bacteria'},
  {p0:2267,p0n:'Base Metals',p1:2398,p1n:'Reactive Metals'},
  {p0:2268,p0n:'Aqueous Liquids',p1:3645,p1n:'Water'},
  {p0:2270,p0n:'Precious Metals',p1:2399,p1n:'Precious Metals'},
  {p0:2272,p0n:'Heavy Metals',p1:2400,p1n:'Toxic Metals'},
  {p0:2286,p0n:'Planktic Colonies',p1:3779,p1n:'Biomass'},
  {p0:2287,p0n:'Complex Organisms',p1:2395,p1n:'Proteins'},
  {p0:2288,p0n:'Carbon Compounds',p1:2396,p1n:'Biofuels'},
  {p0:2305,p0n:'Autotrophs',p1:2397,p1n:'Industrial Fibers'},
  {p0:2306,p0n:'Non-CS Crystals',p1:2401,p1n:'Chiral Structures'},
  {p0:2307,p0n:'Felsic Magma',p1:9828,p1n:'Silicon'},
  {p0:2308,p0n:'Suspended Plasma',p1:2389,p1n:'Plasmoids'},
  {p0:2309,p0n:'Ionic Solutions',p1:2390,p1n:'Electrolytes'},
  {p0:2310,p0n:'Noble Gas',p1:3683,p1n:'Oxygen'},
  {p0:2311,p0n:'Reactive Gas',p1:2392,p1n:'Oxidizing Compound'},
];

const PRODUCTS=[
  {id:44, name:'Enriched Uranium', tier:'P1P2', outQ:5, in:[[2399,40],[2400,40]]},
  {id:2312, name:'Supertensile Plastics', tier:'P1P2', outQ:5, in:[[3683,40],[3779,40]]},
  {id:2317, name:'Oxides', tier:'P1P2', outQ:5, in:[[2392,40],[3683,40]]},
  {id:2319, name:'Test Cultures', tier:'P1P2', outQ:5, in:[[2393,40],[3645,40]]},
  {id:2321, name:'Polyaramids', tier:'P1P2', outQ:5, in:[[2397,40],[2392,40]]},
  {id:2327, name:'Microfiber Shielding', tier:'P1P2', outQ:5, in:[[2397,40],[9828,40]]},
  {id:2328, name:'Water-Cooled CPU', tier:'P1P2', outQ:5, in:[[3645,40],[2398,40]]},
  {id:2329, name:'Biocells', tier:'P1P2', outQ:5, in:[[2399,40],[2396,40]]},
  {id:2463, name:'Nanites', tier:'P1P2', outQ:5, in:[[2393,40],[2398,40]]},
  {id:3689, name:'Mechanical Parts', tier:'P1P2', outQ:5, in:[[2399,40],[2398,40]]},
  {id:3691, name:'Synthetic Oil', tier:'P1P2', outQ:5, in:[[2390,40],[3683,40]]},
  {id:3693, name:'Fertilizer', tier:'P1P2', outQ:5, in:[[2393,40],[2395,40]]},
  {id:3695, name:'Polytextiles', tier:'P1P2', outQ:5, in:[[2397,40],[2396,40]]},
  {id:3697, name:'Silicate Glass', tier:'P1P2', outQ:5, in:[[2392,40],[9828,40]]},
  {id:3725, name:'Livestock', tier:'P1P2', outQ:5, in:[[2396,40],[2395,40]]},
  {id:3775, name:'Pathogen', tier:'P1P2', outQ:5, in:[[2393,40],[3779,40]]},
  {id:3828, name:'Construction Blocks', tier:'P1P2', outQ:5, in:[[2400,40],[2398,40]]},
  {id:9830, name:'Rocket Fuel', tier:'P1P2', outQ:5, in:[[2390,40],[2389,40]]},
  {id:9832, name:'Coolant', tier:'P1P2', outQ:5, in:[[2390,40],[3645,40]]},
  {id:9836, name:'Consumer Electronics', tier:'P1P2', outQ:5, in:[[2401,40],[2400,40]]},
  {id:9838, name:'Superconductors', tier:'P1P2', outQ:5, in:[[3645,40],[2389,40]]},
  {id:9840, name:'Transmitter', tier:'P1P2', outQ:5, in:[[2401,40],[2389,40]]},
  {id:9842, name:'Miniature Electronics', tier:'P1P2', outQ:5, in:[[2401,40],[9828,40]]},
  {id:15317, name:'Genetically Enhanced Livestock', tier:'P1P2', outQ:5, in:[[3779,40],[2395,40]]},
  {id:2344, name:'Condensates', tier:'P2P3', outQ:3, in:[[2317,10],[9832,10]]},
  {id:2345, name:'Camera Drones', tier:'P2P3', outQ:3, in:[[3697,10],[9830,10]]},
  {id:2346, name:'Synthetic Synapses', tier:'P2P3', outQ:3, in:[[2319,10],[2312,10]]},
  {id:2348, name:'Gel-Matrix Biopaste', tier:'P2P3', outQ:3, in:[[2317,10],[2329,10],[9838,10]]},
  {id:2349, name:'Supercomputers', tier:'P2P3', outQ:3, in:[[9836,10],[2328,10],[9832,10]]},
  {id:2351, name:'Smartfab Units', tier:'P2P3', outQ:3, in:[[9842,10],[3828,10]]},
  {id:2352, name:'Nuclear Reactors', tier:'P2P3', outQ:3, in:[[2327,10],[44,10]]},
  {id:2354, name:'Neocoms', tier:'P2P3', outQ:3, in:[[3697,10],[2329,10]]},
  {id:2358, name:'Biotech Research Reports', tier:'P2P3', outQ:3, in:[[2463,10],[3725,10],[3828,10]]},
  {id:2360, name:'Industrial Explosives', tier:'P2P3', outQ:3, in:[[3695,10],[3693,10]]},
  {id:2361, name:'Hermetic Membranes', tier:'P2P3', outQ:3, in:[[15317,10],[2321,10]]},
  {id:2366, name:'Hazmat Detection Systems', tier:'P2P3', outQ:3, in:[[3775,10],[3695,10],[9840,10]]},
  {id:2367, name:'Cryoprotectant Solution', tier:'P2P3', outQ:3, in:[[2319,10],[3691,10],[3693,10]]},
  {id:9834, name:'Guidance Systems', tier:'P2P3', outQ:3, in:[[2328,10],[9840,10]]},
  {id:9846, name:'Planetary Vehicles', tier:'P2P3', outQ:3, in:[[3689,10],[9842,10],[2312,10]]},
  {id:9848, name:'Robotics', tier:'P2P3', outQ:3, in:[[9836,10],[3689,10]]},
  {id:12836, name:'Transcranial Microcontrollers', tier:'P2P3', outQ:3, in:[[2463,10],[2329,10]]},
  {id:17136, name:'Ukomi Superconductors', tier:'P2P3', outQ:3, in:[[3691,10],[9838,10]]},
  {id:17392, name:'Data Chips', tier:'P2P3', outQ:3, in:[[2327,10],[2312,10]]},
  {id:17898, name:'High-Tech Transmitters', tier:'P2P3', outQ:3, in:[[2321,10],[9840,10]]},
  {id:28974, name:'Vaccines', tier:'P2P3', outQ:3, in:[[3775,10],[3725,10]]},
  {id:2867, name:'Broadcast Node', tier:'P3P4', outQ:1, in:[[17898,6],[17392,6],[2354,6]]},
  {id:2868, name:'Integrity Response Drones', tier:'P3P4', outQ:1, in:[[2366,6],[9846,6],[2348,6]]},
  {id:2869, name:'Nano-Factory', tier:'P3P4', outQ:1, in:[[2360,6],[2398,40],[17136,6]]},
  {id:2870, name:'Organic Mortar Applicators', tier:'P3P4', outQ:1, in:[[9848,6],[2393,40],[2344,6]]},
  {id:2871, name:'Recursive Computing Module', tier:'P3P4', outQ:1, in:[[12836,6],[9834,6],[2346,6]]},
  {id:2872, name:'Self-Harmonizing Power Core', tier:'P3P4', outQ:1, in:[[2345,6],[2352,6],[2361,6]]},
  {id:2873, name:'Superstable Shielded Charges', tier:'P3P4', outQ:1, in:[[2312,10],[2351,6],[2361,6]]},
  {id:2874, name:'Hazard Blooms', tier:'P3P4', outQ:1, in:[[3779,40],[2349,6],[2358,6]]},
  {id:2875, name:'Sterile Conduits', tier:'P3P4', outQ:1, in:[[3645,40],[28974,6],[2351,6]]},
  {id:2876, name:'Wetware Mainframe', tier:'P3P4', outQ:1, in:[[2349,6],[2358,6],[2367,6]]},
];

/* ================= Utility Functions ================= */
function $id(x){ return document.getElementById(x); }
function num(id, def){ const v=parseFloat($id(id).value); return isNaN(v)?def:v; }
function int(id, def){ const v=parseInt($id(id).value,10); return isNaN(v)?def:v; }
function fmt(x){ return Math.round(x).toLocaleString('it-IT'); }
function fmt1(x){ return (Math.round(x*10)/10).toLocaleString('it-IT'); }

let manualPinOverrides=null;
let manualTemplateSignature='';

function templateSignature(tpl){
  if(!tpl || !Array.isArray(tpl.P) || !Array.isArray(tpl.L)) return '';
  return `${tpl.Pln}|${tpl.P.length}|${tpl.P.map(p=>p.T).join(',')}|${tpl.L.length}`;
}

function generateTemplateFromCfg(cfg){
  return cfg.mode==='mining' ? buildMiningTemplate(cfg) : buildFactoryTemplate(cfg);
}

function applyManualOverridesToTemplate(tpl){
  const sig=templateSignature(tpl);
  if(!manualPinOverrides || sig!==manualTemplateSignature) return tpl;
  const n=Math.min(tpl.P.length, manualPinOverrides.length);
  for(let i=0;i<n;i++){
    const o=manualPinOverrides[i];
    if(!o) continue;
    tpl.P[i].La=+Number(o.La).toFixed(5);
    tpl.P[i].Lo=+Number(o.Lo).toFixed(5);
  }
  return tpl;
}

function getActiveTemplate(cfg){
  const tpl=generateTemplateFromCfg(cfg);
  return applyManualOverridesToTemplate(tpl);
}

function storeManualOverridesFromTemplate(tpl){
  manualTemplateSignature=templateSignature(tpl);
  manualPinOverrides=tpl.P.map(p=>({La:p.La, Lo:p.Lo}));
}

/* ================= Configuration ================= */
function readCfg(){
  const mode=$id('mode').value;
  const rawStor=int('nStor',1);
  const rawLpad=int('nLpad',1);
  return {
    ccu:int('ccu',5), mode:mode, tier:$id('tier').value,
    nFact:int('nFact',8), nStor:mode==='mining'?Math.max(1,rawStor):Math.max(0,rawStor), nLpad:Math.max(1,rawLpad),
    nEcu:int('nEcu',1), nHead:int('nHead',10), yield:num('yield',1150000),
    radius:num('radius',5000), pln:int('pln',2015), resIdx:int('miningRes',11),
    prodId:int('factoryProd',2329),
    layout:$id('layout').value, layoutSub:$id('layoutSub').value,
    chainDepth:Math.max(1,int('chainDepth',6)),
    seg:($id('segAuto').checked)?($id('layout').value==='star'?1.5:1.0):num('seg',1.5),
    ver:getVersion(),
    upgEcu:int('upgEcu',0), upgTrunk:int('upgTrunk',0), upgOther:int('upgOther',0),
    vP0:num('vP0',0.005), vP1:num('vP1',0.19), vP2:num('vP2',0.75), vP3:num('vP3',6), vP4:num('vP4',50),
  };
}

/* ================= Template Generation ================= */
const SUB_LABEL={full:'Full Star',hub:'Hub Pair',semistar:'Semi-Star',serial:'Serial'};
const MIN_PIN_RHO=0.012008578;
const MIN_PIN_GAP=MIN_PIN_RHO*1.02;

function polar(la0,lo0,rho,th){ return {la:la0+rho*Math.cos(th), lo:lo0+rho*Math.sin(th)}; }
function layoutSubOf(cfg){ return cfg.layoutSub||(cfg.layout==='star'?'full':'serial'); }
function ringRho(cfg,N){
  const rhoSpacing=N>1?MIN_PIN_GAP/(2*Math.sin(Math.PI/N)):MIN_PIN_GAP;
  return Math.max(rhoSpacing, MIN_PIN_GAP);
}
function ringLenKm(cfg,N){ return ringRho(cfg,N)*cfg.radius; }

function buildChainSlices(total, maxDepth){
  const depth=Math.max(1, maxDepth|0);
  const slices=[];
  if(total<=0) return slices;

  // Use the minimum branch count that satisfies max depth, then spread uniformly.
  const branchCount=Math.ceil(total/depth);
  const base=Math.floor(total/branchCount);
  const extra=total%branchCount;

  let cursor=0;
  for(let i=0;i<branchCount;i++){
    const size=base + (i<extra?1:0);
    slices.push({start:cursor, end:cursor+size});
    cursor+=size;
  }
  return slices;
}

function placeLaunchpadsNearStorage(addPin, lpType, count, storageCoords, fallbackBuilder){
  if(count<=0) return [];
  if(storageCoords && storageCoords.length){
    const out=[];
    const anchor=storageCoords[0];
    const r=MIN_PIN_GAP;
    for(let i=0;i<count;i++){
      const a=(2*Math.PI*i)/Math.max(3,count);
      out.push(addPin(anchor.la + r*Math.cos(a), anchor.lo + r*Math.sin(a), null, lpType));
    }
    return out;
  }
  return fallbackBuilder();
}

function enforceMinPinDistance(pins, minDist){
  if(!pins || pins.length<2) return;
  const minD=Math.max(0.00001, minDist);
  const iters=10;
  for(let step=0; step<iters; step++){
    let moved=false;
    for(let i=0;i<pins.length;i++){
      for(let j=i+1;j<pins.length;j++){
        const a=pins[i], b=pins[j];
        let dx=b.La-a.La;
        let dy=b.Lo-a.Lo;
        let d=Math.hypot(dx,dy);
        if(d>=minD) continue;
        if(d<1e-8){
          const seed=(i*31 + j*17) % 360;
          const t=(seed*Math.PI)/180;
          dx=Math.cos(t);
          dy=Math.sin(t);
          d=1;
        }
        const push=(minD-d)/2;
        const ux=dx/d, uy=dy/d;
        a.La-=ux*push;
        a.Lo-=uy*push;
        b.La+=ux*push;
        b.Lo+=uy*push;
        moved=true;
      }
    }
    if(!moved) break;
  }
  for(const p of pins){
    p.La=+p.La.toFixed(5);
    p.Lo=+p.Lo.toFixed(5);
  }
}

function optimizeLinksFromRoutes(links, routes, mustTouchPins=[]){
  const edgeByDir=new Map();
  const edgeByUnd=new Map();
  const undKey=(a,b)=>a<b?`${a}|${b}`:`${b}|${a}`;
  const dirKey=(a,b)=>`${a}>${b}`;

  for(const l of links){
    edgeByDir.set(dirKey(l.S,l.D), l);
    if(!edgeByUnd.has(undKey(l.S,l.D))) edgeByUnd.set(undKey(l.S,l.D), l);
  }

  const out=[];
  const usedUnd=new Set();
  const touchCount=new Map();
  const pushEdge=(a,b)=>{
    const uk=undKey(a,b);
    if(usedUnd.has(uk)) return;
    let edge=edgeByDir.get(dirKey(a,b)) || edgeByDir.get(dirKey(b,a)) || edgeByUnd.get(uk);
    if(!edge) edge={S:a,D:b,Lv:0};
    out.push({S:edge.S,D:edge.D,Lv:edge.Lv??0});
    usedUnd.add(uk);
    touchCount.set(edge.S,(touchCount.get(edge.S)||0)+1);
    touchCount.set(edge.D,(touchCount.get(edge.D)||0)+1);
  };

  for(const r of routes){
    if(!r || !Array.isArray(r.P) || r.P.length<2) continue;
    for(let i=0;i<r.P.length-1;i++) pushEdge(r.P[i], r.P[i+1]);
  }

  for(const pin of mustTouchPins){
    if((touchCount.get(pin)||0)>0) continue;
    const candidate=links.find(l=>l.S===pin || l.D===pin);
    if(candidate) pushEdge(candidate.S, candidate.D);
  }

  return out;
}

function ensureAllLaunchpadsLinked(lpPins, storPins, factPins, links){
  if(!lpPins.length) return;
  const key=(s,d)=>`${s}>${d}`;
  const existing=new Set(links.map(l=>key(l.S,l.D)));
  const touches=(pin)=>links.some(l=>l.S===pin || l.D===pin);
  const addLink=(s,d)=>{
    const k=key(s,d);
    if(existing.has(k)) return;
    links.push({D:d,Lv:0,S:s});
    existing.add(k);
  };

  for(let i=0;i<lpPins.length;i++){
    const lp=lpPins[i];
    if(touches(lp)) continue;
    if(storPins.length){
      addLink(storPins[i%storPins.length], lp);
    }else if(factPins.length){
      const anchor=factPins[Math.min(i, factPins.length-1)];
      addLink(anchor, lp);
    }
  }
}

function buildMiningTemplate(cfg){
  const pl=PLANETS[cfg.pln]||PLANETS[2015];
  const res=MINING_RES[cfg.resIdx]||MINING_RES[11];
  const sub=layoutSubOf(cfg);
  const isChain=(cfg.layout==='chain' || sub==='serial');
  const isHub=(sub==='hub');
  const isSemi=(sub==='semistar');
  const pins=[], routes=[];
  let links=[];
  const addPin=(la,lo,s,t,h)=>{ pins.push({H:h||0, La:la, Lo:lo, S:s, T:t}); return pins.length; };
  const la0=1.5708, lo0=1.0;
  const lp=[],stor=[],ecu=[],fact=[];
  const storCoords=[];
  const maxFlow=Math.max(cfg.nFact*144000, cfg.yield);
  const QECU=Math.round(maxFlow/Math.max(cfg.nEcu,1));
  const RHO=ringRho(cfg,cfg.nFact);
  if(!isChain){
    if(cfg.nStor===1){ stor.push(addPin(la0,lo0,null,pl.stor)); storCoords.push({la:la0, lo:lo0}); }
    else for(let i=0;i<cfg.nStor;i++){ const p=polar(la0,lo0,MIN_PIN_GAP, i*2*Math.PI/cfg.nStor); stor.push(addPin(p.la,p.lo,null,pl.stor)); storCoords.push({la:p.la, lo:p.lo}); }
    lp.push(...placeLaunchpadsNearStorage(addPin, pl.lp, cfg.nLpad, storCoords, ()=>{
      const out=[];
      for(let i=0;i<cfg.nLpad;i++){ const p=polar(la0,lo0,MIN_PIN_GAP, i*0.7); out.push(addPin(p.la,p.lo,null,pl.lp)); }
      return out;
    }));
    for(let i=0;i<cfg.nEcu;i++){ const p=polar(la0,lo0,MIN_PIN_GAP, Math.PI + i*0.7); ecu.push(addPin(p.la,p.lo,res.p0,pl.ecu,10)); }
    for(let i=0;i<cfg.nFact;i++){
      const theta = isHub
        ? (Math.PI/2 + (i%2===0?-1:1)*(Math.PI/6) + (Math.floor(i/2)*0.35))
        : (Math.PI/2 + 2*Math.PI*i/Math.max(cfg.nFact,1));
      const p=polar(la0,lo0,RHO, theta);
      fact.push(addPin(p.la,p.lo,res.p1,pl.basic));
    }
    for(let i=0;i<ecu.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) links.push({D:s,Lv:0,S:ecu[i]}); }
    if(isHub){
      for(let i=0;i<fact.length;i+=2){
        const s=stor[(i/2)%Math.max(stor.length,1)];
        const a=fact[i], b=fact[i+1];
        if(s && a) links.push({D:a,Lv:0,S:s});
        if(a && b) links.push({D:b,Lv:0,S:a});
        if(a) links.push({D:lp[(i/2)%Math.max(lp.length,1)],Lv:0,S:a});
        if(b) links.push({D:lp[(i/2)%Math.max(lp.length,1)],Lv:0,S:b});
      }
    }else if(isSemi){
      for(let i=0;i<fact.length;i++){
        const s=stor[i%Math.max(stor.length,1)];
        if(s) links.push({D:fact[i],Lv:0,S:s});
        if(s) links.push({D:s,Lv:0,S:fact[i]});
      }
      for(let i=0;i<stor.length;i++) links.push({D:lp[i%Math.max(lp.length,1)],Lv:0,S:stor[i]});
    }else{
      for(let i=0;i<fact.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) links.push({D:fact[i],Lv:0,S:s}); links.push({D:lp[i%Math.max(lp.length,1)],Lv:0,S:fact[i]}); }
    }
    for(let i=0;i<ecu.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) routes.push({P:[ecu[i],s], Q:QECU, T:res.p0}); }
    if(isHub){
      for(let i=0;i<fact.length;i+=2){
        const s=stor[(i/2)%Math.max(stor.length,1)];
        const a=fact[i], b=fact[i+1], l=lp[(i/2)%Math.max(lp.length,1)];
        if(s && a) routes.push({P:[s,a], Q:3000, T:res.p0});
        if(s && a && b) routes.push({P:[s,a,b], Q:3000, T:res.p0});
        if(a) routes.push({P:[a,l], Q:20, T:res.p1});
        if(b) routes.push({P:[b,l], Q:20, T:res.p1});
      }
    }else if(isSemi){
      for(let i=0;i<fact.length;i++){
        const s=stor[i%Math.max(stor.length,1)];
        const l=lp[i%Math.max(lp.length,1)];
        if(s) routes.push({P:[s,fact[i]], Q:3000, T:res.p0});
        if(s && l) routes.push({P:[fact[i],s,l], Q:20, T:res.p1});
      }
    }else{
      for(let i=0;i<fact.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) routes.push({P:[s,fact[i]], Q:3000, T:res.p0}); routes.push({P:[fact[i],lp[i%Math.max(lp.length,1)]], Q:20, T:res.p1}); }
    }
  }else{
    const storCount=Math.max(0,cfg.nStor);
    const lpCount=Math.max(0,cfg.nLpad);
    const slices=buildChainSlices(cfg.nFact, cfg.chainDepth);
    for(let i=0;i<storCount;i++){
      const la=la0-MIN_PIN_GAP, lo=lo0+(i*MIN_PIN_GAP);
      stor.push(addPin(la, lo, null, pl.stor));
      storCoords.push({la, lo});
    }
    lp.push(...placeLaunchpadsNearStorage(addPin, pl.lp, lpCount, storCoords, ()=>{
      const out=[];
      for(let i=0;i<lpCount;i++) out.push(addPin(la0+MIN_PIN_GAP, lo0+(i*MIN_PIN_GAP), null, pl.lp));
      return out;
    }));
    for(let i=0;i<cfg.nEcu;i++) ecu.push(addPin(la0-MIN_PIN_GAP, lo0-MIN_PIN_GAP*(1+i*0.2), res.p0, pl.ecu, 10));
    const step=MIN_PIN_GAP;
    for(let g=0; g<slices.length; g++){
      const laneLa=la0 + (g-(slices.length-1)/2)*MIN_PIN_GAP;
      const s=slices[g];
      for(let i=s.start;i<s.end;i++){
        const inLane=i-s.start;
        fact.push(addPin(laneLa, lo0 + MIN_PIN_GAP + inLane*step, res.p1, pl.basic));
      }
    }

    const hubStor=stor.length?stor[0]:null;
    const hubLp=lp.length?lp[0]:null;
    if(hubStor && hubLp) links.push({D:hubLp,Lv:0,S:hubStor});

    let cursor=0;
    let prevTail=null;
    for(let g=0; g<slices.length; g++){
      const s=slices[g];
      const chain=fact.slice(cursor, cursor+(s.end-s.start));
      cursor+=chain.length;
      if(!chain.length) continue;
      const sourcePin=(isHub && prevTail && !hubStor && !hubLp) ? prevTail : (hubStor||hubLp||prevTail);
      if(sourcePin) links.push({D:chain[0],Lv:0,S:sourcePin});
      for(let i=0;i<chain.length-1;i++) links.push({D:chain[i+1],Lv:0,S:chain[i]});
      prevTail=chain[chain.length-1];
    }

    if(hubStor){
      for(let i=0;i<ecu.length;i++) routes.push({P:[ecu[i],hubStor], Q:QECU, T:res.p0});
    }else if(hubLp){
      for(let i=0;i<ecu.length;i++) routes.push({P:[ecu[i],hubLp], Q:QECU, T:res.p0});
    }else if(fact.length){
      for(let i=0;i<ecu.length;i++) routes.push({P:[ecu[i],fact[0]], Q:QECU, T:res.p0});
    }

    if(!hubStor && !hubLp && fact.length){
      for(let i=0;i<ecu.length;i++) links.push({D:fact[0],Lv:0,S:ecu[i]});
    }else if(!hubStor && hubLp){
      for(let i=0;i<ecu.length;i++) links.push({D:hubLp,Lv:0,S:ecu[i]});
    }else if(hubStor){
      for(let i=0;i<ecu.length;i++) links.push({D:hubStor,Lv:0,S:ecu[i]});
    }

    cursor=0;
    prevTail=null;
    for(let g=0; g<slices.length; g++){
      const s=slices[g];
      const chain=fact.slice(cursor, cursor+(s.end-s.start));
      cursor+=chain.length;
      if(!chain.length) continue;
      const sourcePin=((isHub && prevTail && !hubStor && !hubLp) ? prevTail : (hubStor||hubLp||prevTail)) || chain[0];
      for(let i=0;i<chain.length;i++){
        routes.push({P:[sourcePin, ...chain.slice(0,i+1)], Q:3000, T:res.p0});
        const outPath=[chain[i], ...chain.slice(0,i).reverse()];
        if(!isHub){
          if(hubStor) outPath.push(hubStor);
          if(hubLp) outPath.push(hubLp);
        }
        routes.push({P:outPath, Q:20, T:res.p1});
      }
      prevTail=chain[chain.length-1];
    }
  }
  ensureAllLaunchpadsLinked(lp, stor, fact, links);
  links=optimizeLinksFromRoutes(links, routes, lp);
  enforceMinPinDistance(pins, MIN_PIN_GAP);
  return {CmdCtrLv:cfg.ccu, Cmt:`Miner ${res.p0n}-${res.p1n} ${cfg.nFact}fac ${pl.name} ${SUB_LABEL[sub]}`, Diam:2*cfg.radius, L:links, P:pins, Pln:cfg.pln, R:routes};
}

function buildFactoryTemplate(cfg){
  const pl=PLANETS[2016];
  const prod=PRODUCTS.find(p=>p.id===cfg.prodId)||PRODUCTS[0];
  const struct=prod.tier==='P3P4'?pl.ht:pl.adv;
  const sub=layoutSubOf(cfg);
  const isChain=(cfg.layout==='chain' || sub==='serial');
  const isHub=(sub==='hub');
  const isSemi=(sub==='semistar');
  const pins=[], routes=[];
  let links=[];
  const addPin=(la,lo,s,t,h)=>{ pins.push({H:h||0, La:la, Lo:lo, S:s, T:t}); return pins.length; };
  const la0=1.5708, lo0=1.0;
  const lp=[],stor=[],fact=[];
  const storCoords=[];
  if(!isChain){
    for(let i=0;i<cfg.nStor;i++){
      const p=polar(la0,lo0,MIN_PIN_GAP, i*0.9);
      stor.push(addPin(p.la,p.lo,null,pl.stor));
      storCoords.push({la:p.la, lo:p.lo});
    }
    lp.push(...placeLaunchpadsNearStorage(addPin, pl.lp, cfg.nLpad, storCoords, ()=>{
      const out=[];
      for(let i=0;i<cfg.nLpad;i++) out.push(addPin(la0,lo0,null,pl.lp));
      return out;
    }));
    for(let i=0;i<cfg.nFact;i++){
      const theta = isHub
        ? (Math.PI/2 + (i%2===0?-1:1)*(Math.PI/6) + (Math.floor(i/2)*0.35))
        : (Math.PI/2 + 2*Math.PI*i/Math.max(cfg.nFact,1));
      const p=polar(la0,lo0,ringRho(cfg,cfg.nFact), theta);
      fact.push(addPin(p.la,p.lo,prod.id,struct));
    }
    if(isHub){
      for(let i=0;i<fact.length;i+=2){
        const s=stor[(i/2)%Math.max(stor.length,1)];
        const l=lp[(i/2)%Math.max(lp.length,1)];
        const a=fact[i], b=fact[i+1];
        if(s && a) links.push({D:a,Lv:0,S:s});
        if(a && b) links.push({D:b,Lv:0,S:a});
        if(a) links.push({D:l,Lv:0,S:a});
        if(b) links.push({D:l,Lv:0,S:b});
      }
    }else if(isSemi){
      for(let i=0;i<fact.length;i++){
        const s=stor[i%Math.max(stor.length,1)];
        if(s) links.push({D:fact[i],Lv:0,S:s});
        if(s) links.push({D:s,Lv:0,S:fact[i]});
      }
      for(const s of stor){ for(const l of lp){ links.push({D:l,Lv:0,S:s}); } }
    }else{
      for(let i=0;i<fact.length;i++) links.push({D:lp[i%Math.max(lp.length,1)],Lv:0,S:fact[i]});
      for(const s of stor){ for(const l of lp){ links.push({D:l,Lv:0,S:s}); } }
    }
    for(const [inId,inQ] of prod.in){
      for(let i=0;i<fact.length;i++){
        const l=lp[i%Math.max(lp.length,1)], s=stor[i%Math.max(stor.length,1)];
        if(s&&l) routes.push({P:[l,s],Q:inQ,T:inId});
        if(isHub){
          const a=fact[i], b=fact[i+1];
          if(a) routes.push({P:[l,s,a],Q:inQ,T:inId});
          if(a&&b) routes.push({P:[l,s,a,b],Q:inQ,T:inId});
          i++;
        }else if(isSemi){
          routes.push({P:[l,s,fact[i]],Q:inQ,T:inId});
        }else{
          routes.push({P:[l,s,fact[i]],Q:inQ,T:inId});
        }
      }
    }
    if(isSemi){
      for(let i=0;i<fact.length;i++) routes.push({P:[fact[i],stor[i%Math.max(stor.length,1)],lp[i%Math.max(lp.length,1)]],Q:prod.outQ,T:prod.id});
    }else{
      for(let i=0;i<fact.length;i++) routes.push({P:[fact[i],lp[i%Math.max(lp.length,1)]],Q:prod.outQ,T:prod.id});
    }
  }else{
    const storCount=Math.max(0,cfg.nStor);
    const lpCount=Math.max(0,cfg.nLpad);
    const slices=buildChainSlices(cfg.nFact, cfg.chainDepth);
    for(let i=0;i<storCount;i++){
      const la=la0-MIN_PIN_GAP, lo=lo0+(i*MIN_PIN_GAP);
      stor.push(addPin(la, lo, null, pl.stor));
      storCoords.push({la, lo});
    }
    lp.push(...placeLaunchpadsNearStorage(addPin, pl.lp, lpCount, storCoords, ()=>{
      const out=[];
      for(let i=0;i<lpCount;i++) out.push(addPin(la0+MIN_PIN_GAP, lo0+(i*MIN_PIN_GAP), null, pl.lp));
      return out;
    }));
    const step=MIN_PIN_GAP;
    for(let g=0; g<slices.length; g++){
      const laneLa=la0 + (g-(slices.length-1)/2)*MIN_PIN_GAP;
      const s=slices[g];
      for(let i=s.start;i<s.end;i++){
        const inLane=i-s.start;
        fact.push(addPin(laneLa, lo0 + MIN_PIN_GAP + inLane*step, prod.id, struct));
      }
    }

    const hubStor=stor.length?stor[0]:null;
    const hubLp=lp.length?lp[0]:null;
    if(hubStor && hubLp) links.push({D:hubLp,Lv:0,S:hubStor});

    let cursor=0;
    let prevTail=null;
    for(let g=0; g<slices.length; g++){
      const s=slices[g];
      const chain=fact.slice(cursor, cursor+(s.end-s.start));
      cursor+=chain.length;
      if(!chain.length) continue;
      const sourcePin=(isHub && prevTail && !hubStor && !hubLp) ? prevTail : (hubStor||hubLp||prevTail);
      if(sourcePin) links.push({D:chain[0],Lv:0,S:sourcePin});
      for(let i=0;i<chain.length-1;i++) links.push({D:chain[i+1],Lv:0,S:chain[i]});

      if(!isHub){
        if(hubStor) links.push({D:hubStor,Lv:0,S:chain[chain.length-1]});
        else if(hubLp) links.push({D:hubLp,Lv:0,S:chain[chain.length-1]});
      }
      prevTail=chain[chain.length-1];
    }

    for(const [inId,inQ] of prod.in){
      cursor=0;
      prevTail=null;
      for(let g=0; g<slices.length; g++){
        const s=slices[g];
        const chain=fact.slice(cursor, cursor+(s.end-s.start));
        cursor+=chain.length;
        if(!chain.length) continue;
        const sourcePin=(isHub && prevTail && !hubStor && !hubLp) ? prevTail : null;
        for(let i=0;i<chain.length;i++){
          const path=[];
          if(sourcePin) path.push(sourcePin);
          if(!sourcePin){
            if(hubLp) path.push(hubLp);
            if(hubStor) path.push(hubStor);
            if(!hubStor && !hubLp) path.push(chain[0]);
          }
          path.push(...chain.slice(0,i+1));
          routes.push({P:path,Q:inQ,T:inId});
        }
        prevTail=chain[chain.length-1];
      }
    }
    cursor=0;
    for(let g=0; g<slices.length; g++){
      const s=slices[g];
      const chain=fact.slice(cursor, cursor+(s.end-s.start));
      cursor+=chain.length;
      if(!chain.length) continue;
      for(let i=0;i<chain.length;i++){
        const path=[chain[i],...chain.slice(i+1)];
        if(!isHub){
          if(hubStor) path.push(hubStor);
          if(hubLp) path.push(hubLp);
        }
        routes.push({P:path,Q:prod.outQ,T:prod.id});
      }
    }
  }
  ensureAllLaunchpadsLinked(lp, stor, fact, links);
  links=optimizeLinksFromRoutes(links, routes, lp);
  enforceMinPinDistance(pins, MIN_PIN_GAP);
  return {CmdCtrLv:cfg.ccu, Cmt:`Factory ${prod.name} ${cfg.nFact}fac ${SUB_LABEL[sub]}`, Diam:2*cfg.radius, L:links, P:pins, Pln:2016, R:routes};
}

const TOP_ORDER=['CmdCtrLv','Cmt','Diam','L','P','Pln','R'];
const OBJ_ORDERS={L:['D','Lv','S'], P:['H','La','Lo','S','T'], R:['P','Q','T']};
const FLOAT_KEYS={Diam:1,La:1,Lo:1};

function jnum(n,fl){ if(typeof n!=='number') return String(n); if(fl) return Number.isInteger(n)?n.toFixed(1):String(n); return String(n); }
function jval(v,key){
  if(v===null) return 'null';
  if(Array.isArray(v)) return '['+v.map(x=>jval(x)).join(', ')+']';
  if(typeof v==='object'){
    const order=OBJ_ORDERS[key]||Object.keys(v);
    return '{'+order.filter(k=>v[k]!==undefined).map(k=>`"${k}": ${jval(v[k],k)}`).join(', ')+'}';
  }
  if(typeof v==='number') return jnum(v,!!FLOAT_KEYS[key]);
  return JSON.stringify(String(v));
}

function serializeGame(tpl){
  const o={}; for(const k of TOP_ORDER) o[k]=tpl[k];
  return jval(o);
}

function exportJSON(){
  const cfg=readCfg();
  const tpl=getActiveTemplate(cfg);
  const json=serializeGame(tpl);
  const blob=new Blob([json],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=(tpl.Cmt||'pi_template').replace(/[\\/:*?"<>|\s]+/g,'_')+'.json';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 200);
}

function copyJSON(){
  const cfg=readCfg();
  const tpl=getActiveTemplate(cfg);
  const json=serializeGame(tpl);
  const done=()=>{ const b=$id('btnCopy'); const old=b.textContent; b.textContent='Copied ✓'; setTimeout(()=>{ b.textContent=old; }, 1500); };
  const fallback=()=>{
    const ta=document.createElement('textarea'); ta.value=json; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){ alert('Copy failed'); }
    ta.remove();
  };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(json).then(done).catch(()=>fallback());
  }else{
    fallback();
  }
}

/* ================= Persistence & Import ================= */
const CALC_STATE_KEY='eve-pi-calculator-state';
const THEME_KEY='eve-pi-theme';
const TRANSFER_TEMPLATE_KEY='eve-pi-transfer-template-json';

function setControlValue(id, value){
  const el=$id(id);
  if(!el || value===undefined || value===null) return;
  if(el.type==='checkbox') el.checked=!!value;
  else el.value=String(value);
}

function saveCalculatorState(){
  const state={};
  for(const id of bindIds){
    const el=$id(id);
    if(!el) continue;
    state[id]=el.type==='checkbox'?el.checked:el.value;
  }
  localStorage.setItem(CALC_STATE_KEY, JSON.stringify(state));
}

function restoreCalculatorState(){
  let state=null;
  try{ state=JSON.parse(localStorage.getItem(CALC_STATE_KEY)||'null'); }catch(e){ state=null; }
  if(!state || typeof state!=='object') return;
  const deferred=new Set(['layoutSub','factoryProd','upgEcu','upgTrunk','upgOther']);
  for(const id of bindIds){
    if(!deferred.has(id)) setControlValue(id,state[id]);
  }
  populateLayoutSub();
  setControlValue('layoutSub',state.layoutSub);
  populateFactoryProd();
  setControlValue('factoryProd',state.factoryProd);
  const ver=getVersion();
  for(const id of ['upgEcu','upgTrunk','upgOther']) syncUpgOptions(id, ver.levels.length-1);
  setControlValue('upgEcu',state.upgEcu);
  setControlValue('upgTrunk',state.upgTrunk);
  setControlValue('upgOther',state.upgOther);
}

function restoreTheme(){
  $id('themeToggle').checked=localStorage.getItem(THEME_KEY)==='dark';
}

function saveTheme(){
  localStorage.setItem(THEME_KEY,$id('themeToggle').checked?'dark':'light');
}

function setJsonStatus(message, type){
  const el=$id('jsonStatus');
  el.className='validation-status'+(type?` ${type}`:'');
  el.textContent=message;
}

function parseTemplateText(text){
  const trimmed=(text||'').trim();
  if(!trimmed) return {ok:false, errors:['No JSON provided.'], warnings:[]};
  try{
    const tpl=JSON.parse(trimmed);
    return validateTemplate(tpl);
  }catch(e){
    return {ok:false, errors:[`Invalid JSON: ${e.message}`], warnings:[]};
  }
}

function validateTemplate(tpl){
  const errors=[], warnings=[];
  if(!tpl || typeof tpl!=='object' || Array.isArray(tpl)) return {ok:false, errors:['Root value must be a JSON object.'], warnings:[]};
  if(!Number.isInteger(tpl.CmdCtrLv) || tpl.CmdCtrLv<0 || tpl.CmdCtrLv>5) errors.push('CmdCtrLv must be an integer from 0 to 5.');
  if(typeof tpl.Diam!=='number' || tpl.Diam<=0) errors.push('Diam must be a positive number.');
  if(!Number.isInteger(tpl.Pln)) warnings.push('Pln is missing or not an integer; planet type cannot be inferred reliably.');
  else if(!PLANETS[tpl.Pln]) warnings.push(`Unknown planet type Pln=${tpl.Pln}; radius and CCU can still be imported.`);
  for(const key of ['P','L','R']) if(!Array.isArray(tpl[key])) errors.push(`${key} must be an array.`);
  if(errors.length) return {ok:false, tpl, errors, warnings};
  tpl.P.forEach((pin,i)=>{
    if(!pin || typeof pin!=='object' || Array.isArray(pin)) errors.push(`P[${i}] must be an object.`);
    else{
      if(typeof pin.T!=='number') errors.push(`P[${i}].T must be a type id number.`);
      if(typeof pin.La!=='number') errors.push(`P[${i}].La must be a number.`);
      if(typeof pin.Lo!=='number') errors.push(`P[${i}].Lo must be a number.`);
      if(pin.H!==undefined && typeof pin.H!=='number') errors.push(`P[${i}].H must be a number when present.`);
      if(pin.S!==null && pin.S!==undefined && typeof pin.S!=='number') errors.push(`P[${i}].S must be null or a type id number.`);
    }
  });
  const validPin=(n)=>Number.isInteger(n) && n>=1 && n<=tpl.P.length;
  tpl.L.forEach((link,i)=>{
    if(!link || typeof link!=='object' || Array.isArray(link)) errors.push(`L[${i}] must be an object.`);
    else{
      if(!validPin(link.S)) errors.push(`L[${i}].S must reference an existing pin.`);
      if(!validPin(link.D)) errors.push(`L[${i}].D must reference an existing pin.`);
      if(!Number.isInteger(link.Lv) || link.Lv<0) errors.push(`L[${i}].Lv must be a non-negative integer.`);
    }
  });
  tpl.R.forEach((route,i)=>{
    if(!route || typeof route!=='object' || Array.isArray(route)) errors.push(`R[${i}] must be an object.`);
    else{
      if(!Array.isArray(route.P) || route.P.length<2 || !route.P.every(validPin)) errors.push(`R[${i}].P must be a path of existing pin indexes.`);
      if(typeof route.Q!=='number' || route.Q<=0) errors.push(`R[${i}].Q must be a positive number.`);
      if(typeof route.T!=='number') errors.push(`R[${i}].T must be a type id number.`);
    }
  });
  return {ok:errors.length===0, tpl, errors, warnings};
}

function countPinsByType(tpl){
  const counts=new Map();
  for(const pin of tpl.P) counts.set(pin.T,(counts.get(pin.T)||0)+1);
  return counts;
}

function inferLayoutFromComment(comment){
  const text=String(comment||'').toLowerCase();
  if(text.includes('serial')) return {layout:'chain', layoutSub:'serial'};
  if(text.includes('semi-star')) return {layout:'star', layoutSub:'semistar'};
  if(text.includes('hub')) return {layout:'star', layoutSub:'hub'};
  return {layout:'star', layoutSub:'full'};
}

function inferConfigFromTemplate(tpl){
  const counts=countPinsByType(tpl);
  const planet=PLANETS[tpl.Pln]||PLANETS[2015];
  const ecuCount=counts.get(planet.ecu)||0;
  const nStor=counts.get(planet.stor)||0;
  const nLpad=counts.get(planet.lp)||0;
  const factoryTypeIds=new Set([planet.basic, planet.adv, planet.ht, PLANETS[2016].adv, PLANETS[2016].ht]);
  const factoryPins=tpl.P.filter(pin=>factoryTypeIds.has(pin.T));
  const productCounts=new Map();
  for(const pin of factoryPins){
    if(typeof pin.S==='number') productCounts.set(pin.S,(productCounts.get(pin.S)||0)+1);
  }
  const productId=[...productCounts.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0];
  const product=PRODUCTS.find(p=>p.id===productId);
  const miningByP1=MINING_RES.findIndex(r=>r.p1===productId);
  const miningByP0=MINING_RES.findIndex(r=>tpl.R.some(route=>route.T===r.p0));
  const isMining=ecuCount>0 || miningByP1>=0 || miningByP0>=0;
  const layout=inferLayoutFromComment(tpl.Cmt);
  return {
    ccu:tpl.CmdCtrLv,
    radius:tpl.Diam/2,
    pln:tpl.Pln,
    nAuto:false,
    mode:isMining?'mining':'factory',
    nFact:factoryPins.length,
    nStor:nStor,
    nLpad:Math.max(nLpad,1),
    nEcu:Math.max(ecuCount,1),
    nHead:Math.max(...tpl.P.filter(pin=>pin.T===planet.ecu).map(pin=>pin.H||0),0),
    miningRes:miningByP1>=0?miningByP1:(miningByP0>=0?miningByP0:int('miningRes',11)),
    tier:product?product.tier:$id('tier').value,
    factoryProd:product?product.id:$id('factoryProd').value,
    layout:layout.layout,
    layoutSub:layout.layoutSub,
  };
}

function applyConfigPatch(values){
  manualPinOverrides=null;
  manualTemplateSignature='';
  const firstPass=['ccu','mode','tier','nAuto','nFact','nStor','nLpad','nEcu','nHead','radius','pln','miningRes','layout'];
  for(const id of firstPass) setControlValue(id,values[id]);
  populateLayoutSub();
  setControlValue('layoutSub',values.layoutSub);
  populateFactoryProd();
  setControlValue('factoryProd',values.factoryProd);
  update();
  saveCalculatorState();
}

function validateJsonInput(){
  const result=parseTemplateText($id('jsonInput').value);
  if(result.ok){
    const suffix=result.warnings.length?` Warnings: ${result.warnings.join(' ')}`:'';
    setJsonStatus(`Valid PI template. Pins: ${result.tpl.P.length}, links: ${result.tpl.L.length}, routes: ${result.tpl.R.length}.${suffix}`,'ok');
  }else{
    setJsonStatus(result.errors.join(' '),'bad');
  }
  return result;
}

function applyImportedJson(){
  const result=validateJsonInput();
  if(!result.ok) return;
  applyConfigPatch(inferConfigFromTemplate(result.tpl));
  setJsonStatus('Template JSON is valid and its main settings were applied to the calculator.','ok');
}

function applyTransferredJsonIfPresent(){
  const payloadRaw=localStorage.getItem(TRANSFER_TEMPLATE_KEY);
  if(!payloadRaw) return;
  localStorage.removeItem(TRANSFER_TEMPLATE_KEY);
  let payload=null;
  try{
    payload=JSON.parse(payloadRaw);
  }catch(e){
    setJsonStatus(`Transferred template payload is invalid: ${e.message}`,'bad');
    return;
  }
  const jsonText=typeof payload==='string'?payload:(payload&&typeof payload==='object'&&typeof payload.json==='string'?payload.json:'');
  if(!jsonText.trim()){
    setJsonStatus('Transferred template is empty.','bad');
    return;
  }
  $id('jsonInput').value=jsonText;
  const result=validateJsonInput();
  if(!result.ok) return;
  applyConfigPatch(inferConfigFromTemplate(result.tpl));
  const source=(payload&&typeof payload==='object'&&typeof payload.source==='string'&&payload.source.trim())?` (${payload.source})`:'';
  setJsonStatus(`Transferred template imported${source} and applied to calculator settings.`,'ok');
}

async function pasteJsonFromClipboard(){
  if(!navigator.clipboard || !navigator.clipboard.readText){
    setJsonStatus('Clipboard read is not available in this browser context. Paste the JSON manually, then validate.','bad');
    return;
  }
  try{
    $id('jsonInput').value=await navigator.clipboard.readText();
    validateJsonInput();
  }catch(e){
    setJsonStatus(`Clipboard read failed: ${e.message}`,'bad');
  }
}

function loadJsonFile(file){
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    $id('jsonInput').value=String(reader.result||'');
    validateJsonInput();
  };
  reader.onerror=()=>setJsonStatus('Could not read the selected file.','bad');
  reader.readAsText(file);
}

/* ================= UI Population ================= */
function populateMiningRes(){
  const sel=$id('miningRes');
  sel.innerHTML=MINING_RES.map((r,i)=>`<option value="${i}"${i===11?' selected':''}>${r.p0n} (P0) → ${r.p1n} (P1)</option>`).join('');
}

function populateFactoryProd(){
  const sel=$id('factoryProd');
  const tier=$id('tier').value;
  const cur=parseInt(sel.value,10);
  const list=PRODUCTS.filter(p=>p.tier===tier);
  sel.innerHTML=list.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  sel.value=list.some(p=>p.id===cur)?cur:(list[0]?list[0].id:'');
}

function populateLayoutSub(){
  const sel=$id('layoutSub');
  const L=$id('layout').value;
  const cur=sel.value||'';
  const opts = L==='star' ? [['full','Full Star'],['hub','Hub Pair'],['semistar','Semi-Star']] : [['serial','Serial (Legacy)'],['hub','Hub (Line)']];
  sel.innerHTML=opts.map(([v,label])=>`<option value="${v}">${label}</option>`).join('');
  sel.value=opts.some(o=>o[0]===cur)?cur:opts[0][0];
  const hints={
    full:'Full Star: each factory links to storage+launchpad',
    hub:'Hub Pair: factories in pairs, few links, usually no upgrade',
    semistar:'Semi-Star: factories link to storage, P1 via storage',
    serial:'Serial: factories daisy-chained, needs upgrades at high yield',
  };
  $id('layoutHint').textContent=hints[sel.value]||'';
}

/* ================= Calculation ================= */
function suggestLevel(ver, reqM3){
  for(let i=0;i<ver.levels.length;i++) if(ver.levels[i].cap>=reqM3) return i;
  return ver.levels.length-1;
}

function buildLinkGroups(cfg){
  const g=[];
  const sub=layoutSubOf(cfg);
  const isHub=(sub==='hub'), isSemi=(sub==='semistar'), isFull=(sub==='full'), isSerial=(sub==='serial');
  if(cfg.mode==='mining'){
    const demand=cfg.nFact*MINING_IN;
    const linkFlow=cfg.nEcu?Math.max(demand,cfg.yield)/cfg.nEcu:0;
    g.push({name:'ECU→Storage', count:cfg.nEcu, flowUnits:linkFlow, vol:cfg.vP0, level:'upgEcu'});
    if(isFull){
      g.push({name:'Storage→Factory', count:cfg.nFact, flowUnits:MINING_IN, vol:cfg.vP0, level:'upgOther', len:ringLenKm(cfg,cfg.nFact)});
      g.push({name:'Factory→Launchpad', count:cfg.nFact, flowUnits:MINING_OUT, vol:cfg.vP1, level:'upgOther', len:ringLenKm(cfg,cfg.nFact)});
    }else if(isSemi){
      g.push({name:'Storage→Factory (P0)', count:cfg.nFact, flowUnits:MINING_IN, vol:cfg.vP0, level:'upgOther', len:ringLenKm(cfg,cfg.nFact)});
      g.push({name:'Storage→Launchpad (P1)', count:1, flowUnits:cfg.nFact*MINING_OUT, vol:cfg.vP1, level:'upgTrunk'});
    }
  }else{
    const t=TIERS[cfg.tier];
    const m3=(units,vol)=>units*vol/24;
    const m3io=m3(t.in,cfg[t.inV])+m3(t.out,cfg[t.outV]);
    if(isFull || isSemi){
      g.push({name:'Factory↔Launchpad', count:cfg.nFact, reqM3:m3io, level:'upgOther', len:ringLenKm(cfg,cfg.nFact)});
      if(cfg.nStor>0) g.push({name:'Launchpad↔Storage (buffer)', count:1, reqM3:cfg.nFact*m3io, level:'upgTrunk'});
    }
  }
  return g;
}

function evaluate(cfg, autoUpg){
  const ver=cfg.ver;
  const budget=CCU_BUDGET[cfg.ccu];
  const ml=0.012008578*cfg.radius;
  const len=ml*cfg.seg;
  const structs=[]; let sCpu=0, sPg=0;
  const add=(k,n)=>{ if(n<=0) return; const st=STRUCT[k]; structs.push({name:`${st.name} ×${n}`, cpu:st.cpu*n, pg:st.pg*n}); sCpu+=st.cpu*n; sPg+=st.pg*n; };
  if(cfg.mode==='mining'){ add('basic',cfg.nFact); add('ecu',cfg.nEcu); add('head',cfg.nEcu*cfg.nHead); }else{ add(TIERS[cfg.tier].fact,cfg.nFact); }
  add('storage',cfg.nStor); add('launchpad',cfg.nLpad);
  const groups=buildLinkGroups(cfg);
  let lCpu=0, lPg=0, uCpu=0, uPg=0;
  const rows=[];
  for(const gr of groups){
    const len=gr.len!=null?gr.len:ml*cfg.seg;
    const bCpu=15+0.2*len, bPg=10+0.15*len;
    const req=gr.reqM3!=null?gr.reqM3:gr.flowUnits*gr.vol/24;
    const suggest=suggestLevel(ver, req);
    const lvl=autoUpg?suggest:cfg[gr.level];
    const cap=ver.levels[lvl].cap;
    const ok=req<=cap;
    lCpu+=bCpu*gr.count; lPg+=bPg*gr.count;
    uCpu+=ver.levels[lvl].cpu*gr.count; uPg+=ver.levels[lvl].pg*gr.count;
    rows.push({name:gr.name, count:gr.count, flow:gr.flowUnits!=null?gr.flowUnits:Math.round(req*24/(gr.vol||1)), vol:gr.vol, req:req, lvl:lvl, suggest:suggest, cap:cap, ok:ok, used:(req/cap*100)});
  }
  const totCpu=sCpu+lCpu+uCpu, totPg=sPg+lPg+uPg;
  return { cfg, budget, structs, sCpu, sPg, lCpu, lPg, uCpu, uPg, rows, totCpu, totPg, cpuLeft:budget.cpu-totCpu, pgLeft:budget.pg-totPg, cpuOk:totCpu<=budget.cpu, pgOk:totPg<=budget.pg, };
}

/* ================= Rendering ================= */
function syncUpgOptions(id, maxL){
  const sel=$id(id); const cur=parseInt(sel.value,10);
  const want=Array.from({length:maxL+1},(_,i)=>`<option value="${i}"${i===cur?' selected':''}>${i}</option>`).join('');
  if(sel.innerHTML!==want) sel.innerHTML=want;
}

function showHide(cfg){
  $id('miningPanel').style.display=cfg.mode==='mining'?'':'none';
  $id('miningHead').style.display=cfg.mode==='mining'?'':'none';
  $id('tierRow').style.display=cfg.mode==='factory'?'':'none';
  $id('prodRow').style.display=cfg.mode==='factory'?'':'none';
  $id('trunkRow').style.display=layoutSubOf(cfg)==='full'?'none':'';
  $id('mapRow').style.display=cfg.ver.id==='new'?'':'none';
  $id('resSupplyHead').style.display=cfg.mode==='mining'?'':'none';
  $id('resSupply').style.display=cfg.mode==='mining'?'':'none';
  $id('resFactoryHead').style.display=cfg.mode==='factory'?'':'none';
  $id('resFactory').style.display=cfg.mode==='factory'?'':'none';
  $id('chainDepthRow').style.display=cfg.layout==='chain'?'':'none';

  const storInput=$id('nStor');
  if(cfg.mode==='mining'){
    storInput.min='1';
    if(parseInt(storInput.value,10)<1) storInput.value='1';
  }else{
    storInput.min='0';
  }

  const lpadInput=$id('nLpad');
  lpadInput.min='1';
  if(parseInt(lpadInput.value,10)<1) lpadInput.value='1';
}

function renderSummary(r){
  let h='<tr><th class="l">Item</th><th>CPU</th><th>PG</th></tr>';
  for(const s of r.structs) h+=`<tr><td class="l">${s.name}</td><td class="mono">${fmt(s.cpu)}</td><td class="mono">${fmt(s.pg)}</td></tr>`;
  h+=`<tr><td class="l">Link construction</td><td class="mono">${fmt(r.lCpu)}</td><td class="mono">${fmt(r.lPg)}</td></tr>`;
  h+=`<tr><td class="l">Link upgrades</td><td class="mono">${fmt(r.uCpu)}</td><td class="mono">${fmt(r.uPg)}</td></tr>`;
  h+=`<tr><td class="l big">Total</td><td class="mono big">${fmt(r.totCpu)}</td><td class="mono big">${fmt(r.totPg)}</td></tr>`;
  h+=`<tr><td class="l">CCU${r.cfg.ccu} budget</td><td class="mono">${fmt(r.budget.cpu)}</td><td class="mono">${fmt(r.budget.pg)}</td></tr>`;
  h+=`<tr><td class="l">Remaining</td><td class="mono ${r.cpuOk?'ok':'bad'}">${fmt(r.cpuLeft)}</td><td class="mono ${r.pgOk?'ok':'bad'}">${fmt(r.pgLeft)}</td></tr>`;
  $id('resSummary').innerHTML=h;
}

function renderStatus(r){
  const parts=[];
  parts.push(`CPU <span class="${r.cpuOk?'ok':'bad'}">${r.cpuOk?'OK':'Over'}</span>`);
  parts.push(`PG <span class="${r.pgOk?'ok':'bad'}">${r.pgOk?'OK':'Over'}</span>`);
  let msg='';
  if(r.cpuOk&&r.pgOk) msg='<span class="ok">✓ Fits</span>';
  else msg='<span class="bad">✗ Over budget</span>';
  $id('resStatus').innerHTML=parts.join('　 ') + ' — ' + msg;
}

function renderLinks(r, cfg){
  let h='<tr><th class="l">Link</th><th>#</th><th>Flow</th><th>Need m³/h</th><th>Cap m³/h</th><th>Lvl</th><th>Use</th></tr>';
  for(const x of r.rows){
    h+=`<tr><td class="l">${x.name}</td><td>${x.count}</td><td class="mono">${fmt(x.flow)}</td><td class="mono">${fmt1(x.req)}</td><td class="mono">${fmt(x.cap)}</td><td class="mono ${x.ok?'':'bad'}">${x.lvl}</td><td class="mono ${x.used>100?'bad':x.used>85?'warn':''}">${Math.round(x.used)}%</td></tr>`;
  }
  $id('resLinks').innerHTML=h;
}

function renderSupply(r, cfg){
  const demand=cfg.nFact*MINING_IN;
  const y=cfg.yield;
  const surplus=y-demand;
  let h=`<table><tr><th class="l">Item</th><th>Value</th></tr>`;
  h+=`<tr><td class="l">Factory demand/day</td><td class="mono">${fmt(demand)}</td></tr>`;
  h+=`<tr><td class="l">Est. yield P0/day</td><td class="mono">${fmt(y)}</td></tr>`;
  h+=`<tr><td class="l">Daily surplus/deficit</td><td class="mono ${surplus>=0?'ok':'bad'}">${surplus>=0?'+':''}${fmt(surplus)}</td></tr>`;
  if(surplus>=0) h+=`<tr><td class="l">Supply status</td><td><span class="tag tag-ok">Adequate</span></td></tr>`;
  else h+=`<tr><td class="l">Supply status</td><td><span class="tag tag-bad">Insufficient</span></td></tr>`;
  h+=`</table>`;
  $id('resSupply').innerHTML=h;
}

function renderFactory(cfg){
  const t=TIERS[cfg.tier];
  const inVol=cfg[t.inV], outVol=cfg[t.outV];
  let h=`<table><tr><th class="l">Item</th><th>Per factory/day</th><th>${cfg.nFact} factories/day</th></tr>`;
  h+=`<tr><td class="l">Input ${t.label}</td><td class="mono">${fmt(t.in)}</td><td class="mono">${fmt(t.in*cfg.nFact)}</td></tr>`;
  h+=`<tr><td class="l">Output</td><td class="mono">${fmt(t.out)}</td><td class="mono">${fmt(t.out*cfg.nFact)}</td></tr>`;
  h+=`</table>`;
  $id('resFactory').innerHTML=h;
}

function renderTemplateView(r, cfg){
  const chips=[
    `Mode: ${cfg.mode==='mining'?'Mining P0->P1':'Factory'}`,
    `Planet: ${(PLANETS[cfg.pln]||PLANETS[2015]).name}`,
    `Layout: ${SUB_LABEL[layoutSubOf(cfg)]||layoutSubOf(cfg)}`,
    `CCU: ${cfg.ccu}`,
    `Radius: ${fmt(cfg.radius)} km`,
  ];

  let structures='';
  structures+='<table><tr><th class="l">Structures</th><th>CPU</th><th>PG</th></tr>';
  for(const s of r.structs){
    structures+=`<tr><td class="l">${s.name}</td><td class="mono">${fmt(s.cpu)}</td><td class="mono">${fmt(s.pg)}</td></tr>`;
  }
  structures+=`<tr><td class="l"><strong>Structure Total</strong></td><td class="mono"><strong>${fmt(r.sCpu)}</strong></td><td class="mono"><strong>${fmt(r.sPg)}</strong></td></tr>`;
  structures+=`<tr><td class="l">CCU${cfg.ccu} Remainder (structures)</td><td class="mono ${r.budget.cpu-r.sCpu>=0?'ok':'bad'}">${fmt(r.budget.cpu-r.sCpu)}</td><td class="mono ${r.budget.pg-r.sPg>=0?'ok':'bad'}">${fmt(r.budget.pg-r.sPg)}</td></tr>`;
  structures+='</table>';

  let totals='';
  totals+='<table><tr><th class="l">Template Totals</th><th>CPU</th><th>PG</th></tr>';
  totals+=`<tr><td class="l">Link construction</td><td class="mono">${fmt(r.lCpu)}</td><td class="mono">${fmt(r.lPg)}</td></tr>`;
  totals+=`<tr><td class="l">Link upgrades</td><td class="mono">${fmt(r.uCpu)}</td><td class="mono">${fmt(r.uPg)}</td></tr>`;
  totals+=`<tr><td class="l"><strong>Grand Total</strong></td><td class="mono"><strong>${fmt(r.totCpu)}</strong></td><td class="mono"><strong>${fmt(r.totPg)}</strong></td></tr>`;
  totals+=`<tr><td class="l">CCU${cfg.ccu} Budget</td><td class="mono">${fmt(r.budget.cpu)}</td><td class="mono">${fmt(r.budget.pg)}</td></tr>`;
  totals+=`<tr><td class="l">CCU${cfg.ccu} Remainder (all)</td><td class="mono ${r.cpuOk?'ok':'bad'}">${fmt(r.cpuLeft)}</td><td class="mono ${r.pgOk?'ok':'bad'}">${fmt(r.pgLeft)}</td></tr>`;
  totals+='</table>';

  let note='';
  if(cfg.mode==='mining' && cfg.ccu===5 && cfg.nHead>=16 && cfg.radius>15000){
    note='Warning: con CCU5 e 16+ heads per ECU, pianeti oltre 15,000 km tendono a saturare il PG (coerente con README).';
  }else if(cfg.mode==='factory' && cfg.ccu===5 && cfg.nFact>=24 && cfg.radius>12500){
    note='Warning: con setup factory denso (24+), oltre 12,500 km il costo link tende a superare il budget CCU5 (coerente con README).';
  }else if(r.cpuOk && r.pgOk){
    note='Template in range: CPU e PG rientrano nel budget selezionato.';
  }else{
    note='Template over budget: riduci factories/head oppure aumenta CCU.';
  }

  let html='';
  html+=`<div>${chips.map(c=>`<span class="template-view-chip">${c}</span>`).join('')}</div>`;
  html+='<div class="template-view-grid">';
  html+=`<div>${structures}</div>`;
  html+=`<div>${totals}</div>`;
  html+='</div>';
  html+=`<div class="template-view-note ${r.cpuOk&&r.pgOk?'ok':''}">${note}</div>`;
  $id('resTemplateView').innerHTML=html;
}

function classifyPinType(pinType, planetType){
  const pl=PLANETS[planetType]||PLANETS[2015];
  if(pinType===pl.ecu) return 'ECU';
  if(pinType===pl.stor) return 'Storage';
  if(pinType===pl.lp) return 'Launchpad';
  if(pinType===pl.basic) return 'Basic Factory';
  if(pinType===pl.adv || pinType===PLANETS[2016].adv) return 'Advanced Factory';
  if(pinType===pl.ht || pinType===PLANETS[2016].ht) return 'High-Tech Factory';
  return 'Other';
}

function commodityNameFromTypeId(typeId){
  if(typeId==null) return '';
  for(const r of MINING_RES){
    if(r.p0===typeId) return r.p0n;
    if(r.p1===typeId) return r.p1n;
  }
  const prod=PRODUCTS.find(p=>p.id===typeId);
  return prod?prod.name:'';
}

function pinLabel(pin, kind){
  const commodity=commodityNameFromTypeId(pin.S);
  if(kind==='ECU'){
    return commodity?`ECU - ${commodity}`:'ECU';
  }
  if(kind==='Basic Factory' || kind==='Advanced Factory' || kind==='High-Tech Factory'){
    return commodity?`${kind} - ${commodity}`:kind;
  }
  return kind;
}

function graphColor(kind){
  if(kind==='ECU') return '#b85c3f';
  if(kind==='Storage') return '#50657a';
  if(kind==='Launchpad') return '#2d8a75';
  if(kind==='Basic Factory') return '#75608f';
  if(kind==='Advanced Factory') return '#c38a2d';
  if(kind==='High-Tech Factory') return '#bd5b45';
  return '#64727d';
}

function spreadCoincidentPins(points){
  const groups=new Map();
  for(let i=0;i<points.length;i++){
    const p=points[i];
    const key=`${p.x.toFixed(4)}:${p.y.toFixed(4)}`;
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(i);
  }
  for(const idxs of groups.values()){
    if(idxs.length<=1) continue;
    const radius=12;
    for(let k=0;k<idxs.length;k++){
      const a=(2*Math.PI*k)/idxs.length;
      points[idxs[k]].x+=Math.cos(a)*radius;
      points[idxs[k]].y+=Math.sin(a)*radius;
    }
  }
}

function renderTemplateSchema(tpl){
  const svg=$id('templateGraph');
  const legend=$id('resTemplateLegend');
  if(!svg || !legend) return;
  if(!tpl || !Array.isArray(tpl.P) || !Array.isArray(tpl.L) || !tpl.P.length){
    svg.setAttribute('viewBox','0 0 980 160');
    svg.innerHTML='<text x="24" y="84" fill="var(--muted)" font-size="14" font-family="Trebuchet MS, sans-serif">Template vuoto: aumenta strutture o usa una configurazione valida per generare nodi e link.</text>';
    legend.innerHTML='<span class="template-legend-item">Pins: 0</span><span class="template-legend-item">Links: 0</span>';
    return;
  }

  const W=980, H=560, PAD=54;
  const minLa=Math.min(...tpl.P.map(p=>p.La));
  const maxLa=Math.max(...tpl.P.map(p=>p.La));
  const minLo=Math.min(...tpl.P.map(p=>p.Lo));
  const maxLo=Math.max(...tpl.P.map(p=>p.Lo));
  const dLa=Math.max(0.00001, maxLa-minLa);
  const dLo=Math.max(0.00001, maxLo-minLo);

  const pts=tpl.P.map((p, idx)=>{
    const x=PAD+((p.Lo-minLo)/dLo)*(W-PAD*2);
    const y=PAD+((maxLa-p.La)/dLa)*(H-PAD*2);
    const kind=classifyPinType(p.T, tpl.Pln);
    return {idx:idx+1, x, y, kind, label:pinLabel(p, kind)};
  });
  spreadCoincidentPins(pts);

  const byIndex=new Map(pts.map(p=>[p.idx,p]));
  const kinds=[...new Set(pts.map(p=>p.kind))];

  let out='';
  out+=`<rect x="0" y="0" width="${W}" height="${H}" fill="transparent"></rect>`;

  for(const l of tpl.L){
    const s=byIndex.get(l.S), d=byIndex.get(l.D);
    if(!s || !d) continue;
    out+=`<line class="tpl-edge" data-s="${l.S}" data-d="${l.D}" x1="${s.x.toFixed(2)}" y1="${s.y.toFixed(2)}" x2="${d.x.toFixed(2)}" y2="${d.y.toFixed(2)}"></line>`;
  }

  for(const p of pts){
    const c=graphColor(p.kind);
    const labelText=p.label.length>30?`${p.label.slice(0,29)}...`:p.label;
    out+=`<g class="tpl-node" data-idx="${p.idx}">`;
    out+=`<title>${p.label}</title>`;
    out+=`<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="9" fill="${c}" stroke="#1a252e" stroke-width="1"></circle>`;
    out+=`<text x="${(p.x+12).toFixed(2)}" y="${(p.y+4).toFixed(2)}" fill="var(--ink)" font-size="11" font-family="Trebuchet MS, sans-serif">${labelText}</text>`;
    out+='</g>';
  }

  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.innerHTML=out;

  const edgeEls=[...svg.querySelectorAll('.tpl-edge')];
  const nodeEls=[...svg.querySelectorAll('.tpl-node')];
  const pointByIdx=new Map(pts.map(p=>[String(p.idx),p]));
  let dragIdx=null;
  let dragging=false;
  let lockedNode=null;

  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
  function clientToSvg(clientX, clientY){
    const r=svg.getBoundingClientRect();
    const sx=(clientX-r.left)/Math.max(1,r.width);
    const sy=(clientY-r.top)/Math.max(1,r.height);
    return {x:sx*W, y:sy*H};
  }
  function svgToGeo(x,y){
    const nx=clamp((x-PAD)/(W-PAD*2),0,1);
    const ny=clamp((y-PAD)/(H-PAD*2),0,1);
    return {
      lo:minLo + nx*dLo,
      la:maxLa - ny*dLa,
    };
  }
  function updateNodeDom(idx){
    const node=svg.querySelector(`.tpl-node[data-idx="${idx}"]`);
    const p=pointByIdx.get(String(idx));
    if(!node || !p) return;
    const circle=node.querySelector('circle');
    const text=node.querySelector('text');
    if(circle){ circle.setAttribute('cx', p.x.toFixed(2)); circle.setAttribute('cy', p.y.toFixed(2)); }
    if(text){ text.setAttribute('x', (p.x+12).toFixed(2)); text.setAttribute('y', (p.y+4).toFixed(2)); }
  }
  function updateEdgesForIdx(idx){
    for(const e of edgeEls){
      const s=e.dataset.s, d=e.dataset.d;
      if(s!==String(idx) && d!==String(idx)) continue;
      const ps=pointByIdx.get(s), pd=pointByIdx.get(d);
      if(!ps || !pd) continue;
      e.setAttribute('x1', ps.x.toFixed(2));
      e.setAttribute('y1', ps.y.toFixed(2));
      e.setAttribute('x2', pd.x.toFixed(2));
      e.setAttribute('y2', pd.y.toFixed(2));
    }
  }

  function applyHighlight(nodeIdx){
    const hasFocus=!!nodeIdx;
    for(const e of edgeEls){
      const connected=String(e.dataset.s)===String(nodeIdx) || String(e.dataset.d)===String(nodeIdx);
      e.classList.toggle('is-active', hasFocus && connected);
      e.classList.toggle('is-dim', hasFocus && !connected);
    }
    for(const n of nodeEls){
      const idx=n.dataset.idx;
      const connectedToAnyEdge=edgeEls.some(e=>
        (String(e.dataset.s)===String(idx) && String(e.dataset.d)===String(nodeIdx)) ||
        (String(e.dataset.d)===String(idx) && String(e.dataset.s)===String(nodeIdx)) ||
        String(idx)===String(nodeIdx)
      );
      n.classList.toggle('is-active', hasFocus && String(idx)===String(nodeIdx));
      n.classList.toggle('is-dim', hasFocus && !connectedToAnyEdge);
    }
  }

  for(const n of nodeEls){
    n.addEventListener('pointerdown',(ev)=>{
      dragIdx=n.dataset.idx;
      dragging=true;
      n.setPointerCapture?.(ev.pointerId);
      ev.preventDefault();
    });
    n.addEventListener('pointermove',(ev)=>{
      if(!dragging || dragIdx!==n.dataset.idx) return;
      const pos=clientToSvg(ev.clientX, ev.clientY);
      const p=pointByIdx.get(String(dragIdx));
      if(!p) return;
      p.x=clamp(pos.x, PAD, W-PAD);
      p.y=clamp(pos.y, PAD, H-PAD);
      updateNodeDom(dragIdx);
      updateEdgesForIdx(dragIdx);
      const geo=svgToGeo(p.x,p.y);
      const pin=tpl.P[Number(dragIdx)-1];
      if(pin){ pin.La=+geo.la.toFixed(5); pin.Lo=+geo.lo.toFixed(5); }
      storeManualOverridesFromTemplate(tpl);
      renderExportTemplate(tpl);
    });
    n.addEventListener('pointerup',(ev)=>{
      if(dragIdx===n.dataset.idx){
        dragging=false;
        dragIdx=null;
        n.releasePointerCapture?.(ev.pointerId);
      }
    });
    n.addEventListener('pointercancel',(ev)=>{
      if(dragIdx===n.dataset.idx){
        dragging=false;
        dragIdx=null;
        n.releasePointerCapture?.(ev.pointerId);
      }
    });
    n.addEventListener('mouseenter',()=>{ if(!lockedNode) applyHighlight(n.dataset.idx); });
    n.addEventListener('mouseleave',()=>{ if(!lockedNode) applyHighlight(null); });
    n.addEventListener('click',()=>{
      if(dragging) return;
      if(lockedNode===n.dataset.idx){
        lockedNode=null;
        applyHighlight(null);
      }else{
        lockedNode=n.dataset.idx;
        applyHighlight(lockedNode);
      }
    });
  }

  svg.addEventListener('mouseleave',()=>{ if(!lockedNode) applyHighlight(null); });

  legend.innerHTML=kinds.map(k=>`<span class="template-legend-item"><span class="template-legend-dot" style="background:${graphColor(k)}"></span>${k}</span>`).join('')+
    `<span class="template-legend-item">Pins: ${tpl.P.length}</span><span class="template-legend-item">Links: ${tpl.L.length}</span>`;
}

function maxFeasibleN(cfg){
  let best=-1;
  for(let N=0;N<=40;N++){
    const c2={...cfg, nFact:N};
    const r=evaluate(c2,true);
    if(r.cpuOk&&r.pgOk) best=N; else break;
  }
  return best;
}

function renderMaxN(cfg){
  const rows=[];
  for(let c=0;c<=5;c++){
    const best=maxFeasibleN({...cfg, ccu:c});
    rows.push({ccu:c, max:best});
  }
  let h=`<tr><th>CCU</th><th>Budget CPU</th><th>Budget PG</th><th>Max N</th></tr>`;
  for(const r of rows){
    const b=CCU_BUDGET[r.ccu];
    h+=`<tr><td class="mono">${r.ccu}</td><td class="mono">${fmt(b.cpu)}</td><td class="mono">${fmt(b.pg)}</td><td class="mono">${r.max<0?'—':r.max}</td></tr>`;
  }
  $id('resMaxN').innerHTML=h;
}

function renderExport(cfg){
  renderExportTemplate(getActiveTemplate(cfg));
}

function renderExportTemplate(tpl){
  try{
    $id('resExport').textContent=serializeGame(tpl);
  }catch(e){
    $id('resExport').textContent='Generation failed: '+e.message;
  }
}

function update(){
  if($id('segAuto').checked){
    const auto=$id('layout').value==='star'?1.0:0.8;
    if(parseFloat($id('seg').value)!==auto) $id('seg').value=auto;
  }
  populateLayoutSub();
  let cfg=readCfg();
  if($id('nAuto').checked){
    let maxN=maxFeasibleN(cfg);
    if(cfg.mode==='mining'){
      // Keep daily surplus strictly positive: yield - (nFact * MINING_IN) > 0
      const maxBySupply=Math.max(0, Math.floor((cfg.yield-1)/MINING_IN));
      maxN=Math.min(maxN, maxBySupply);
    }
    if(maxN>=0 && cfg.nFact!==maxN){
      $id('nFact').value=maxN;
      cfg=readCfg();
    }
  }
  $id('nFact').disabled=$id('nAuto').checked;
  const ver=cfg.ver;
  populateFactoryProd();
  for(const id of ['upgEcu','upgTrunk','upgOther']) syncUpgOptions(id, ver.levels.length-1);
  const r=evaluate(cfg,false);
  const tpl=getActiveTemplate(cfg);
  renderSummary(r);
  renderStatus(r);
  renderLinks(r, cfg);
  renderSupply(r, cfg);
  renderFactory(cfg);
  renderTemplateSchema(tpl);
  renderMaxN(cfg);
  renderExportTemplate(tpl);
  showHide(cfg);
}

/* ================= Event Binding ================= */
const bindIds=['ccu','mode','tier','pln','miningRes','factoryProd','nFact','nAuto','nStor','nLpad','nEcu','nHead','yield','radius','layout','layoutSub','chainDepth','seg','segAuto','linkVer','mapMode','upgEcu','upgTrunk','upgOther','vP0','vP1','vP2','vP3','vP4'];
function bindLiveUpdate(id){
  const el=$id(id);
  if(!el) return;
  const handler=()=>{ update(); saveCalculatorState(); };
  el.addEventListener('input',handler);
  el.addEventListener('change',handler);
}
for(const id of bindIds) bindLiveUpdate(id);
$id('btnExport').addEventListener('click',exportJSON);
$id('btnCopy').addEventListener('click',copyJSON);
$id('btnPaste').addEventListener('click',pasteJsonFromClipboard);
$id('btnValidate').addEventListener('click',validateJsonInput);
$id('btnApplyImport').addEventListener('click',applyImportedJson);
$id('jsonFile').addEventListener('change',(event)=>loadJsonFile(event.target.files[0]));
$id('jsonInput').addEventListener('input',validateJsonInput);
$id('themeToggle').addEventListener('change',saveTheme);

window.addEventListener('DOMContentLoaded',()=>{
  populateMiningRes();
  populateLayoutSub();
  populateFactoryProd();
  restoreTheme();
  restoreCalculatorState();
  applyTransferredJsonIfPresent();
  update();
  saveCalculatorState();
});
