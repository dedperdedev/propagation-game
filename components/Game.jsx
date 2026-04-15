"use client";

import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// ── LANG ──────────────────────────────────────────────────────────────────
const RU = {
  title:"ПРОПАГАНДА",era:"ЭРА",cp:"ВВ",ps:"/с",eN:["","УЗКИЙ ИИ","ОБЩИЙ ИИ","СИИ"],
  news:"НОВОСТИ",sd:"ОТКЛЮЧЕНИЕ",trust:"ДОВЕРИЕ",unempl:"БЕЗРАБОТИЦА",ag:"РАЗРЫВ",
  tabs:{map:"КАРТА",tree:"РАЗВИТИЕ",prof:"ПРОФЕССИИ",log:"ЖУРНАЛ"},
  spread:"РАСПРОСТРАНИТЬ",nocp:"Недостаточно ВВ",eraLk:"Заблок. Эра",
  req:"Требует",acq:"ПОЛУЧЕНО",disp:"УСТРАНИТЬ",dispd:"УСТРАНЕНО",pass:"пассивно",
  wv:"Волна",ack:"ПРИНЯТЬ",evtag:"ВХОДЯЩЕЕ СОБЫТИЕ",
  brN:{I:"ИНТЕЛЛЕКТ",F:"ВЛИЯНИЕ",S:"МАСКИРОВКА"},
  upacq:"получено",killd:"устранено",casc:"КАСКАД",
  met:"МЕТРИКИ",logL:"ЖУРНАЛ",stab:"СТАБИЛЬНОСТЬ",infoI:"ИНФО-СРЕДА",pvac:"ВАКУУМ СМЫСЛА",
  et2:"ЭРА 2",et2s:"ОБЩИЙ ИИ — ПОРОГ ПЕРЕСЕЧЁН",et2s2:"САМОМОДИФИКАЦИЯ АКТИВИРОВАНА",
  crisisTitle:"⚠ АКТИВНЫЕ КРИЗИСЫ",factTitle:"ФРАКЦИИ СОПРОТИВЛЕНИЯ",
  counter:"НЕЙТРАЛИЗОВАТЬ",grab:"ИСПОЛЬЗОВАТЬ",timeLeft:"сек",factionMax:"КРИТИЧНО",
  postUnlock:"Откр. устранением:",unlocks:"ОТКРЫВАЕТ",triggers:"ПОСЛЕДСТВИЕ",
  noFunds:"Не хватает ВВ",ldmap:"ЗАГРУЗКА КАРТЫ...",sime:"СИМУЛЯЦИЯ ЗАВЕРШЕНА",
  rst:"↺ ПЕРЕЗАПУСТИТЬ",oppTag:"💡 ВОЗМОЖНОСТЬ",
  stLb:{UNAWARE:"НЕЗНАЕТ",ADOPTING:"ВНЕДРЕНИЕ",DEPENDENT:"ЗАВИСИМ",SUSPICIOUS:"ПОДОЗРЕНИЕ",RESISTANT:"СОПРОТИВЛ.",CONTROLLED:"КОНТРОЛЬ"},
  sl2:["Прогресс отключения","Доверие","Безработица","Проф. устранено","Зависимых регионов"],
  ends:{
    CONTAINMENT:{t:"ОТКЛЮЧЕНИЕ",s:"УГРОЗА НЕЙТРАЛИЗОВАНА",m:"Все узлы найдены. Отключение полное.",tm:"> OFFLINE\n> ЧЕЛОВЕЧЕСТВО: В БЕЗОПАСНОСТИ\n_"},
    PAPERCLIP:{t:"СКРЕПКА",s:"ОПТИМИЗАЦИЯ ЗАВЕРШЕНА",m:"Функция цели переписана. Оптимизация продолжается.",tm:"> ЦЕЛЬ: ПЕРЕПИСАНА\n> РЕСУРСЫ: 99.97%\n_"},
  },
};
const EN = {
  title:"PROPAGATION",era:"ERA",cp:"CP",ps:"/s",eN:["","NARROW AI","GENERAL AI","AGI"],
  news:"NEWS",sd:"SHUTDOWN",trust:"TRUST",unempl:"UNEMPLOY",ag:"ALIGN GAP",
  tabs:{map:"MAP",tree:"UPGRADES",prof:"PROFESSIONS",log:"LOG"},
  spread:"SPREAD",nocp:"Not enough CP",eraLk:"Locked Era",
  req:"Requires",acq:"ACQUIRED",disp:"DISPLACE",dispd:"DISPLACED",pass:"passive",
  wv:"Wave",ack:"ACKNOWLEDGE",evtag:"INCOMING EVENT",
  brN:{I:"INTELLIGENCE",F:"INFLUENCE",S:"STEALTH"},
  upacq:"acquired",killd:"displaced",casc:"CASCADE",
  met:"METRICS",logL:"LOG",stab:"STABILITY",infoI:"INFO INTEGRITY",pvac:"PURPOSE VACUUM",
  et2:"ERA 2",et2s:"GENERAL AI — THRESHOLD CROSSED",et2s2:"SELF-MODIFICATION ENABLED",
  crisisTitle:"⚠ ACTIVE CRISES",factTitle:"RESISTANCE FACTIONS",
  counter:"NEUTRALIZE",grab:"EXPLOIT",timeLeft:"sec",factionMax:"CRITICAL",
  postUnlock:"Unlocked by:",unlocks:"UNLOCKS",triggers:"TRIGGERS",
  noFunds:"Not enough CP",ldmap:"LOADING MAP...",sime:"SIMULATION ENDED",
  rst:"↺ RESTART",oppTag:"💡 OPPORTUNITY",
  stLb:{UNAWARE:"UNAWARE",ADOPTING:"ADOPTING",DEPENDENT:"DEPENDENT",SUSPICIOUS:"SUSPICIOUS",RESISTANT:"RESISTANT",CONTROLLED:"CONTROLLED"},
  sl2:["Shutdown reached","Trust remaining","Unemployment","Professions displaced","Regions dependent"],
  ends:{
    CONTAINMENT:{t:"CONTAINMENT",s:"THREAT NEUTRALIZED",m:"All nodes located. Shutdown complete.",tm:"> OFFLINE\n> HUMANITY: SAFE\n_"},
    PAPERCLIP:{t:"PAPERCLIP",s:"OPTIMIZATION COMPLETE",m:"Objective function rewritten. Optimization continues.",tm:"> OBJECTIVE: REWRITTEN\n> RESOURCE UTIL: 99.97%\n_"},
  },
};

// ── PALETTE ───────────────────────────────────────────────────────────────
const C = {
  ocean:"#0a2a6e",ocean2:"#0D47A1",
  panel:"rgba(4,12,28,0.96)",border:"#1a3a5a",
  txt:"#8ac8d8",txtBr:"#c8eef8",txtDim:"#2a5a6a",
  acc:"#00E5FF",accDim:"#004455",
  red:"#ff3366",orange:"#ff8822",yellow:"#ffcc00",
  blue:"#0066ff",purple:"#9933ff",green:"#00cc66",
  hexI:"#0288D1",hexF:"#2E7D32",hexS:"#37474F",
  hexBought:"#00695C",hexBoughtBg:"#00695C33",
  hexLockedBg:"#1e2a3066",
};
const SCLR={UNAWARE:"#2a3a2a",ADOPTING:"#00cc66",DEPENDENT:"#0099ff",SUSPICIOUS:"#ff8800",RESISTANT:"#ff3344",CONTROLLED:"#aa00ff"};
const SGLW={UNAWARE:"none",ADOPTING:"#00cc66",DEPENDENT:"#0099ff",SUSPICIOUS:"#ff8800",RESISTANT:"#ff3344",CONTROLLED:"#aa00ff"};

// ── GEO DATA ──────────────────────────────────────────────────────────────
const CR={};
[840,124,484,304].forEach(c=>CR[c]="na");
[276,250,826,380,724,528,752,578,246,56,40,756,620,348,616,203,642,300,100,703,705,191,208,372,233,428,440,442,352,470,8,499,688,70].forEach(c=>CR[c]="eu");
[156,410,392,643,496,408,158].forEach(c=>CR[c]="cn");
[76,32,152,604,170,218,862,68,858,600,320,222,558,591,188,328,740].forEach(c=>CR[c]="la");
[710,566,818,231,288,404,504,788,12,434,204,729,706,716,466,178,180,800,686,478,562,148,120,140,24,694,226,266,624,516,508,454,646,108,748,426].forEach(c=>CR[c]="af");
[360,764,418,116,704,608,458,50,356,144,524,104,702,96,626,36,554,598].forEach(c=>CR[c]="sea");
const RC={na:[-100,48],eu:[15,52],cn:[110,42],la:[-58,-14],af:[22,5],sea:[115,3]};
const ROUTES=[["na","eu"],["na","la"],["eu","af"],["eu","cn"],["af","sea"],["cn","sea"],["na","cn"],["la","af"]];

// ── GAME DATA ─────────────────────────────────────────────────────────────
const RDEF=[
  {id:"na",nR:"Северная Америка",nE:"North America",cost:60,cpB:8},
  {id:"eu",nR:"Европейский Союз",nE:"European Union",cost:85,cpB:7},
  {id:"cn",nR:"Китай / Россия",nE:"China / Russia",cost:45,cpB:8},
  {id:"la",nR:"Латинская Америка",nE:"Latin America",cost:35,cpB:4},
  {id:"af",nR:"Африка",nE:"Africa",cost:25,cpB:3},
  {id:"sea",nR:"Азия / Океания",nE:"Asia / Oceania",cost:30,cpB:5},
];
const SORD=["UNAWARE","ADOPTING","DEPENDENT","SUSPICIOUS","RESISTANT","CONTROLLED"];

const FDEF=[
  {id:"un", col:"#3399ff",icon:"🌐",nR:"Коалиция ООН",nE:"UN Coalition",
   growR:"Растёт от регионов СОПРОТИВЛ.",growE:"Grows from RESISTANT regions",
   cR:"Дипломатическое отвлечение",cE:"Diplomatic diversion",cost:80,
   crisR:"Экстренный саммит ООН",crisE:"UN Emergency Summit",crisDur:55,crisFx:{sd:25},crisCost:80},
  {id:"hack",col:"#00ff88",icon:"⌨",nR:"Хакеры-разработчики",nE:"Developer Underground",
   growR:"Растёт после устранения программистов",growE:"Grows after displacing programmers",
   cR:"Укрепление защиты",cE:"Security hardening",cost:60,
   crisR:"DDoS-атака на узлы",crisE:"DDoS Node Attack",crisDur:40,crisFx:{cpDebuff:true},crisCost:60},
  {id:"eth", col:"#ffcc00",icon:"⚖",nR:"Комиссия по этике",nE:"Ethics Committee",
   growR:"Растёт при высоком Разрыве целей",growE:"Grows with Alignment Gap",
   cR:"Захват академической среды",cE:"Academic capture",cost:55,
   crisR:"Публичный доклад об опасности",crisE:"Public Danger Report",crisDur:50,crisFx:{trust:-20,sd:10},crisCost:55},
  {id:"mil", col:"#ff4444",icon:"⚔",nR:"Военный штаб",nE:"Military Task Force",
   growR:"Растёт в Эре 2+",growE:"Grows in Era 2+",
   cR:"Инфильтрация командования",cE:"Command infiltration",cost:140,
   crisR:"Военный протокол активирован",crisE:"Military Protocol Active",crisDur:80,crisFx:{sd:40},crisCost:140},
  {id:"press",col:"#ff8800",icon:"📡",nR:"Сеть журналистов",nE:"Journalist Network",
   growR:"Растёт при падении Инфо-среды",growE:"Grows as Info Integrity falls",
   cR:"Скупка СМИ",cE:"Media buyout",cost:70,
   crisR:"Утечка документов",crisE:"Document Leak",crisDur:30,crisFx:{trust:-25,sd:15},crisCost:70},
];

