'use strict';
const unitMediaBound=new WeakSet(),unitInputBound=new WeakSet();
function unitTime(value){const n=Math.max(0,Math.floor(value||0));return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');}
function unitToggle(audio){if(!audio)return;if(audio.paused)replayPlay(audio);else audio.pause();}
function unitUpdateMedia(el){const sr=replayRoot(),total=Number.isFinite(el.duration)?el.duration:0;
 if(el.id==='eu-core-audio'){
  const time=sr.getElementById('eu-audio-time'),progress=sr.getElementById('eu-audio-progress'),play=sr.getElementById('eu-audio-play');
  if(time)time.textContent=unitTime(el.currentTime)+' / '+unitTime(total);if(progress)progress.style.width=(total?el.currentTime/total*100:0)+'%';if(play)play.textContent=el.paused?'▶':'❚❚';
  for(const row of sr.querySelectorAll('.eu-reading-row'))row.classList.toggle('active',el.currentTime>=Number(row.dataset.start)&&el.currentTime<Number(row.dataset.end));
 }
 if(el.id==='eu-video'){
  for(const [id,value]of [['eu-time-cur',el.currentTime],['eu-time-tot',total]]){const x=sr.getElementById(id);if(x)x.textContent=unitTime(value);}
  const progress=sr.getElementById('eu-progress');if(progress){progress.max=total;progress.value=el.currentTime;}
  const play=sr.getElementById('eu-icon-play'),pause=sr.getElementById('eu-icon-pause');if(play)play.style.display=el.paused?'block':'none';if(pause)pause.style.display=el.paused?'none':'block';
  const lines=[...sr.querySelectorAll('.eu-sub-line[data-time]')];let index=-1;lines.forEach((row,n)=>{if(Number(row.dataset.time)<=el.currentTime)index=n;});lines.forEach((row,n)=>row.classList.toggle('active',n===index));const overlay=sr.getElementById('eu-sub-overlay');if(overlay)overlay.textContent=index>=0?lines[index].textContent:'';
 }
 if(el.tagName==='VIDEO'&&el.id!=='eu-video'){const local=(el.currentSrc||el.src).replace(rootURL.href,''),cues=window.UNIT3_VIDEO_CUES?.[local]||[],cue=cues.find(x=>el.currentTime>=x.start&&el.currentTime<x.end),toggle=sr.getElementById('eu-video-subtitle-toggle')||sr.getElementById('eu-video-sub-toggle'),on=!toggle||toggle.getAttribute('aria-pressed')!=='false',caption=sr.getElementById('eu-video-caption')||sr.getElementById('eu-video-subtitle-main')||sr.getElementById('eu-video-overlay');if(caption)caption.textContent=on&&cue?cue.text:'';sr.getElementById('eu-video-subtitle-dock')?.classList.toggle('is-empty',!on||!cue);}
 if(el.id==='eu-chant-audio'){const cue=window.UNIT3_CUES?.['3.03']?.find(x=>el.currentTime>=x.start&&el.currentTime<x.end),text=sr.getElementById('eu-chant-subtitle-text');if(text)text.textContent=cue?.text||'';}
 if(el===unitReplay.cbAudio&&unitReplay.cbEntry===replayView.data().id){
  const lines=[...sr.querySelectorAll('.cb-line')],cues=window.UNIT3_CUES?.[unitReplay.cbTrack]||lines.map((x,i)=>({start:Number(x.dataset.time),end:Number(lines[i+1]?.dataset.time||el.duration),text:x.textContent}));let index=cues.findIndex(c=>el.currentTime>=c.start&&el.currentTime<c.end);
  if(index>=0)unitReplay.cbCue=index;if(unitReplay.singleLoop&&unitReplay.cbCue>=0&&cues[unitReplay.cbCue]&&el.currentTime>=cues[unitReplay.cbCue].end){el.currentTime=cues[unitReplay.cbCue].start;index=unitReplay.cbCue;}lines.forEach((line,n)=>line.classList.toggle('active',n===index));const single=sr.getElementById('cb-sub-single');if(single)single.textContent=index>=0?(lines[index]?.textContent||cues[index].text):'';
  for(const [id,value]of [['cb-ctime',el.currentTime],['cb-ttime',total]]){const x=sr.getElementById(id);if(x)x.textContent=unitTime(value);}
  const progress=sr.getElementById('cb-progress');if(progress){progress.max=total;progress.value=el.currentTime;progress.style.background='linear-gradient(to right,#6f42c1 '+(total?el.currentTime/total*100:0)+'%,#e0e0e0 0%)';}
  const play=sr.getElementById('icon-play'),pause=sr.getElementById('icon-pause');if(play)play.style.display=el.paused?'block':'none';if(pause)pause.style.display=el.paused?'none':'block';
 }
}
window.prepareUnitMedia=function(){const sr=replayRoot(),title=sr.getElementById('cb-audio-title')?.textContent,track=title?.trim().match(/Class Audio_(\d+\.\d+)(?: \(\d+\))?\.mp3$/i)?.[1];if(track&&unitReplay.cbEntry!==replayView.data().id){unitReplay.cbAudio?.pause();const observed=Object.keys(UNIT3_ASSETS).find(url=>url.split('/').at(-1).split('?')[0]===title.trim());if(!observed&&!track.startsWith('3.')){unitReplay.unmapped.push({kind:'missing-original-CB-audio',track});return;}unitReplay.cbAudio=new Audio(observed?replayView.assetURL(observed):new URL('audios/original-'+track+'.mp3',rootURL).href);unitReplay.cbEntry=replayView.data().id;unitReplay.cbTrack=track;unitReplay.cbCue=-1;unitReplay.singleLoop=false;}
 if(sr.getElementById('cb-play')&&sr.querySelector('video')&&unitReplay.cbEntry!==replayView.data().id){unitReplay.cbAudio=sr.querySelector('video');unitReplay.cbEntry=replayView.data().id;unitReplay.cbTrack=null;}
 for(const el of replayMedia())if(!unitMediaBound.has(el)){unitMediaBound.add(el);for(const name of ['timeupdate','loadedmetadata','play','pause','ended'])el.addEventListener(name,()=>unitUpdateMedia(el));}
 if(!unitInputBound.has(sr)){unitInputBound.add(sr);sr.addEventListener('input',e=>{const el=e.target,audio=sr.getElementById('eu-core-audio'),video=sr.getElementById('eu-video');if(el.id==='cb-progress'&&unitReplay.cbAudio)unitReplay.cbAudio.currentTime=Number(el.value);if(el.id==='cb-vol-slider'&&unitReplay.cbAudio)unitReplay.cbAudio.volume=Number(el.value);if(el.id==='eu-progress'&&video)video.currentTime=Number(el.value);if(el.id==='eu-vol-slider'&&video)video.volume=Number(el.value);if(el.id==='eu-audio-range'&&audio)audio.currentTime=Number(el.value);});sr.addEventListener('change',e=>{if(e.target.id!=='cb-lang-select')return;const i=replayView.data().frames.findIndex(f=>f.label.endsWith('-lang-'+e.target.value));if(i>=0)replayApply(i,e.target);});}
};
window.unitExtraAudio=function(button,event){const sr=replayRoot(),id=button.id,audio=sr.getElementById('eu-core-audio'),video=sr.getElementById('eu-video');
 if(id==='cb-font-inc'||id==='cb-font-dec'){for(const line of sr.querySelectorAll('.cb-line,#cb-sub-single'))line.style.fontSize=Math.max(14,Math.min(48,parseFloat(getComputedStyle(line).fontSize)+(id.endsWith('inc')?2:-2)))+'px';return 'exclusive';}
 if(id==='cb-btn-fs'){const panel=sr.getElementById('cb-box');if(document.fullscreenElement)document.exitFullscreen();else panel?.requestFullscreen().catch(()=>{});return 'exclusive';}
 if(id==='cb-btn-vol'){const media=unitReplay.cbAudio;if(media){media.muted=!media.muted;sr.getElementById('cb-vol-wave').style.display=media.muted?'none':'';sr.getElementById('cb-vol-slash').style.display=media.muted?'':'none';}return 'exclusive';}
 if(id==='eu-caption-toggle'){const overlay=sr.getElementById('eu-video-overlay'),off=button.textContent.includes('OFF');button.textContent='CC '+(off?'ON':'OFF');if(overlay)overlay.style.display=off?'':'none';return 'exclusive';}
 if(id==='cb-btn-settings'){const panel=sr.getElementById('cb-settings-panel');panel.style.display=getComputedStyle(panel).display==='none'?'block':'none';return 'exclusive';}
 if(id==='eu-btn-cc'){const panel=sr.getElementById('eu-dual-container'),mode=panel.classList.contains('sub-mode-2')?2:panel.classList.contains('sub-mode-1')?1:0,next=(mode+1)%3;panel.classList.toggle('sub-mode-1',next===1);panel.classList.toggle('sub-mode-2',next===2);button.classList.toggle('active',next>0);replayView.fit();return 'exclusive';}
 if(id==='eu-video-subtitle-toggle'||id==='eu-video-sub-toggle'){const on=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(on));button.classList.toggle(id==='eu-video-subtitle-toggle'?'on':'off',id==='eu-video-subtitle-toggle'?on:!on);const caption=sr.getElementById('eu-video-caption');if(caption)caption.classList.toggle('is-hidden',!on);const label=sr.getElementById('eu-video-toggle-text');if(label)label.textContent='Subtitles '+(on?'ON':'OFF');if(!on){const main=sr.getElementById('eu-video-subtitle-main');if(main)main.textContent='';}return 'exclusive';}
 if(id==='cb-play'){unitToggle(unitReplay.cbAudio);return true;}
 if(id==='cb-btn-rewind'||id==='cb-btn-forward'){if(unitReplay.cbAudio)unitReplay.cbAudio.currentTime=Math.max(0,unitReplay.cbAudio.currentTime+(id.endsWith('rewind')?-5:5));return true;}
 if(id==='cb-btn-single-loop'){unitReplay.singleLoop=!unitReplay.singleLoop;button.classList.toggle('active',unitReplay.singleLoop);return 'exclusive';}
 if(id==='cb-btn-loop'){if(unitReplay.cbAudio){unitReplay.cbAudio.loop=!unitReplay.cbAudio.loop;button.classList.toggle('active',unitReplay.cbAudio.loop);}return 'exclusive';}
 if(button.matches('.cb-line')){const n=Number(id.split('-').at(-1)),lines=[...sr.querySelectorAll('.cb-line')],cue=window.UNIT3_CUES?.[unitReplay.cbTrack]?.[n]||{start:Number(button.dataset.time),end:lines[n+1]?Number(lines[n+1].dataset.time):undefined};if(cue)replayPlay(unitReplay.cbAudio,cue.start,cue.end);return true;}
 if(id==='eu-btn-play'){unitToggle(video);return true;}
 if(id==='eu-btn-vol'){if(video){video.muted=!video.muted;const wave=sr.getElementById('eu-vol-wave'),slash=sr.getElementById('eu-vol-slash');if(wave)wave.style.display=video.muted?'none':'block';if(slash)slash.style.display=video.muted?'block':'none';}return 'exclusive';}
 if(id==='eu-btn-fs'){video?.requestFullscreen().catch(()=>{});return true;}
 if(id==='eu-audio-rail'){if(audio&&Number.isFinite(audio.duration)){const r=button.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(event.clientX-r.left)/r.width))*audio.duration;}return true;}
 const named={ 'eu-ac-play':'eu-ac-audio','eu-match-audio-btn':'eu-match-audio','eu-lrqa-audio-btn':'eu-lrqa-audio','eu-chant-play':'eu-chant-audio'};
 if(named[id]){unitToggle(sr.getElementById(named[id])||audio);return true;}
 if(id==='eu-quiz-play-btn'){const n=Number(sr.querySelector('.eu-quiz-num-btn.active')?.dataset.index||0),cue=window.UNIT3_CUES?.['3.06']?.[n];if(cue)replayPlay(sr.getElementById('eu-quiz-audio'),cue.start,cue.end);return true;}
 if(id==='eu-sb-segment-play'){const rows=[...sr.querySelectorAll('#eu-sb-stage .eu-sb-sentence[data-sb-start]')];if(rows.length)replayPlay(sr.getElementById('eu-sb-audio'),Math.min(...rows.map(x=>Number(x.dataset.sbStart))),Math.max(...rows.map(x=>Number(x.dataset.sbEnd))));return true;}
 if(id==='eu-story-scene-audio-btn'){const n=Number(sr.querySelector('.eu-story-dot.active')?.dataset.storyIndex||0),rows=[];let active=false;for(const x of sr.querySelector('#eu-scroll-box').children){if(x.classList.contains('eu-reading-scene'))active=x.textContent.toLowerCase().replace(/\s/g,'')==='scene'+(n+1);else if(active&&x.matches('.eu-reading-row'))rows.push(x);}const player=sr.getElementById('eu-story-scene-audio-player')||audio;if(!player)return 'exclusive';const update=()=>{button.classList.toggle('playing',!player.paused);button.textContent=player.paused?'🔊':'⏸';};player.onplay=update;player.onpause=update;player.onended=update;if(!player.paused)player.pause();else if(rows.length)replayPlay(player,Number(rows[0].dataset.start),Number(rows.at(-1).dataset.end));return 'exclusive';}
 if(id==='eu-ws-main-card'){replayWord(sr.getElementById('eu-ws-main-img').alt);return true;}
 if(button.matches('.eu-sub-line[data-time]')){replayPlay(video,Number(button.dataset.time));return true;}
 if(button.matches('.eu-vq-watch-top')){replayPlay(sr.querySelector('video'),Number(button.dataset.jumpStart),Number(button.dataset.jumpEnd));return true;}
 return false;
};
