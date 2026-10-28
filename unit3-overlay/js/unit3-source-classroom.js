'use strict';
// Keep the saved original interface. Self-authored content lives in one additional sidebar tab.
const sourceLessonEntries=['p030-item03','p031-item05','p032-item03','p033-item03','p034-item06','p035-item04','p036-item05','p037-item05','p038-item04','p039-item06','p040-item05','p041-item04'];
const topic=document.getElementById('classroom-topic');
for(const [i,s]of UNIT3_CLASSROOM.lessons.entries())topic.append(new Option('P'+s.page+' · '+s.title,i));
function sourceClassroomLesson(i){i=Number(i);if(!Number.isInteger(i)||i<0||i>11)return;window.closeUnitModule();bookCourseware.select(3);document.getElementById('page-number').value=30+i;document.getElementById('page-number').dispatchEvent(new Event('change'));topic.value=i;unitCourseware.open(sourceLessonEntries[i]);}
topic.onchange=()=>sourceClassroomLesson(Number(topic.value));
const sourceActivitiesBase=window.prepareUnitActivities;
window.prepareUnitActivities=function(){sourceActivitiesBase?.();installSelfPractice();};
function selfEl(tag,text,cls){const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;}
function selfButton(text,fn){const x=selfEl('button',text);x.type='button';x.onclick=e=>{e.stopPropagation();fn();};return x;}
function closeSelfGame(sr){window.partyGames?.stop();const stage=sr.querySelector('.self3-stage');if(!stage)return;replayStop();const tabs=[...sr.querySelectorAll('.eu-sidebar .eu-thumb-btn')];tabs.forEach((x,i)=>x.classList.toggle('active',String(i)===stage.dataset.sourceActive));const title=sr.querySelector('.eu-title-text');if(title)title.textContent=stage.dataset.sourceTitle||title.textContent;stage.remove();}
function installSelfPractice(){const sr=replayRoot(),page=replayView.data()?.page;if(page<30||page>41)return;window.partyGames?.install(sr);const sidebar=sr.querySelector('.eu-sidebar'),board=sr.querySelector('.eu-canvas-board');if(!sidebar||!board||sr.getElementById('self3-tab'))return;
 const style=selfEl('link');style.rel='stylesheet';style.href=new URL('js/unit3-supplement-game.css?v=experience2',rootURL).href;sr.append(style);
 const tab=selfEl('div',undefined,'eu-thumb-btn');tab.id='self3-tab';tab.role='button';tab.tabIndex=0;tab.setAttribute('aria-label','Party Quest games');tab.append(selfEl('span',String(sidebar.children.length+1),'eu-thumb-num'),selfEl('div','🎮','eu-thumb-icon'),selfEl('div',page===32?'Story Order':page===33?'Habit or Now?':'Party Quest','eu-thumb-txt'));sidebar.append(tab);
 function open(){replayStop();window.stopUnitActivities?.();closeSelfGame(sr);const active=[...sidebar.children].findIndex(x=>x.classList.contains('active'));const oldTitle=sr.querySelector('.eu-title-text');const overlay=selfEl('section',undefined,'self3-stage');overlay.setAttribute('aria-label','Party Quest games');overlay.classList.add('self3-game');overlay.dataset.sourceActive=String(active);overlay.dataset.sourceTitle=oldTitle?.textContent||'';for(const b of sidebar.children)b.classList.toggle('active',b===tab);if(oldTitle)oldTitle.textContent=page===32?'Story Order · The Friendly Farm':page===33?'Habit or Now? · Grammar':'Party Games · Unit 3';tab.scrollIntoView({block:'nearest'});overlay.addEventListener('click',e=>e.stopPropagation());board.append(overlay);if(page===32||page===33)window.unit3PageGames(overlay,page);else partyGames.menu(overlay,page);}
 tab.addEventListener('click',e=>{e.stopImmediatePropagation();open();});tab.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};
 sr.addEventListener('click',e=>{if(e.target.closest('.eu-thumb-btn,.eu-tab-btn')&& !e.target.closest('#self3-tab'))closeSelfGame(sr);},true);
}
function renderSelf(stage,page){return partyGames.render(stage,page);}
// Start in the original Party words module; all other saved unit entries stay reachable through the book hotspots.
sourceClassroomLesson(1);