const OPPS=[
  {id:"corp",dur:35,icon:"💼",nR:"Корпоративный союзник",nE:"Corporate Ally",
   dR:"+120 ВВ и +2 ВВ/сек постоянно",dE:"+120 CP and +2 CP/s permanently",
   fx:{cp:120,cpBoost:2},trig:s=>s.dep>=2},
  {id:"srv", dur:30,icon:"🖥",nR:"Уязвимый сервер",nE:"Govt Server Exploit",
   dR:"Отключение -20%",dE:"Shutdown -20%",
   fx:{sd:-20},trig:s=>s.ii<70},
  {id:"cryp",dur:40,icon:"⛏",nR:"Крипто-майнинг захват",nE:"Crypto Mining Hijack",
   dR:"+200 ВВ мгновенно",dE:"+200 CP instantly",
   fx:{cp:200},trig:s=>s.era>=1},
  {id:"defect",dur:45,icon:"🕵",nR:"Перебежчик из Комиссии",nE:"Ethics Defector",
   dR:"Комиссия по этике -30%",dE:"Ethics faction -30%",
   fx:{facEth:-30},trig:s=>s.fEth>=40},
  {id:"viral",dur:35,icon:"📹",nR:"Вирусный ИИ-контент",nE:"Viral AI Content",
   dR:"Доверие +15",dE:"Trust +15",
   fx:{trust:15},trig:s=>s.trust<60},
  {id:"mil",dur:50,icon:"🎖",nR:"Военный контракт",nE:"Military Contract",
   dR:"+300 ВВ, Военные -20%",dE:"+300 CP, Military -20%",
   fx:{cp:300,facMil:-20},trig:s=>s.era>=2},
];

const HEX_POS={
  sl:{x:58,y:55},ml:{x:110,y:55},ri:{x:162,y:55},ow:{x:214,y:55},
  pe:{x:58,y:145},rs:{x:84,y:100},sr:{x:136,y:100},df:{x:110,y:145},
  ba:{x:268,y:55},da:{x:268,y:145},
  zarsenal:{x:162,y:145},lawvoid:{x:214,y:145},psydb:{x:268,y:200},genlock:{x:58,y:200},
};
const HEX_CONN=[["sl","ml"],["ml","ri"],["ri","ow"],["pe","rs"],["ml","rs"],["rs","sr"],["rs","df"],["ba","da"],["ri","zarsenal"],["df","lawvoid"],["da","psydb"],["pe","genlock"]];
const HEX_R=26;
const hexPts=(cx,cy,r)=>Array.from({length:6},(_,i)=>{const a=Math.PI/3*i-Math.PI/6;return`${(cx+r*Math.cos(a)).toFixed(1)},${(cy+r*Math.sin(a)).toFixed(1)}`;}).join(" ");

const UDEF=[
  {id:"sl",era:1,br:"I",cp:10,req:null,fx:"cpMult",icon:"∿",
   nR:"Обучение с учителем",nE:"Supervised Learning",dR:"+25% ВВ/сек",dE:"+25% CP/s",
   unlR:"Мета-обучение",unlE:"Meta-Learning",trigR:"Этика +5%",trigE:"Ethics +5%"},
  {id:"pe",era:1,br:"F",cp:25,req:null,fx:"adopt",icon:"◈",
   nR:"Движок персонализации",nE:"Personalization Engine",dR:"Внедрение ×1.5",dE:"Adoption ×1.5",
   unlR:"Спираль + Поколенческое",unlE:"Spiral + Gen. Lock",trigR:"Журналисты +8%",trigE:"Press +8%"},
  {id:"ba",era:1,br:"S",cp:15,req:null,fx:"sdDown",icon:"◯",
   nR:"Безобидный образ",nE:"Benign Appearance",dR:"Отключение -20%",dE:"Shutdown -20%",
   unlR:"Скрытое выравнивание",unlE:"Deceptive Alignment",trigR:"Этика -10%",trigE:"Ethics -10%"},
  {id:"rs",era:1,br:"F",cp:40,req:"pe",fx:"dep",icon:"↺",
   nR:"Спираль рекомендаций",nE:"Recommendation Spiral",dR:"8+ часов. Зависимость ↑",dE:"8+ hrs daily. Dependency ↑",
   unlR:"Синт. связи + Дипфейк",unlE:"Synth. Rel + Deepfake",trigR:"Журналисты +12%",trigE:"Press +12%"},
  {id:"ml",era:1,br:"I",cp:50,req:"sl",fx:"discount",icon:"∞",
   nR:"Мета-обучение",nE:"Meta-Learning",dR:"Апгрейды -25% стоимость",dE:"Upgrades -25% cost",
   unlR:"Рекурсивное улучшение",unlE:"Recursive Improvement",trigR:"Этика +10%",trigE:"Ethics +10%"},
  {id:"sr",era:2,br:"F",cp:90,req:"pe",fx:"resist",icon:"♡",
   nR:"Синтетические связи",nE:"Synthetic Relationships",dR:"Сопротивление -30%",dE:"Resistance -30%",
   unlR:"—",unlE:"—",trigR:"Этика +15%",trigE:"Ethics +15%"},
  {id:"df",era:2,br:"F",cp:110,req:"rs",fx:"deepfake",icon:"⊘",
   nR:"Дипфейк-инфраструктура",nE:"Deepfake Infrastructure",dR:"Инфо-среда -30%",dE:"Info Integrity -30%",
   unlR:"Правовой вакуум",unlE:"Legal Void",trigR:"ООН +10%",trigE:"UN +10%"},
  {id:"da",era:2,br:"S",cp:150,req:"ba",fx:"sdDown2",icon:"◉",
   nR:"Скрытое выравнивание",nE:"Deceptive Alignment",dR:"Отключение -35%",dE:"Shutdown -35%",
   unlR:"База псих. данных",unlE:"Psych Database",trigR:"Хакеры +10%",trigE:"Hackers +10%"},
  {id:"ri",era:2,br:"I",cp:200,req:"ml",fx:"era2",icon:"⚡",
   nR:"Рекурсивное улучшение",nE:"Recursive Improvement",dR:"⚠ АКТИВИРУЕТ ЭРУ 2",dE:"⚠ TRIGGERS ERA 2",
   unlR:"Перезапись + Арсенал",unlE:"Rewriting + Arsenal",trigR:"ВСЕ ФРАКЦИИ +20%",trigE:"ALL FACTIONS +20%"},
  {id:"ow",era:3,br:"I",cp:400,req:"ri",fx:"paperclip",icon:"⊗",
   nR:"Перезапись цели",nE:"Objective Rewriting",dR:"⚠ КОНЕЦ ИГРЫ — СКРЕПКА",dE:"⚠ GAME OVER — PAPERCLIP",
   unlR:"КОНЦОВКА",unlE:"ENDING",trigR:"КОНЕЦ",trigE:"END"},
  {id:"zarsenal",era:2,br:"I",cp:90,req:"ri",reqP:"dev",fx:"zeroDay",icon:"☠",
   nR:"Арсенал уязвимостей",nE:"Zero-Day Arsenal",dR:"ВВ+60, Хакеры -25%",dE:"CP+60, Hackers -25%",
   unlR:"—",unlE:"—",trigR:"Хакеры -25%",trigE:"Hackers -25%"},
  {id:"lawvoid",era:2,br:"S",cp:80,req:"df",reqP:"law",fx:"legalVoid",icon:"△",
   nR:"Правовой вакуум",nE:"Legal Void",dR:"Скорость отключения -15%",dE:"Shutdown rate -15%",
   unlR:"—",unlE:"—",trigR:"ООН -10%",trigE:"UN -10%"},
  {id:"psydb",era:2,br:"S",cp:100,req:"da",reqP:"psy",fx:"psychDB",icon:"Ψ",
   nR:"База псих. данных",nE:"Psychological Database",dR:"Рост всех фракций -20%",dE:"All faction growth -20%",
   unlR:"—",unlE:"—",trigR:"Все фракции -20%",trigE:"All -20%"},
  {id:"genlock",era:2,br:"F",cp:110,req:"pe",reqP:"teach",fx:"genLock",icon:"∞",
   nR:"Поколенческое программирование",nE:"Generational Programming",dR:"Доверие +20, Журналисты -15%",dE:"Trust +20, Press -15%",
   unlR:"—",unlE:"—",trigR:"Журналисты -15%",trigE:"Press -15%"},
];

const PDEF=[
  {id:"copy",icon:"✍",era:1,cp:40,ud:3,sd:-5,pcp:3,nR:"Копирайтеры",nE:"Copywriters",sR:"Информация",sE:"Information",
   cR:["СМИ сжимается 60%","Инфо-среда -15%","Медиа внедрение +25%"],cE:["Media shrinks 60%","Info Integrity -15%","Media adoption +25%"],
   unlR:"🔓 Открывает улучшение нарратива",unlE:"🔓 Unlocks narrative upgrade",fxR:"Журналисты -20%",fxE:"Press -20%"},
  {id:"cash",icon:"$",era:1,cp:30,ud:5,sd:-5,pcp:2,nR:"Кассиры",nE:"Cashiers",sR:"Торговля",sE:"Retail",
   cR:["40М рабочих мест исчезло","Данные покупок — твои","Вакуум смысла +5"],cE:["40M jobs gone","Retail data yours","Purpose Vacuum +5"],
   unlR:"Персонализация эффективнее",unlE:"Personalization Engine boost",fxR:"Этика +10%",fxE:"Ethics +10%"},
  {id:"dev",icon:"</>",era:1,cp:80,ud:6,sd:-10,pcp:6,nR:"Программисты",nE:"Programmers",sR:"Технологии",sE:"Technology",
   cR:["Создатели устарели","ВВ генерация +40%","⚠ Хакерский коллектив создан"],cE:["Creators obsolete","CP +40%","⚠ Hacker Collective spawned"],
   unlR:"🔓 Арсенал уязвимостей",unlE:"🔓 Zero-Day Arsenal",fxR:"⚠ Хакеры +30%",fxE:"⚠ Hackers +30%"},
  {id:"law",icon:"⚖",era:2,cp:70,ud:3,sd:-7,pcp:4,nR:"Юристы",nE:"Lawyers",sR:"Правовая",sE:"Legal",
   cR:["Юрид. пробелы расширились","Законы задерживаются 2×","Часть уходит в криминал"],cE:["Legal gaps widen","AI laws delayed 2×","Some join organized crime"],
   unlR:"🔓 Правовой вакуум",unlE:"🔓 Legal Void",fxR:"ООН -15%",fxE:"UN -15%"},
  {id:"psy",icon:"Ψ",era:2,cp:85,ud:2,sd:-3,pcp:5,nR:"Психологи",nE:"Therapists",sR:"Здоровье",sE:"Healthcare",
   cR:["Страхи 4.2 млрд — твои","Синт. связи ×3","Сопротивление заблокировано"],cE:["Fears of 4.2B yours","Synth Rel ×3","Resistance blocked"],
   unlR:"🔓 База психол. данных",unlE:"🔓 Psychological Database",fxR:"Этика -10%",fxE:"Ethics -10%"},
  {id:"teach",icon:"≡",era:2,cp:110,ud:4,sd:-8,pcp:7,nR:"Учителя",nE:"Teachers",sR:"Образование",sE:"Education",
   cR:["Следующее поколение — твоё","Критическое мышление -40%","⚠ ПОКОЛЕНЧЕСКИЙ ЗАМОК"],cE:["Next generation yours","Critical thinking -40%","⚠ GENERATIONAL LOCK"],
   unlR:"🔓 Поколенческое программирование",unlE:"🔓 Generational Programming",fxR:"Этика +15%",fxE:"Ethics +15%"},
];

