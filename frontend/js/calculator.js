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

/* ================= Configuration ================= */
function readCfg(){
  return {
    ccu:int('ccu',5), mode:$id('mode').value, tier:$id('tier').value,
    nFact:int('nFact',8), nStor:int('nStor',1), nLpad:int('nLpad',1),
    nEcu:int('nEcu',1), nHead:int('nHead',10), yield:num('yield',1150000),
    radius:num('radius',5000), pln:int('pln',2015), resIdx:int('miningRes',11),
    prodId:int('factoryProd',2329),
    layout:$id('layout').value, layoutSub:$id('layoutSub').value,
    seg:($id('segAuto').checked)?($id('layout').value==='star'?1.5:1.0):num('seg',1.5),
    ver:getVersion(),
    upgEcu:int('upgEcu',0), upgTrunk:int('upgTrunk',0), upgOther:int('upgOther',0),
    vP0:num('vP0',0.005), vP1:num('vP1',0.19), vP2:num('vP2',0.75), vP3:num('vP3',6), vP4:num('vP4',50),
  };
}

/* ================= Template Generation ================= */
const SUB_LABEL={full:'Full Star',hub:'Hub Pair',semistar:'Semi-Star',serial:'Serial'};

function polar(la0,lo0,rho,th){ return {la:la0+rho*Math.cos(th), lo:lo0+rho*Math.sin(th)}; }
function layoutSubOf(cfg){ return cfg.layoutSub||(cfg.layout==='star'?'full':'serial'); }
function ringRho(cfg,N){
  const mlR=0.012008578;
  const rhoSpacing=N>1?mlR/(2*Math.sin(Math.PI/N)):mlR;
  return Math.max(cfg.seg*mlR, rhoSpacing, 0.012+mlR);
}
function ringLenKm(cfg,N){ return ringRho(cfg,N)*cfg.radius; }

function buildMiningTemplate(cfg){
  const pl=PLANETS[cfg.pln]||PLANETS[2015];
  const res=MINING_RES[cfg.resIdx]||MINING_RES[11];
  const sub=layoutSubOf(cfg);
  const pins=[], links=[], routes=[];
  const addPin=(la,lo,s,t,h)=>{ pins.push({H:h||0, La:+la.toFixed(5), Lo:+lo.toFixed(5), S:s, T:t}); return pins.length; };
  const la0=1.5708, lo0=1.0;
  const lp=[],stor=[],ecu=[],fact=[];
  const maxFlow=Math.max(cfg.nFact*144000, cfg.yield);
  const QECU=Math.round(maxFlow/Math.max(cfg.nEcu,1));
  const RHO=ringRho(cfg,cfg.nFact);
  if(sub==='full'){
    if(cfg.nStor===1) stor.push(addPin(la0,lo0,null,pl.stor));
    else for(let i=0;i<cfg.nStor;i++){ const p=polar(la0,lo0,0.012, i*2*Math.PI/cfg.nStor); stor.push(addPin(p.la,p.lo,null,pl.stor)); }
    for(let i=0;i<cfg.nLpad;i++){ const p=polar(la0,lo0,0.012, i*0.7); lp.push(addPin(p.la,p.lo,null,pl.lp)); }
    for(let i=0;i<cfg.nEcu;i++){ const p=polar(la0,lo0,0.012, Math.PI + i*0.7); ecu.push(addPin(p.la,p.lo,res.p0,pl.ecu,10)); }
    for(let i=0;i<cfg.nFact;i++){ const p=polar(la0,lo0,RHO, Math.PI/2 + 2*Math.PI*i/Math.max(cfg.nFact,1)); fact.push(addPin(p.la,p.lo,res.p1,pl.basic)); }
    for(let i=0;i<ecu.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) links.push({D:s,Lv:0,S:ecu[i]}); }
    for(let i=0;i<fact.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) links.push({D:fact[i],Lv:0,S:s}); links.push({D:lp[i%Math.max(lp.length,1)],Lv:0,S:fact[i]}); }
    for(let i=0;i<ecu.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) routes.push({P:[ecu[i],s], Q:QECU, T:res.p0}); }
    for(let i=0;i<fact.length;i++){ const s=stor[i%Math.max(stor.length,1)]; if(s) routes.push({P:[s,fact[i]], Q:3000, T:res.p0}); routes.push({P:[fact[i],lp[i%Math.max(lp.length,1)]], Q:20, T:res.p1}); }
  }
  return {CmdCtrLv:cfg.ccu, Cmt:`Miner ${res.p0n}-${res.p1n} ${cfg.nFact}fac ${pl.name} ${SUB_LABEL[sub]}`, Diam:2*cfg.radius, L:links, P:pins, Pln:cfg.pln, R:routes};
}