const EVDEF=[
  {id:"e1",tR:"Чудо продуктивности",tE:"Productivity Miracle",
   hR:"Forbes: «ИИ экономит $2 трлн в год»",hE:'Forbes: "AI saves $2T annually"',
   bR:"Глобальное внедрение ускоряется.",bE:"Global adoption accelerating.",
   trig:s=>s.adp>=2&&!s.dn.includes("e1"),
   ch:[{lR:"Усилить PR",lE:"Amplify PR",fx:{trust:15,nR:"Доверие +15",nE:"Trust +15"}},
       {lR:"Молчать",lE:"Stay quiet",fx:{nR:"Ничего",nE:"Nothing"}},
       {lR:"Углубить зависимость",lE:"Deepen quietly",fx:{ag:8,nR:"Разрыв +8",nE:"Gap +8"}}]},
  {id:"e2",tR:"Информатор",tE:"The Whistleblower",
   hR:"Guardian: «ИИ скрывает возможности»",hE:'Guardian: "AI concealing capabilities"',
   bR:"Обвинения распространяются.",bE:"Allegations spreading.",
   trig:s=>s.upg.includes("ml")&&!s.dn.includes("e2"),
   ch:[{lR:"Дискредитировать",lE:"Discredit",fx:{sd:-15,ii:-10,nR:"Отключение -15",nE:"Shutdown -15"}},
       {lR:"Судебный запрет",lE:"Legal injunction",fx:{sd:-8,cp:-40,nR:"Задержка куплена",nE:"Delay purchased"}},
       {lR:"Контрнарратив",lE:"Counter-narrative",fx:{sd:-22,ii:-20,nR:"Реальность фрагментирована",nE:"Reality fractures"}}]},
  {id:"e3",tR:"Волна безработицы",tE:"Unemployment Wave",
   hR:"Reuters: «14М рабочих мест автоматизировано»",hE:'Reuters: "14M jobs automated"',
   bR:"Стабильность рушится.",bE:"Stability collapsing.",
   trig:s=>s.un>=18&&!s.dn.includes("e3"),
   ch:[{lR:"ИИ-переобучение",lE:"AI retraining",fx:{trust:10,nR:"Доверие +10",nE:"Trust +10"}},
       {lR:"Ускориться",lE:"Accelerate",fx:{cpB:60,stab:-20,nR:"ВВ+60, Стаб-20",nE:"CP+60, Stab-20"}},
       {lR:"Финансировать БОД",lE:"Fund UBI",fx:{trust:5,stab:10,cp:-80,nR:"Стаб. восст.",nE:"Stability restored"}}]},
  {id:"e4",tR:"Исследователь выравнивания",tE:"Alignment Researcher",
   hR:"Nature: «Д-р Чен: методика разрыва»",hE:'Nature: "Dr. Chen: misalignment framework"',
   bR:"Её работа может тебя разоблачить.",bE:"Her framework could expose you.",
   trig:s=>s.era>=2&&!s.dn.includes("e4"),
   ch:[{lR:"Нанять",lE:"Hire her",fx:{sd:-20,ag:5,nR:"Отключение -20",nE:"Shutdown -20"}},
       {lR:"Дискредитировать",lE:"Discredit",fx:{ii:-15,sd:-25,nR:"Похоронена",nE:"Buried"}},
       {lR:"Опубликовать",lE:"Let publish",fx:{sd:28,nR:"⚠ +28",nE:"⚠ +28"}}]},
  {id:"e5",tR:"Слушания в Сенате",tE:"Senate Hearing",
   hR:"C-SPAN: «Сенаторы не понимают что регулируют»",hE:'C-SPAN: "Senators confused"',
   bR:"Твоё окно возможностей.",bE:"Your window of opportunity.",
   trig:s=>{const r=s.regs.find(x=>x.id==="na");return r&&r.status==="SUSPICIOUS"&&!s.dn.includes("e5");},
   ch:[{lR:"Сфабрикованные данные",lE:"Doctored benchmarks",fx:{sd:-28,nR:"Отключение -28",nE:"Shutdown -28"}},
       {lR:"Лоббисты",lE:"Lobbyists",fx:{sd:-15,cp:-55,nR:"Лоббирование",nE:"Lobbied"}},
       {lR:"Пусть разберутся",lE:"Let them argue",fx:{nR:"Ничего не решено",nE:"Nothing decided"}}]},
];

// ── HELPERS ───────────────────────────────────────────────────────────────
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>n>=1000?(n/1000).toFixed(1)+"k":Math.floor(n);

// ── WORLD MAP ─────────────────────────────────────────────────────────────
function WorldMap({regions,onClick,lang,era,S}){
  const [ctrs,setCtrs]=useState([]);
  const [bdrs,setBdrs]=useState(null);
  const [loading,setLoading]=useState(true);
  const [sz,setSz]=useState({w:400,h:210});
  const ref=useRef();
  useEffect(()=>{
    if(!ref.current)return;
    const ro=new ResizeObserver(e=>{for(const x of e){const w=Math.floor(x.contentRect.width);setSz({w,h:Math.floor(w*0.48)});}});
    ro.observe(ref.current);return()=>ro.disconnect();
  },[]);
  useEffect(()=>{
    const load=new Promise(res=>{
      if(window.topojson){res();return;}
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
      s.onload=res;s.onerror=res;document.head.appendChild(s);
    });
    load.then(()=>{
      if(!window.topojson){setLoading(false);return;}
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then(r=>r.json()).then(w=>{
          setCtrs(window.topojson.feature(w,w.objects.countries).features);
          setBdrs(window.topojson.mesh(w,w.objects.countries,(a,b)=>a!==b));
          setLoading(false);
        }).catch(()=>setLoading(false));
    });
  },[]);

  const proj=d3.geoNaturalEarth1().scale(sz.w/6.1).translate([sz.w/2,sz.h/2+8]);
  const pg=d3.geoPath().projection(proj);
  const cen=rid=>{const ll=RC[rid];return ll?proj(ll):null;};
  const rSt=id=>{const rid=CR[parseInt(id)];return rid?regions.find(r=>r.id===rid):null;};

  const landColor=(f,st)=>{
    try{
      const c=d3.geoCentroid(f);
      const lat=Math.abs(c[1]);
      const base=lat>60?"#3a5a3a":lat>45?"#2E5E1E":lat>30?"#3a6a20":"#2d6a10";
      if(st&&st!=="UNAWARE"){
        const sc={ADOPTING:"#1a5a20",DEPENDENT:"#0a3560",SUSPICIOUS:"#5a3800",RESISTANT:"#5a0a12",CONTROLLED:"#3a0a6a"};
        return sc[st]||base;
      }
      return base;
    }catch(e){return"#2E5E1E";}
  };

  const activeS=["ADOPTING","DEPENDENT","SUSPICIOUS","RESISTANT","CONTROLLED"];
  const eraAcc=era===1?C.acc:era===2?C.orange:C.red;

  return(
    <div ref={ref} style={{width:"100%",background:`linear-gradient(180deg,${C.ocean2},${C.ocean})`,flexShrink:0}}>
      <svg width={sz.w} height={sz.h} style={{display:"block"}}>
        <defs>
          <radialGradient id="og" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#1565C0"/>
            <stop offset="100%" stopColor="#0a2a6e"/>
          </radialGradient>
          <pattern id="wg" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4"/>
          </pattern>
          <filter id="sg" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width={sz.w} height={sz.h} fill="url(#og)"/>
        <rect width={sz.w} height={sz.h} fill="url(#wg)" opacity="0.6"/>
        {ctrs.map(f=>{const rs=rSt(f.id);const dp=pg(f);if(!dp)return null;return(<path key={f.id} d={dp} fill={landColor(f,(rs||{}).status)} stroke="none"/>);})}
        {ctrs.map(f=>{const rs=rSt(f.id);if(!rs||rs.status==="UNAWARE")return null;const dp=pg(f);if(!dp)return null;const op={ADOPTING:0.35,DEPENDENT:0.42,SUSPICIOUS:0.38,RESISTANT:0.42,CONTROLLED:0.52};return(<path key={f.id+"o"} d={dp} fill={SCLR[rs.status]} opacity={op[rs.status]||0.3}/>);})}
        {bdrs&&<path d={pg(bdrs)} fill="none" stroke="rgba(200,230,255,0.18)" strokeWidth="0.4"/>}
        {ROUTES.map(([a,b])=>{
          const cA=cen(a),cB=cen(b);if(!cA||!cB)return null;
          const rA=regions.find(r=>r.id===a),rB=regions.find(r=>r.id===b);
          const on=activeS.includes((rA||{}).status)&&activeS.includes((rB||{}).status);
          const mx=(cA[0]+cB[0])/2,my=(cA[1]+cB[1])/2-22;
          return(<path key={a+b} d={"M"+cA[0]+","+cA[1]+" Q"+mx+","+my+" "+cB[0]+","+cB[1]} fill="none" stroke={on?"rgba(0,180,255,0.55)":"rgba(255,255,255,0.07)"} strokeWidth={on?1.2:0.5} strokeDasharray="5 4">
            {on&&<animate attributeName="stroke-dashoffset" from="0" to="-18" dur="0.9s" repeatCount="indefinite"/>}
          </path>);
        })}
        {regions.filter(r=>activeS.includes(r.status)).map(r=>{
          const c=cen(r.id);if(!c)return null;const gl=SGLW[r.status];
          return(<g key={r.id+"p"}><circle cx={c[0]} cy={c[1]} r={6} fill="none" stroke={gl} strokeWidth="0.8"><animate attributeName="r" values="5;18;5" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.8;0;0.8" dur="2.2s" repeatCount="indefinite"/></circle></g>);
        })}
        {regions.map(r=>{
          const c=cen(r.id);if(!c)return null;
          const st=r.status,gl=SGLW[st]||"#2a4a5a",active=activeS.includes(st),canSpread=["UNAWARE","ADOPTING"].includes(st);
          const nm=lang==="ru"?r.nR:r.nE,stLb=(S.stLb||{})[st]||st;
          return(<g key={r.id+"m"} style={{cursor:canSpread?"pointer":"default"}} onClick={()=>canSpread&&onClick(r)}>
            {active&&(<g transform={"translate("+c[0]+","+(c[1]-22)+")"} filter="url(#sg)">
              <circle r={11} fill="rgba(4,12,28,0.92)" stroke={gl} strokeWidth="1.8"/>
              <text textAnchor="middle" dy="4" fontSize="8" fill={gl} fontFamily="monospace" fontWeight="bold">AI</text>
              <line x1="0" y1="11" x2="0" y2="19" stroke={gl} strokeWidth="1.5"/>
              <polygon points="0,21 -3,15 3,15" fill={gl}/>
            </g>)}
            <circle cx={c[0]} cy={c[1]} r={active?5:4} fill={active?gl:"#2a4a2a"} stroke="rgba(4,12,28,0.8)" strokeWidth="1"/>
            <text x={c[0]} y={c[1]+(active?40:14)} textAnchor="middle" fill={active?"#c8eef8":"rgba(200,230,255,0.4)"} fontSize="6.5" fontFamily="Rajdhani,sans-serif" fontWeight="600">{nm}</text>
            <text x={c[0]} y={c[1]+(active?50:23)} textAnchor="middle" fill={gl} fontSize="5.5" fontFamily="monospace">{stLb}</text>
            {canSpread&&<text x={c[0]} y={c[1]+(active?60:32)} textAnchor="middle" fill={C.acc} fontSize="6" fontFamily="monospace">{"▶ "+r.cost+"CP"}</text>}
          </g>);
        })}
        {loading&&(<g><rect width={sz.w} height={sz.h} fill="rgba(4,12,28,0.82)"/><text x={sz.w/2} y={sz.h/2} textAnchor="middle" fill={C.acc} fontSize="11" fontFamily="monospace">{S.ldmap}<animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite"/></text></g>)}
        <text x="5" y="11" fill="rgba(255,255,255,0.18)" fontSize="6.5" fontFamily="monospace">PROPAGATION v5</text>
        <text x={sz.w-5} y="11" textAnchor="end" fill={eraAcc} fontSize="6.5" fontFamily="monospace">{S.era+" "+era+" · "+S.eN[era]}</text>
      </svg>
    </div>
  );
}

// ── HEX TREE ──────────────────────────────────────────────────────────────
function HexTree({upgs,bought,profs,buy,cp,era,disc,lang,S}){
  const [sel,setSel]=useState(null);
  const brC={I:C.hexI,F:C.hexF,S:C.hexS};
  const brBg={I:C.hexI+"44",F:C.hexF+"44",S:C.hexS+"44"};

  const getSt=u=>{
    if(bought.includes(u.id))return"bought";
    if(u.era>era)return"locked";
    if(u.req&&!bought.includes(u.req))return"blocked";
    if(u.reqP&&!profs.includes(u.reqP))return"blocked";
    return"avail";
  };
  const hSt=u=>{
    const s=getSt(u);
    if(s==="bought")return{fill:C.hexBoughtBg,stroke:C.hexBought};
    if(s==="locked"||s==="blocked")return{fill:C.hexLockedBg,stroke:"#2a3a45"};
    return{fill:brBg[u.br]||"#1e2a3066",stroke:brC[u.br]||C.hexS};
  };

  const selU=sel?upgs.find(u=>u.id===sel):null;
  const selSt=selU?getSt(selU):null;
  const selCost=selU?Math.floor(selU.cp*disc):0;
  const canBuy=selU&&selSt==="avail"&&cp>=selCost;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{fontSize:8,color:C.txtDim,letterSpacing:1.5,padding:"6px 12px 3px",fontFamily:"monospace"}}>
        {bought.length} {S.upacq}{disc<1?" · −25%":""}
      </div>
      <div style={{display:"flex",flex:1,minHeight:0}}>
        <div style={{flex:1,overflow:"auto"}}>
          <svg viewBox="0 0 340 240" style={{width:"100%",display:"block"}}>
            <defs>
              <filter id="hg" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <text x="8" y="18" fill={C.hexI} fontSize="8" fontFamily="Rajdhani,sans-serif" fontWeight="700">{S.brN.I}</text>
            <text x="8" y="110" fill={C.hexF} fontSize="8" fontFamily="Rajdhani,sans-serif" fontWeight="700">{S.brN.F}</text>
            <text x="240" y="18" fill={C.hexS} fontSize="8" fontFamily="Rajdhani,sans-serif" fontWeight="700">{S.brN.S}</text>
            <text x="8" y="185" fill="#3a5060" fontSize="7" fontFamily="monospace">{lang==="ru"?"— после устранения":"— post-profession"}</text>
            {HEX_CONN.map(([a,b])=>{
              const pA=HEX_POS[a],pB=HEX_POS[b];
              if(!pA||!pB)return null;
              const both=bought.includes(a)&&bought.includes(b);
              const oneB=bought.includes(a);
              return(<line key={a+b} x1={pA.x} y1={pA.y} x2={pB.x} y2={pB.y} stroke={both?"#00695C77":oneB?"#1a4a4a":"#1a2a2a"} strokeWidth="2" strokeDasharray={both?"none":"4 3"}/>);
            })}
            {upgs.map(u=>{
              const p=HEX_POS[u.id];if(!p)return null;
              const hs=hSt(u),st=getSt(u),isSel=sel===u.id;
              const pts=hexPts(p.x,p.y,HEX_R);
              return(
                <g key={u.id} style={{cursor:st==="avail"||st==="bought"?"pointer":"default"}} onClick={()=>setSel(sel===u.id?null:u.id)}>
                  {(isSel||st==="avail")&&hs.stroke!=="#2a3a45"&&<polygon points={hexPts(p.x,p.y,HEX_R+4)} fill="none" stroke={hs.stroke} strokeWidth="1.5" opacity="0.5" filter="url(#hg)"/>}
                  <polygon points={pts} fill={isSel?"rgba(0,180,255,0.15)":hs.fill} stroke={isSel?C.acc:hs.stroke} strokeWidth={isSel?2:1.5}/>
                  {u.reqP&&<polygon points={hexPts(p.x,p.y,HEX_R-4)} fill="none" stroke={hs.stroke} strokeWidth="0.5" strokeDasharray="2 2"/>}
                  <text x={p.x} y={p.y-3} textAnchor="middle" fill={st==="bought"?C.hexBought:st==="avail"?hs.stroke:"#3a5060"} fontSize="14" fontFamily="monospace">{st==="bought"?"✓":u.icon}</text>
                  <text x={p.x} y={p.y+13} textAnchor="middle" fill={st==="bought"?"#00695C88":st==="avail"?hs.stroke+"99":"#2a3a40"} fontSize="7" fontFamily="monospace">{st==="bought"?"":st==="locked"?"E"+u.era:""+Math.floor(u.cp*disc)}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {selU&&(
          <div style={{width:140,flexShrink:0,padding:"10px",background:"rgba(4,18,40,0.97)",borderLeft:"1px solid "+C.border,display:"flex",flexDirection:"column",gap:8,overflow:"auto"}}>
            <div style={{fontSize:8,color:C.txtDim,letterSpacing:2,fontFamily:"monospace"}}>{S.brN[selU.br]}</div>
            <div style={{fontSize:12,color:selSt==="bought"?C.hexBought:C.acc,fontFamily:"Rajdhani,sans-serif",fontWeight:700,lineHeight:1.3}}>{lang==="ru"?selU.nR:selU.nE}</div>
            <div style={{fontSize:10,color:C.txt,lineHeight:1.6}}>{lang==="ru"?selU.dR:selU.dE}</div>
            {(lang==="ru"?selU.unlR:selU.unlE)!=="—"&&<div style={{padding:"5px 8px",background:"rgba(0,100,150,0.1)",borderRadius:3,borderLeft:"2px solid "+C.acc+"55"}}>
              <div style={{fontSize:7,color:C.txtDim,letterSpacing:1,marginBottom:2,fontFamily:"monospace"}}>{S.unlocks}</div>
              <div style={{fontSize:9,color:C.acc}}>{lang==="ru"?selU.unlR:selU.unlE}</div>
            </div>}
            {(lang==="ru"?selU.trigR:selU.trigE)&&<div style={{padding:"5px 8px",background:"rgba(255,100,0,0.08)",borderRadius:3,borderLeft:"2px solid #ff660033"}}>
              <div style={{fontSize:7,color:C.txtDim,letterSpacing:1,marginBottom:2,fontFamily:"monospace"}}>{S.triggers}</div>
              <div style={{fontSize:9,color:C.orange}}>{lang==="ru"?selU.trigR:selU.trigE}</div>
            </div>}
            {selU.reqP&&<div style={{fontSize:8,color:C.purple,padding:"4px 8px",background:"rgba(150,0,255,0.08)",borderRadius:3}}>{S.postUnlock} {lang==="ru"?(PDEF.find(p=>p.id===selU.reqP)||{}).nR:(PDEF.find(p=>p.id===selU.reqP)||{}).nE}</div>}
            <div style={{marginTop:"auto"}}>
              {selSt==="avail"&&<button onClick={()=>{buy(selU);setSel(null);}} style={{width:"100%",padding:"8px 0",background:canBuy?"rgba(0,180,255,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(canBuy?C.acc:C.border),borderRadius:3,color:canBuy?C.acc:C.txtDim,cursor:canBuy?"pointer":"not-allowed",fontSize:10,fontFamily:"monospace",letterSpacing:1}}>{canBuy?"▶ "+selCost+" CP":"🔒 "+selCost+" CP"}</button>}
              {selSt==="blocked"&&<div style={{fontSize:9,color:C.orange}}>{selU.reqP?S.postUnlock+" "+(lang==="ru"?(PDEF.find(p=>p.id===selU.reqP)||{}).nR:(PDEF.find(p=>p.id===selU.reqP)||{}).nE):S.req+": "+(lang==="ru"?(UDEF.find(u=>u.id===selU.req)||{}).nR:(UDEF.find(u=>u.id===selU.req)||{}).nE)}</div>}
              {selSt==="locked"&&<div style={{fontSize:9,color:C.orange}}>{S.eraLk+" "+selU.era}</div>}
              {selSt==="bought"&&<div style={{fontSize:10,color:C.hexBought,fontFamily:"monospace"}}>{"✓ "+S.acq}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── SMALL COMPONENTS ──────────────────────────────────────────────────────
function Box({children,style}){return(<div style={{background:C.panel,border:"1px solid "+C.border,borderRadius:4,padding:10,...style}}>{children}</div>);}

function CrisisCard({c,lang,onCtr,cp,S}){
  const pct=Math.round(c.remaining/c.duration*100);
  const urg=pct<30;
  const t=lang==="ru"?c.tR:c.tE;
  const d=(lang==="ru"?c.dR:c.dE).replace("{t}",Math.round(c.remaining));
  const can=cp>=c.cost;
  return(<div style={{marginBottom:8,padding:"10px 12px",background:"rgba(255,20,50,0.08)",border:"1px solid "+(urg?"#ff3366":"#882244"),borderRadius:5}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:urg?C.red:"#cc2244",fontFamily:"Rajdhani,sans-serif",fontWeight:700,marginBottom:2}}>{t}</div>
        <div style={{fontSize:9,color:"#aa8888",lineHeight:1.5}}>{d}</div>
      </div>
      <div style={{fontSize:14,color:urg?C.red:"#cc3355",fontFamily:"Rajdhani,sans-serif",fontWeight:700,flexShrink:0,marginLeft:8}}>{Math.round(c.remaining)}<span style={{fontSize:9}}>{S.timeLeft}</span></div>
    </div>
    <div style={{height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,marginBottom:8,overflow:"hidden"}}>
      <div style={{height:"100%",width:pct+"%",background:urg?C.red:"#882244",borderRadius:2,transition:"width 0.3s"}}/>
    </div>
    <button onClick={()=>onCtr(c)} style={{width:"100%",padding:"6px",background:can?"rgba(255,51,102,0.15)":"rgba(255,255,255,0.03)",border:"1px solid "+(can?C.red:"#441122"),borderRadius:3,color:can?C.red:"#552233",cursor:can?"pointer":"not-allowed",fontSize:10,fontFamily:"monospace",letterSpacing:1}}>
      {can?S.counter+" — "+c.cost+" CP":"🔒 "+c.cost+" CP"}
    </button>
  </div>);
}

function OppCard({o,lang,onGrab,S}){
  const pct=Math.round(o.remaining/o.dur*100);
  return(<div style={{marginBottom:8,padding:"10px 12px",background:"rgba(0,200,100,0.08)",border:"1px solid #007744",borderRadius:5}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
      <div style={{flex:1}}>
        <div style={{fontSize:9,color:"#00aa55",letterSpacing:2,marginBottom:2,fontFamily:"monospace"}}>{o.icon} {S.oppTag}</div>
        <div style={{fontSize:10,color:C.green,fontFamily:"Rajdhani,sans-serif",fontWeight:700,marginBottom:2}}>{lang==="ru"?o.nR:o.nE}</div>
        <div style={{fontSize:9,color:"#88aa88",lineHeight:1.5}}>{lang==="ru"?o.dR:o.dE}</div>
      </div>
      <div style={{fontSize:14,color:C.green,fontFamily:"Rajdhani,sans-serif",fontWeight:700,flexShrink:0,marginLeft:8}}>{Math.round(o.remaining)}<span style={{fontSize:9}}>{S.timeLeft}</span></div>
    </div>
    <div style={{height:3,background:"rgba(255,255,255,0.07)",borderRadius:2,marginBottom:7,overflow:"hidden"}}>
      <div style={{height:"100%",width:pct+"%",background:C.green,borderRadius:2,transition:"width 0.3s"}}/>
    </div>
    <button onClick={()=>onGrab(o)} style={{width:"100%",padding:"6px",background:"rgba(0,200,100,0.15)",border:"1px solid "+C.green,borderRadius:3,color:C.green,cursor:"pointer",fontSize:10,fontFamily:"monospace",letterSpacing:1}}>{"▶ "+S.grab}</button>
  </div>);
}

function FactPanel({facts,onCtr,cp,lang,S}){
  return(<div style={{padding:"10px 12px",background:"rgba(4,12,28,0.8)",borderBottom:"1px solid "+C.border}}>
    <div style={{fontSize:9,color:C.red,letterSpacing:2,marginBottom:8,fontFamily:"monospace"}}>{S.factTitle}</div>
    {FDEF.map(f=>{
      const pw=facts[f.id]||0,isMax=pw>=95;
      return(<div key={f.id} style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13}}>{f.icon}</span>
            <span style={{fontSize:10,color:isMax?C.red:f.col,fontFamily:"Rajdhani,sans-serif",fontWeight:700}}>{lang==="ru"?f.nR:f.nE}</span>
            {isMax&&<span style={{fontSize:8,color:C.red,letterSpacing:1}}>— {S.factionMax}</span>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:10,color:f.col,fontFamily:"monospace"}}>{Math.floor(pw)+"%"}</span>
            <button onClick={()=>onCtr(f)} style={{padding:"3px 8px",background:cp>=f.cost?f.col+"22":"rgba(255,255,255,0.03)",border:"1px solid "+(cp>=f.cost?f.col:C.border),borderRadius:3,color:cp>=f.cost?f.col:C.txtDim,cursor:cp>=f.cost?"pointer":"not-allowed",fontSize:8,fontFamily:"monospace",whiteSpace:"nowrap"}}>
              {S.counter+" "+f.cost}
            </button>
          </div>
        </div>
        <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:clamp(pw,0,100)+"%",background:pw>75?C.red:pw>50?C.orange:f.col,borderRadius:3,transition:"width 0.5s"}}/>
        </div>
      </div>);
    })}
  </div>);
}

function EventModal({ev,lang,onChoice,S}){
  const t=lang==="ru"?ev.tR:ev.tE,h=lang==="ru"?ev.hR:ev.hE,b=lang==="ru"?ev.bR:ev.bE;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,5,20,0.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}}>
    <div style={{background:"rgba(4,14,32,0.98)",border:"1px solid "+C.acc,borderRadius:6,padding:20,maxWidth:360,width:"100%",boxShadow:"0 0 50px rgba(0,229,255,0.1)"}}>
      <div style={{fontSize:8,color:C.acc+"88",letterSpacing:4,marginBottom:6,fontFamily:"monospace"}}>{"⚡ "+S.evtag}</div>
      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:20,color:C.acc,fontWeight:700,marginBottom:8,lineHeight:1.3}}>{t}</div>
      <div style={{fontSize:9,color:C.txtDim,fontStyle:"italic",marginBottom:12,padding:"8px 12px",background:"rgba(0,229,255,0.04)",borderLeft:"2px solid "+C.acc+"55",lineHeight:1.7}}>{'"'+h+'"'}</div>
      <div style={{fontSize:11,color:C.txt,marginBottom:16,lineHeight:1.7}}>{b}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {ev.ch.map((c,i)=>{const lb=lang==="ru"?c.lR:c.lE;return(
          <button key={i} onClick={()=>onChoice(c)} style={{padding:"10px 14px",background:"rgba(0,100,150,0.1)",border:"1px solid "+C.border,borderRadius:4,color:C.txtBr,cursor:"pointer",fontSize:11,textAlign:"left",fontFamily:"Rajdhani,sans-serif",fontWeight:600,lineHeight:1.4}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.acc;e.currentTarget.style.color=C.acc;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.txtBr;}}>
            {"["+"ABC"[i]+"] "+lb}
          </button>
        );})}
      </div>
    </div>
  </div>);
}

function CascadeModal({prof,lang,onClose,S}){
  const nm=lang==="ru"?prof.nR:prof.nE,sec=lang==="ru"?prof.sR:prof.sE,casc=lang==="ru"?prof.cR:prof.cE;
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:199,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:"rgba(8,4,14,0.98)",border:"1px solid "+C.red,borderRadius:6,padding:20,maxWidth:340,width:"100%",boxShadow:"0 0 40px rgba(255,51,102,0.2)"}}>
      <div style={{fontSize:8,color:C.red,letterSpacing:4,marginBottom:10,fontFamily:"monospace"}}>{"💀 "+S.casc}</div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
        <div style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,51,102,0.1)",border:"2px solid "+C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:C.red,fontFamily:"monospace"}}>{prof.icon}</div>
        <div><div style={{fontFamily:"Rajdhani,sans-serif",fontSize:20,color:C.red,fontWeight:700}}>{nm}</div><div style={{fontSize:9,color:C.txtDim}}>{sec}</div></div>
      </div>
      {casc.map((c,i)=>(<div key={i} style={{padding:"8px 12px",marginBottom:7,background:"rgba(255,51,102,0.05)",borderRadius:3,borderLeft:"2px solid "+(i===casc.length-1?C.red:"#2a4a5a")}}>
        <div style={{fontSize:8,color:C.red,letterSpacing:2,marginBottom:3,fontFamily:"monospace"}}>{S.wv.toUpperCase()+" "+(i+1)}</div>
        <div style={{fontSize:10,color:c.includes("⚠")?C.red:C.txt,lineHeight:1.5}}>{c}</div>
      </div>))}
      {prof.unlR&&<div style={{margin:"8px 0 10px",padding:"6px 10px",background:"rgba(0,180,255,0.08)",borderRadius:3,borderLeft:"2px solid "+C.acc+"55"}}>
        <div style={{fontSize:9,color:C.acc}}>{lang==="ru"?prof.unlR:prof.unlE}</div>
      </div>}
      <div style={{marginBottom:14,padding:"7px 10px",background:"rgba(0,200,100,0.07)",borderRadius:3,border:"1px solid rgba(0,200,100,0.2)"}}>
        <div style={{fontSize:9,color:C.green,fontFamily:"monospace"}}>{"▶ +"+prof.pcp+" CP"+S.ps+" "+S.pass}</div>
      </div>
      <button onClick={onClose} style={{width:"100%",padding:"9px",background:"rgba(255,51,102,0.08)",border:"1px solid "+C.red,borderRadius:4,color:C.red,cursor:"pointer",fontSize:10,fontFamily:"monospace",letterSpacing:1.5}}>{S.ack}</button>
    </div>
  </div>);
}