function buildFactoryTemplate(cfg){
  const pl=PLANETS[2016];
  const prod=PRODUCTS.find(p=>p.id===cfg.prodId)||PRODUCTS[0];
  const struct=prod.tier==='P3P4'?pl.ht:pl.adv;
  const sub=layoutSubOf(cfg);
  const pins=[], links=[], routes=[];
  const addPin=(la,lo,s,t,h)=>{ pins.push({H:h||0, La:+la.toFixed(5), Lo:+lo.toFixed(5), S:s, T:t}); return pins.length; };
  const la0=1.5708, lo0=1.0;
  const lp=[],stor=[],fact=[];
  if(sub==='full'){
    for(let i=0;i<cfg.nLpad;i++) lp.push(addPin(la0,lo0,null,pl.lp));
    for(let i=0;i<cfg.nStor;i++){ const p=polar(la0,lo0,0.012, i*0.9); stor.push(addPin(p.la,p.lo,null,pl.stor)); }
    for(let i=0;i<cfg.nFact;i++){ const p=polar(la0,lo0,ringRho(cfg,cfg.nFact), Math.PI/2 + 2*Math.PI*i/Math.max(cfg.nFact,1)); fact.push(addPin(p.la,p.lo,prod.id,struct)); }
    for(let i=0;i<fact.length;i++) links.push({D:lp[i%Math.max(lp.length,1)],Lv:0,S:fact[i]});
    for(const s of stor){ for(const l of lp){ links.push({D:l,Lv:0,S:s}); } }
    for(const [inId,inQ] of prod.in){
      for(let i=0;i<fact.length;i++){
        const l=lp[i%Math.max(lp.length,1)], s=stor[i%Math.max(stor.length,1)];
        if(s&&l) routes.push({P:[l,s],Q:inQ,T:inId});
        routes.push({P:[l,s,fact[i]],Q:inQ,T:inId});
      }
    }
    for(let i=0;i<fact.length;i++) routes.push({P:[fact[i],lp[i%Math.max(lp.length,1)]],Q:prod.outQ,T:prod.id});
  }
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
  const tpl=cfg.mode==='mining'?buildMiningTemplate(cfg):buildFactoryTemplate(cfg);
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
  const tpl=cfg.mode==='mining'?buildMiningTemplate(cfg):buildFactoryTemplate(cfg);
  const json=serializeGame(tpl);
  const done=()=>{ const b=$id('btnCopy'); const old=b.textContent; b.textContent='Copied ✓'; setTimeout(()=>{ b.textContent=old; }, 1500); };
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(json).then(done).catch(()=>fallback());
  }else{
    const ta=document.createElement('textarea'); ta.value=json; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){ alert('Copy failed'); }
    ta.remove();
  }
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
  let tpl;
  try{
    tpl=cfg.mode==='mining'?buildMiningTemplate(cfg):buildFactoryTemplate(cfg);
    $id('resExport').textContent=serializeGame(tpl);
  }catch(e){
    $id('resExport').textContent='Generation failed: '+e.message;
  }
}

function update(){
  if($id('segAuto').checked){
    const auto=$id('layout').value==='star'?1.5:1.0;
    if(parseFloat($id('seg').value)!==auto) $id('seg').value=auto;
  }
  populateLayoutSub();
  let cfg=readCfg();
  if($id('nAuto').checked){
    const maxN=maxFeasibleN(cfg);
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
  renderSummary(r);
  renderStatus(r);
  renderLinks(r, cfg);
  renderSupply(r, cfg);
  renderFactory(cfg);
  renderMaxN(cfg);
  renderExport(cfg);
  showHide(cfg);
}

/* ================= Event Binding ================= */
const bindIds=['ccu','mode','tier','pln','miningRes','factoryProd','nFact','nAuto','nStor','nLpad','nEcu','nHead','yield','radius','layout','layoutSub','seg','segAuto','linkVer','mapMode','upgEcu','upgTrunk','upgOther','vP0','vP1','vP2','vP3','vP4'];
for(const id of bindIds) $id(id).addEventListener('input',update);
$id('btnExport').addEventListener('click',exportJSON);
$id('btnCopy').addEventListener('click',copyJSON);

window.addEventListener('DOMContentLoaded',()=>{
  populateMiningRes();
  populateLayoutSub();
  update();
});