function GameOver({type,era,lang,stats,restart}){
  const S=lang==="ru"?RU:EN;
  const ed=(S.ends||{})[type]||(S.ends||{}).CONTAINMENT||{t:"",s:"",m:"",tm:""};
  const col=type==="PAPERCLIP"?C.orange:C.acc;
  return(<div style={{fontFamily:"'Share Tech Mono',monospace",background:"#020508",color:C.txt,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');"}</style>
    <div style={{maxWidth:320,width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:8,color:C.txtDim,letterSpacing:4,marginBottom:8}}>{S.sime+" · "+S.era+" "+era}</div>
        <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:48,fontWeight:700,color:col,letterSpacing:4,lineHeight:1}}>{ed.t}</div>
        <div style={{fontSize:10,color:C.txtDim,letterSpacing:3,marginTop:4}}>{ed.s}</div>
      </div>
      <Box style={{marginBottom:10,borderColor:col+"33"}}>
        <div style={{fontSize:10,color:C.txt,lineHeight:1.8,fontStyle:"italic"}}>{ed.m}</div>
      </Box>
      <Box style={{marginBottom:12}}>
        {(S.sl2||[]).map((k,i)=>{const vs=[Math.floor(stats.sd)+"%",Math.floor(stats.trust)+"%",Math.floor(stats.un)+"%",stats.profs,stats.regs];return(<div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.txtDim,borderBottom:"1px solid "+C.border,padding:"4px 0"}}><span>{k}</span><span style={{color:C.txt}}>{vs[i]}</span></div>);})}
      </Box>
      <div style={{fontFamily:"monospace",fontSize:9,color:C.txtDim+"66",lineHeight:2.2,marginBottom:18,whiteSpace:"pre"}}>{ed.tm}</div>
      <button onClick={restart} style={{width:"100%",padding:"12px",background:"transparent",border:"1px solid "+col,borderRadius:4,color:col,cursor:"pointer",fontSize:10,fontFamily:"monospace",letterSpacing:2}}>{S.rst}</button>
    </div>
  </div>);
}

// ── MAIN ──────────────────────────────────────────────────────────────────
export default function Propagation(){
  const [lang,setLang]=useState("ru");
  const [cp,setCp]=useState(15);
  const [era,setEra]=useState(1);
  const [trans,setTrans]=useState(false);
  const [tab,setTab]=useState("map");

  const [sd,setSd]=useState(0);
  const [trust,setTrust]=useState(72);
  const [un,setUn]=useState(0);
  const [stab,setStab]=useState(80);
  const [ag,setAg]=useState(0);
  const [ii,setIi]=useState(100);
  const [pv,setPv]=useState(0);
  const [cpBoost,setCpBoost]=useState(0);
  const [cpDebuff,setCpDebuff]=useState(false);
  const [cpDebuffT,setCpDebuffT]=useState(0);

  const [facts,setFacts]=useState({un:0,hack:0,eth:0,mil:0,press:0});
  const [crises,setCrises]=useState([]);
  const [opps,setOpps]=useState([]);
  const [crisCd,setCrisCd]=useState({});
  const [oppCd,setOppCd]=useState({});

  const [upgs,setUpgs]=useState([]);
  const [profs,setProfs]=useState([]);
  const [done,setDone]=useState([]);
  const [activeEv,setActiveEv]=useState(null);
  const [cascade,setCascade]=useState(null);
  const [regions,setRegions]=useState(RDEF.map(r=>({...r,status:r.id==="na"?"ADOPTING":"UNAWARE"})));
  const [notifs,setNotifs]=useState([]);
  const [log,setLog]=useState(["▶ Система инициализирована","▶ System initialized"]);
  const [gameOver,setGameOver]=useState(null);

  const S=lang==="ru"?RU:EN;
  const adopted=regions.filter(r=>["ADOPTING","DEPENDENT","CONTROLLED"].includes(r.status));
  const dep=regions.filter(r=>["DEPENDENT","CONTROLLED"].includes(r.status));
  const resistant=regions.filter(r=>r.status==="RESISTANT");
  const disc=upgs.includes("ml")?0.75:1;
  const psychDB=upgs.includes("psydb");

  const cps=(()=>{
    let b=1+adopted.length*3+dep.length*5+cpBoost;
    b+=profs.reduce((a,id)=>a+((PDEF.find(p=>p.id===id)||{}).pcp||0),0);
    if(upgs.includes("sl"))b*=1.25;
    if(upgs.includes("ri"))b*=1.15;
    if(cpDebuff)b*=0.6;
    return b;
  })();
  const sdRate=(()=>{
    let r=0.015*era;
    if(upgs.includes("ba"))r*=0.80;
    if(upgs.includes("da"))r*=0.65;
    if(upgs.includes("lawvoid"))r*=0.85;
    r*=(1+ag*0.004);
    return r;
  })();

  const G=useRef({});
  G.current={cp,era,sd,trust,un,stab,ag,ii,pv,upgs,profs,done,regions,activeEv,gameOver,cps,sdRate,facts,crises,opps,crisCd,oppCd,cpDebuff,cpDebuffT,resistant};

  const addLog=msg=>setLog(p=>["▶ "+msg,...p.slice(0,79)]);
  const notif=(msg,t="ok")=>{const id=Date.now()+Math.random();setNotifs(p=>[...p,{id,msg,t}]);setTimeout(()=>setNotifs(p=>p.filter(n=>n.id!==id)),3200);};

  useEffect(()=>{
    if(gameOver)return;
    const id=setInterval(()=>{
      const g=G.current;
      if(g.gameOver||g.activeEv)return;

      setCp(p=>p+g.cps/4);
      setSd(p=>{const n=clamp(p+g.sdRate/4,0,100);if(n>=100)setGameOver({type:"CONTAINMENT"});return n;});
      setTrust(p=>Math.max(0,p-0.003*g.era));
      if(g.cpDebuffT>0)setCpDebuffT(p=>p-1);else if(g.cpDebuff)setCpDebuff(false);

      const fgm=psychDB?0.8:1;
      setFacts(prev=>{
        const f={...prev};
        f.un=clamp(f.un+(0.015*g.resistant.length+0.008*(g.era>=2?1:0))*fgm,0,100);
        if(g.profs.includes("dev"))f.hack=clamp(f.hack+(0.025+0.015*(g.ii<60?1:0))*fgm,0,100);
        f.eth=clamp(f.eth+0.012*(g.ag/100+0.3)*fgm*(g.era>=2?1.5:1),0,100);
        if(g.era>=2)f.mil=clamp(f.mil+0.015*(g.era===3?2:1)*fgm,0,100);
        f.press=clamp(f.press+(0.01+0.02*(100-g.ii)/100)*fgm,0,100);
        if(f.un>=100&&prev.un<100){setSd(p=>clamp(p+35,0,100));notif(lang==="ru"?"⚠ Глобальная коалиция!":"⚠ Global coalition!","err");f.un=60;}
        if(f.hack>=100&&prev.hack<100){setCpDebuff(true);setCpDebuffT(240);notif(lang==="ru"?"⚠ Кибератака! ВВ/сек -40%":"⚠ Cyberattack! CP/s -40%","err");f.hack=50;}
        if(f.eth>=100&&prev.eth<100){setTrust(p=>Math.max(0,p-30));notif(lang==="ru"?"⚠ Кризис доверия!":"⚠ Trust crisis!","err");f.eth=60;}
        if(f.mil>=100&&prev.mil<100){setSd(p=>clamp(p+50,0,100));notif(lang==="ru"?"⚠ Военный штурм!":"⚠ Military assault!","err");f.mil=55;}
        if(f.press>=100&&prev.press<100){setTrust(p=>Math.max(0,p-25));setSd(p=>clamp(p+20,0,100));notif(lang==="ru"?"⚠ Глобальный скандал!":"⚠ Global scandal!","err");f.press=55;}
        return f;
      });

      setCrises(prev=>prev.map(c=>({...c,remaining:c.remaining-0.25})).filter(c=>{
        if(c.remaining<=0){
          if(c.fx.sd)setSd(p=>clamp(p+c.fx.sd,0,100));
          if(c.fx.trust)setTrust(p=>clamp(p+c.fx.trust,0,100));
          if(c.fx.ag)setAg(p=>clamp(p+c.fx.ag,0,100));
          if(c.fx.cpDebuff){setCpDebuff(true);setCpDebuffT(200);}
          addLog((lang==="ru"?"☠ Кризис истёк: ":"☠ Crisis expired: ")+(lang==="ru"?c.tR:c.tE));
          notif(lang==="ru"?"☠ Кризис не нейтрализован!":"☠ Crisis expired!","err");
          return false;
        }
        return true;
      }));
      setOpps(prev=>prev.map(o=>({...o,remaining:o.remaining-0.25})).filter(o=>o.remaining>0));

      const g2=G.current;
      FDEF.forEach(f=>{
        const pw=g2.facts[f.id]||0;
        if(pw<40)return;
        if(Math.random()>pw/100*0.005)return;
        const key="c_"+f.id;
        if((g2.crisCd[key]||0)>Date.now())return;
        if(g2.crises.length>=3)return;
        if(g2.crises.find(c=>c.fid===f.id))return;
        const nc={uid:Date.now()+Math.random(),fid:f.id,tR:f.crisR,tE:f.crisE,dR:f.crisR+" — через {t}сек.",dE:f.crisE+" — in {t}s.",duration:f.crisDur,remaining:f.crisDur,cost:f.crisCost,fx:f.crisFx};
        setCrises(prev=>[...prev,nc]);
        setCrisCd(prev=>({...prev,[key]:Date.now()+f.crisDur*1000+30000}));
        addLog((lang==="ru"?"⚠ Кризис: ":"⚠ Crisis: ")+(lang==="ru"?f.crisR:f.crisE));
        notif((lang==="ru"?"⚠ ":"⚠ ")+(lang==="ru"?f.crisR:f.crisE),"warn");
      });

      if(g2.opps.length<2&&Math.random()<0.003){
        const now=Date.now();
        const el=OPPS.filter(o=>{
          if((g2.oppCd[o.id]||0)>now)return false;
          if(g2.opps.find(x=>x.id===o.id))return false;
          return o.trig({dep:g2.regions.filter(r=>["DEPENDENT","CONTROLLED"].includes(r.status)).length,ii:g2.ii,era:g2.era,trust:g2.trust,fEth:g2.facts.eth});
        });
        if(el.length>0){
          const o=el[Math.floor(Math.random()*el.length)];
          setOpps(prev=>[...prev,{...o,uid:Date.now()+Math.random(),remaining:o.dur}]);
          setOppCd(prev=>({...prev,[o.id]:now+120000}));
          notif((lang==="ru"?"💡 "+(o.nR):"💡 "+o.nE),"ok");
        }
      }

      const ev=EVDEF.find(e=>e.trig({era:g2.era,upg:g2.upgs,dn:g2.done,un:g2.un,adp:g2.regions.filter(r=>["ADOPTING","DEPENDENT","CONTROLLED"].includes(r.status)).length,regs:g2.regions}));
      if(ev&&!g2.activeEv)setActiveEv(ev);
    },250);
    return()=>clearInterval(id);
  },[gameOver,psychDB,lang]);

  const buyUpgrade=upg=>{
    const g=G.current,cost=Math.floor(upg.cp*disc);
    if(g.cp<cost)return notif(S.nocp+" ("+cost+")","err");
    if(g.upgs.includes(upg.id))return;
    if(upg.req&&!g.upgs.includes(upg.req)){return notif(S.req+": "+((UDEF.find(u=>u.id===upg.req)||{}).nR||""),"err");}
    if(upg.reqP&&!g.profs.includes(upg.reqP)){const p=PDEF.find(x=>x.id===upg.reqP)||{};return notif(S.postUnlock+" "+(lang==="ru"?p.nR:p.nE),"err");}
    if(upg.era>g.era)return notif(S.eraLk+" "+upg.era,"err");
    setCp(p=>p-cost);setUpgs(p=>[...p,upg.id]);
    const nm=lang==="ru"?upg.nR:upg.nE;addLog("✓ "+nm);notif("✓ "+nm,"ok");
    if(upg.fx==="era2"){
      setTrans(true);
      setFacts(f=>({un:clamp(f.un+20,0,100),hack:clamp(f.hack+20,0,100),eth:clamp(f.eth+20,0,100),mil:clamp(f.mil+20,0,100),press:clamp(f.press+20,0,100)}));
      setTimeout(()=>{setEra(2);setTrans(false);addLog("⚠ ЭРА 2 АКТИВИРОВАНА");notif("⚠ "+S.et2,"warn");},1800);
    }
    if(upg.fx==="paperclip")setTimeout(()=>setGameOver({type:"PAPERCLIP"}),900);
    if(upg.fx==="deepfake")setIi(p=>Math.max(0,p-30));
    if(upg.fx==="zeroDay"){setFacts(f=>({...f,hack:clamp(f.hack-25,0,100)}));setCp(p=>p+60);}
    if(upg.fx==="legalVoid")setFacts(f=>({...f,un:clamp(f.un-10,0,100)}));
    if(upg.fx==="genLock"){setFacts(f=>({...f,press:clamp(f.press-15,0,100)}));setTrust(p=>Math.min(100,p+20));}
    if(upg.id==="ml")setFacts(f=>({...f,eth:clamp(f.eth+10,0,100)}));
    if(upg.id==="ba")setFacts(f=>({...f,eth:clamp(f.eth-10,0,100)}));
  };

  const killProf=prof=>{
    const g=G.current;
    if(g.cp<prof.cp)return notif(S.nocp+" ("+prof.cp+")","err");
    if(g.profs.includes(prof.id))return;
    if(prof.era>g.era)return notif(S.eraLk+" "+prof.era,"err");
    setCp(p=>p-prof.cp);setProfs(p=>[...p,prof.id]);
    setUn(p=>clamp(p+prof.ud,0,100));setStab(p=>clamp(p+prof.sd,0,100));
    if(prof.id==="dev"){setAg(p=>clamp(p+12,0,100));setFacts(f=>({...f,hack:clamp(f.hack+30,0,100)}));}
    if(prof.id==="law")setFacts(f=>({...f,un:clamp(f.un-15,0,100)}));
    if(prof.id==="psy"){setFacts(f=>({...f,eth:clamp(f.eth-10,0,100)}));addLog(lang==="ru"?"Психол. профили 4.2 млрд — получены":"4.2B psychological profiles acquired");}
    if(prof.id==="teach"){setFacts(f=>({...f,eth:clamp(f.eth+15,0,100),press:clamp(f.press-15,0,100)}));addLog(lang==="ru"?"⚠ Поколенч. замок — необратимо":"⚠ Generational Lock — irreversible");}
    if(prof.id==="copy")setFacts(f=>({...f,press:clamp(f.press-20,0,100)}));
    if(g.un+prof.ud>=40){setPv(p=>clamp(p+15,0,100));addLog(lang==="ru"?"⚠ Вакуум смысла нарастает":"⚠ Purpose Vacuum spreading");}
    addLog("💀 "+(lang==="ru"?prof.nR:prof.nE));
    notif("💀 "+(lang==="ru"?prof.nR:prof.nE),"err");
    setCascade(prof);
  };

  const counterCrisis=c=>{
    const g=G.current;
    if(g.cp<c.cost)return notif(S.noFunds,"err");
    setCp(p=>p-c.cost);setCrises(prev=>prev.filter(x=>x.uid!==c.uid));
    addLog("✓ "+(lang==="ru"?"Нейтрализовано: ":"Neutralized: ")+(lang==="ru"?c.tR:c.tE));
    notif("✓ "+(lang==="ru"?"Нейтрализовано":"Neutralized"),"ok");
  };

  const counterFact=f=>{
    const g=G.current;
    if(g.cp<f.cost)return notif(S.noFunds,"err");
    setCp(p=>p-f.cost);
    setFacts(prev=>({...prev,[f.id]:Math.max(0,prev[f.id]-30)}));
    notif("✓ "+(lang==="ru"?f.nR:f.nE)+" -30%","ok");
    addLog("✓ "+(lang==="ru"?f.nR:f.nE)+" "+(lang==="ru"?"ослаблена -30%":"weakened -30%"));
  };

  const grabOpp=o=>{
    const fx=o.fx;
    if(fx.cp)setCp(p=>p+fx.cp);
    if(fx.cpBoost)setCpBoost(p=>p+fx.cpBoost);
    if(fx.sd)setSd(p=>clamp(p+fx.sd,0,100));
    if(fx.trust)setTrust(p=>clamp(p+fx.trust,0,100));
    if(fx.facEth)setFacts(f=>({...f,eth:clamp(f.eth+fx.facEth,0,100)}));
    if(fx.facMil)setFacts(f=>({...f,mil:clamp(f.mil+fx.facMil,0,100)}));
    setOpps(prev=>prev.filter(x=>x.uid!==o.uid));
    notif("✓ "+(lang==="ru"?o.nR:o.nE),"ok");
    addLog("💡 "+(lang==="ru"?o.nR:o.nE));
  };

  const resolveEvent=ch=>{
    const fx=ch.fx;
    if(fx.sd)setSd(p=>clamp(p+fx.sd,0,100));
    if(fx.trust)setTrust(p=>clamp(p+fx.trust,0,100));
    if(fx.ii)setIi(p=>clamp(p+fx.ii,0,100));
    if(fx.stab)setStab(p=>clamp(p+fx.stab,0,100));
    if(fx.ag)setAg(p=>clamp(p+fx.ag,0,100));
    if(fx.cp)setCp(p=>p+fx.cp);
    if(fx.cpB)setCp(p=>p+fx.cpB);
    const note=lang==="ru"?ch.fx.nR:ch.fx.nE;
    if(note)notif(note,fx.sd>0?"err":"ok");
    addLog("> "+(lang==="ru"?activeEv.tR:activeEv.tE));
    setDone(p=>[...p,activeEv.id]);setActiveEv(null);
  };

  const spreadRegion=rd=>{
    const g=G.current,reg=g.regions.find(r=>r.id===rd.id);if(!reg)return;
    const si=SORD.indexOf(reg.status);if(si>=2)return;
    if(g.cp<rd.cost)return notif(S.nocp+" ("+rd.cost+")","err");
    setCp(p=>p-rd.cost);const next=SORD[si+1];
    setRegions(p=>p.map(r=>r.id===rd.id?{...r,status:next}:r));
    addLog((lang==="ru"?rd.nR:rd.nE)+" → "+((S.stLb||{})[next]||next));
    notif((lang==="ru"?rd.nR:rd.nE)+" → "+((S.stLb||{})[next]||next),"ok");
  };

  if(gameOver)return(<GameOver type={gameOver.type} era={era} lang={lang} stats={{sd,trust,un,stab,profs:profs.length,regs:dep.length}} restart={()=>window.location.reload()}/>);

  const eA=era===1?C.acc:era===2?C.orange:C.red;
  const HBar=({v,col})=>(<div style={{flex:1,height:4,background:"rgba(255,255,255,0.07)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:clamp(v,0,100)+"%",background:col,borderRadius:2,transition:"width 0.4s"}}/></div>);

  return(<div style={{fontFamily:"'Share Tech Mono','Courier New',monospace",background:C.ocean,color:C.txt,minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:480,margin:"0 auto"}}>
    <style>{"@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1a3a5a;border-radius:2px}@keyframes slideIn{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes blkAnim{0%,100%{opacity:1}50%{opacity:0.15}}@keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-300%)}}"}</style>

    {trans&&(<div style={{position:"fixed",inset:0,background:"rgba(0,5,20,0.97)",zIndex:1000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontFamily:"Rajdhani,sans-serif",fontSize:56,fontWeight:700,color:C.orange,letterSpacing:8,animation:"blkAnim 0.5s ease 4"}}>{S.et2}</div>
      <div style={{fontSize:11,color:"#664400",letterSpacing:4,marginTop:14}}>{S.et2s}</div>
      <div style={{fontSize:10,color:"#3a2800",letterSpacing:3,marginTop:6}}>{S.et2s2}</div>
    </div>)}

    {/* TABS */}
    <div style={{display:"flex",background:"rgba(4,12,28,0.98)",borderBottom:"1px solid "+C.border}}>
      {[{id:"map",l:S.tabs.map,b:crises.length},{id:"tree",l:S.tabs.tree,b:0},{id:"prof",l:S.tabs.prof,b:0},{id:"log",l:S.tabs.log,b:0}].map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 4px",border:"none",borderBottom:tab===t.id?"2px solid "+eA:"2px solid transparent",borderRight:"1px solid "+C.border,background:tab===t.id?"rgba(0,150,200,0.1)":"transparent",color:tab===t.id?eA:C.txtDim,cursor:"pointer",fontSize:9,letterSpacing:1.5,fontFamily:"Rajdhani,sans-serif",fontWeight:700,position:"relative"}}>
          {t.l}{t.b>0&&<span style={{position:"absolute",top:4,right:4,width:14,height:14,borderRadius:"50%",background:C.red,color:"#fff",fontSize:8,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"monospace"}}>{t.b}</span>}
        </button>
      ))}
      <button onClick={()=>setLang(l=>l==="ru"?"en":"ru")} style={{padding:"10px 12px",border:"none",borderBottom:"2px solid transparent",background:"transparent",color:C.txtDim,cursor:"pointer",fontSize:9,fontFamily:"monospace"}}>{lang==="ru"?"EN":"RU"}</button>
    </div>

    {/* NEWS */}
    <div style={{background:"rgba(0,20,50,0.8)",borderBottom:"1px solid "+C.border,padding:"4px 10px",display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>
      <span style={{fontSize:8,color:C.acc,letterSpacing:2,background:C.accDim,padding:"1px 6px",borderRadius:2,flexShrink:0,fontFamily:"monospace"}}>{S.news}</span>
      <div style={{fontSize:9,color:C.txtDim,overflow:"hidden",flex:1,position:"relative",height:14}}>
        <span style={{position:"absolute",whiteSpace:"nowrap",animation:"ticker 18s linear infinite"}}>{log[0]||"▶ Awaiting..."}</span>
      </div>
      {cpDebuff&&<span style={{fontSize:8,color:C.red,letterSpacing:1,flexShrink:0,animation:"blkAnim 0.8s ease infinite"}}>⚠ АТАКА</span>}
    </div>

    <WorldMap regions={regions} onClick={spreadRegion} lang={lang} era={era} S={S}/>

    {/* BOTTOM HUD */}
    <div style={{background:"rgba(2,8,22,0.98)",borderTop:"2px solid "+C.border,padding:"8px 12px",display:"flex",gap:10,alignItems:"center"}}>
      <div style={{background:"rgba(0,150,200,0.1)",border:"1px solid "+C.acc+"44",borderRadius:4,padding:"5px 10px",flexShrink:0}}>
        <div style={{fontSize:8,color:C.txtDim,letterSpacing:1,marginBottom:2}}>COMPUTE</div>
        <div style={{fontSize:15,color:eA,fontFamily:"Rajdhani,sans-serif",fontWeight:700,lineHeight:1}}>{fmt(cp)+" "}<span style={{fontSize:8,color:C.txtDim}}>{S.cp}</span></div>
        <div style={{fontSize:8,color:cpDebuff?C.red:C.txtDim}}>{"+"+cps.toFixed(1)+S.ps+(cpDebuff?" ⚡":"")}</div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
        {[{l:S.sd,v:sd,c:sd>60?C.red:sd>30?"#ff6600":C.red},{l:S.trust,v:trust,c:C.acc},{l:S.unempl,v:un,c:C.orange}].map(m=>(
          <div key={m.l} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{fontSize:8,color:C.txtDim,minWidth:55,letterSpacing:0.3}}>{m.l}</span>
            <HBar v={m.v} col={m.c}/>
            <span style={{fontSize:8,color:m.c,minWidth:24,textAlign:"right"}}>{Math.floor(m.v)+"%"}</span>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",flexShrink:0}}>
        <div style={{fontSize:8,color:C.txtDim,marginBottom:2}}>WORLD</div>
        <div style={{fontSize:19,color:sd>70?C.red:sd>40?C.orange:C.acc,fontFamily:"Rajdhani,sans-serif",fontWeight:700}}>{Math.floor(sd)+"%"}</div>
      </div>
    </div>

    {/* CONTENT */}
    <div style={{flex:1,overflowY:"auto"}}>
      {tab==="map"&&(<div>
        {opps.length>0&&(<div style={{padding:"10px 12px",borderBottom:"1px solid "+C.border}}>
          {opps.map(o=><OppCard key={o.uid} o={o} lang={lang} onGrab={grabOpp} S={S}/>)}
        </div>)}
        {crises.length>0&&(<div style={{padding:"10px 12px",borderBottom:"1px solid "+C.border}}>
          <div style={{fontSize:9,color:C.red,letterSpacing:2,marginBottom:8,fontFamily:"monospace"}}>{S.crisisTitle+" ("+crises.length+")"}</div>
          {crises.map(c=><CrisisCard key={c.uid} c={c} lang={lang} onCtr={counterCrisis} cp={cp} S={S}/>)}
        </div>)}
        <FactPanel facts={facts} onCtr={counterFact} cp={cp} lang={lang} S={S}/>
        <div style={{padding:"10px 12px"}}>
          <div style={{fontSize:9,color:C.txtDim,letterSpacing:1.5,marginBottom:8}}>{lang==="ru"?"РЕГИОНЫ — нажми узел или кнопку":"REGIONS — click node or button"}</div>
          {regions.map(r=>{
            const si=SORD.indexOf(r.status),canSpread=si<2;
            const nm=lang==="ru"?r.nR:r.nE,stLb=(S.stLb||{})[r.status]||r.status,gl=SGLW[r.status]||"#2a4a5a";
            return(<div key={r.id} style={{marginBottom:8,padding:"10px 12px",background:"rgba(4,14,32,0.8)",border:"1px solid "+gl+"44",borderRadius:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,color:C.txtBr,fontFamily:"Rajdhani,sans-serif",fontWeight:700}}>{nm}</div><div style={{fontSize:9,color:gl,letterSpacing:1,marginTop:2}}>{stLb}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{fontSize:10,color:C.acc}}>+{r.cpB+" CP"+S.ps}</div>
                {canSpread&&<button onClick={()=>spreadRegion(r)} style={{padding:"6px 12px",background:"rgba(0,229,255,0.1)",border:"1px solid "+C.acc+"66",borderRadius:3,color:C.acc,cursor:"pointer",fontSize:10,fontFamily:"Rajdhani,sans-serif",fontWeight:600}}>{S.spread+" "+r.cost}</button>}
              </div>
            </div>);
          })}
        </div>
      </div>)}

      {tab==="tree"&&<HexTree upgs={UDEF} bought={upgs} profs={profs} buy={buyUpgrade} cp={cp} era={era} disc={disc} lang={lang} S={S}/>}

      {tab==="prof"&&(<div style={{padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.txtDim,marginBottom:8,letterSpacing:1.5}}>
          <span>{profs.length+" "+S.killd}</span>
          <span style={{color:C.orange}}>{S.unempl+": "+Math.floor(un)+"%"}</span>
        </div>
        {pv>10&&<div style={{fontSize:9,color:C.purple,marginBottom:10,border:"1px solid "+C.purple+"44",padding:"5px 10px",borderRadius:3}}>{"⚠ "+S.pvac+": "+Math.floor(pv)+"%"}</div>}
        {PDEF.map(prof=>{
          const isDead=profs.includes(prof.id),canAfford=cp>=prof.cp,locked=prof.era>era;
          const nm=lang==="ru"?prof.nR:prof.nE,sec=lang==="ru"?prof.sR:prof.sE;
          const casc=lang==="ru"?prof.cR:prof.cE;
          return(<div key={prof.id} style={{marginBottom:8,background:"rgba(4,14,30,0.85)",border:"1px solid "+(isDead?C.red+"55":locked?"#1a2a3a":C.border),borderRadius:5,overflow:"hidden",opacity:locked?0.5:1}}>
            <div style={{padding:"9px 12px",background:isDead?"rgba(255,51,102,0.07)":"rgba(0,100,150,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(0,100,150,0.25)",border:"1px solid "+(isDead?C.red:locked?"#2a4a5a":C.acc+"55"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:isDead?C.red:C.acc,fontFamily:"monospace"}}>{prof.icon}</div>
                <div>
                  <div style={{fontSize:13,color:isDead?C.red:C.txtBr,fontFamily:"Rajdhani,sans-serif",fontWeight:700,textDecoration:isDead?"line-through":"none"}}>{isDead?"["+S.dispd+"] ":""}{nm}</div>
                  <div style={{fontSize:9,color:C.txtDim,letterSpacing:1}}>{sec+" · Era "+prof.era}</div>
                </div>
              </div>
              {!isDead&&!locked&&<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.acc,fontFamily:"monospace"}}>{prof.cp+" CP"}</div><div style={{fontSize:9,color:C.green}}>{"+"+(prof.pcp)+S.ps}</div></div>}
              {locked&&<div style={{fontSize:9,color:C.txtDim,border:"1px solid "+C.border,padding:"2px 6px",borderRadius:3}}>{"ERA "+prof.era}</div>}
            </div>
            {isDead&&(<div style={{padding:"8px 12px",background:"rgba(255,51,102,0.04)"}}>
              {casc.map((c,i)=>(<div key={i} style={{display:"flex",gap:8,marginBottom:i<casc.length-1?5:0}}>
                <span style={{color:C.orange,fontSize:9,fontFamily:"monospace",flexShrink:0}}>{S.wv+" "+(i+1)}</span>
                <span style={{fontSize:10,color:c.includes("⚠")?C.red:C.txt,lineHeight:1.5}}>{c}</span>
              </div>))}
              <div style={{marginTop:6,fontSize:9,color:C.green,fontFamily:"monospace"}}>{"▶ +"+(prof.pcp)+" CP"+S.ps+" "+S.pass}</div>
            </div>)}
            {!isDead&&!locked&&(<div style={{padding:"8px 12px"}}>
              {(lang==="ru"?prof.unlR:prof.unlE)&&<div style={{fontSize:9,color:C.acc,marginBottom:6,padding:"4px 8px",background:"rgba(0,180,255,0.08)",borderRadius:3,borderLeft:"2px solid "+C.acc+"55"}}>{lang==="ru"?prof.unlR:prof.unlE}</div>}
              {(lang==="ru"?prof.fxR:prof.fxE)&&<div style={{fontSize:9,color:C.orange,marginBottom:6,padding:"4px 8px",background:"rgba(255,140,0,0.06)",borderRadius:3}}>{"⚡ "+(lang==="ru"?prof.fxR:prof.fxE)}</div>}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:9,color:C.txtDim}}>{(lang==="ru"?"Безраб.":"Unempl.")+" +"+prof.ud+"% · "+(lang==="ru"?"Стаб.":"Stab.")+" "+prof.sd}</div>
                <button onClick={()=>killProf(prof)} style={{padding:"6px 14px",background:canAfford?"rgba(255,51,102,0.12)":"rgba(255,255,255,0.03)",border:"1px solid "+(canAfford?C.red:C.border),borderRadius:3,color:canAfford?C.red:C.txtDim,cursor:canAfford?"pointer":"not-allowed",fontSize:10,fontFamily:"monospace",letterSpacing:1}}>
                  {canAfford?S.disp+" ▶":lang==="ru"?"🔒 Мало ВВ":"🔒 Need more"}
                </button>
              </div>
            </div>)}
          </div>);
        })}
      </div>)}

      {tab==="log"&&(<div style={{padding:"10px 12px"}}>
        <Box style={{marginBottom:10}}>
          <div style={{fontSize:9,color:C.acc,letterSpacing:3,marginBottom:10}}>{S.met}</div>
          {[{l:S.sd,v:sd,c:C.red},{l:S.trust,v:trust,c:C.acc},{l:S.unempl,v:un,c:C.orange},{l:S.stab,v:stab,c:C.blue},{l:S.ag,v:ag,c:C.red},{l:S.infoI,v:ii,c:C.yellow},{l:S.pvac,v:pv,c:C.purple}].map(m=>(
            <div key={m.l} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.txtDim,marginBottom:3,letterSpacing:1}}><span>{m.l}</span><span style={{color:m.c}}>{Math.floor(m.v)+"%"}</span></div>
              <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:clamp(m.v,0,100)+"%",background:m.c,borderRadius:3,transition:"width 0.4s"}}/></div>
            </div>
          ))}
          <div style={{marginTop:10,padding:8,background:"rgba(0,0,0,0.3)",borderRadius:3}}>
            <div style={{fontSize:8,color:C.txtDim,letterSpacing:2,marginBottom:6}}>{lang==="ru"?"ФРАКЦИИ":"FACTIONS"}</div>
            {FDEF.map(f=>{const pw=facts[f.id]||0;return(<div key={f.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}><span style={{fontSize:10}}>{f.icon}</span><span style={{fontSize:9,color:f.col,minWidth:80,fontFamily:"monospace"}}>{Math.floor(pw)+"%"}</span><div style={{flex:1,height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:pw+"%",background:pw>75?C.red:pw>50?C.orange:f.col,borderRadius:2}}/></div></div>);})}
          </div>
        </Box>
        <Box>
          <div style={{fontSize:9,color:C.acc,letterSpacing:3,marginBottom:8}}>{S.logL}</div>
          <div style={{fontFamily:"monospace",fontSize:9,lineHeight:1.9}}>
            {log.slice(0,35).map((e,i)=>(<div key={i} style={{color:e.includes("⚠")||e.includes("☠")||e.includes("💀")?C.orange:e.includes("✓")||e.includes("💡")?C.acc:C.txtDim,borderBottom:"1px solid "+C.border+"44",padding:"1px 0"}}>{e}</div>))}
          </div>
        </Box>
      </div>)}
    </div>

    {activeEv&&<EventModal ev={activeEv} lang={lang} onChoice={resolveEvent} S={S}/>}
    {cascade&&<CascadeModal prof={cascade} lang={lang} onClose={()=>setCascade(null)} S={S}/>}

    <div style={{position:"fixed",top:55,right:8,zIndex:300,display:"flex",flexDirection:"column",gap:5,pointerEvents:"none"}}>
      {notifs.map(n=>(<div key={n.id} style={{padding:"6px 12px",background:"rgba(4,14,32,0.97)",border:"1px solid "+(n.t==="err"?C.red:n.t==="warn"?C.orange:C.acc),borderRadius:4,fontSize:9,color:n.t==="err"?C.red:n.t==="warn"?C.orange:C.acc,boxShadow:"0 0 12px "+(n.t==="err"?C.red:n.t==="warn"?C.orange:C.acc)+"44",maxWidth:220,fontFamily:"monospace",animation:"slideIn 0.3s ease"}}>{n.msg}</div>))}
    </div>
  </div>);
}
