import { attachOriginalTextReader } from './sync.mjs';
const root=document.getElementById('answer'), audio=document.getElementById('audio');
const originalHTML=root.innerHTML, words=window.fixture.words;
const results=[];
let reader;
function connect(){
 reader=attachOriginalTextReader({root,audio,words,onState:s=>{
  document.getElementById('state').textContent=`audio ${s.currentTime.toFixed(3)}s  ·  ${s.rate}×  ·  word ${s.active+1}/${words.length}  ·  ${s.rangeText??'静音/未播放'}${s.error?'  ·  '+s.error:''}`;
 }});
}
connect();
document.getElementById('play').onclick=()=>audio.paused?audio.play():audio.pause();
document.getElementById('stop').onclick=()=>reader.stop();
document.getElementById('rate').onchange=e=>audio.playbackRate=Number(e.target.value);
document.getElementById('jump').onclick=()=>audio.currentTime=words.find(w=>w.word==='ideas').start_time+.03;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const assert=(condition,message)=>{if(!condition)throw Error(message);};
async function until(predicate,message,timeout=3000){
 const start=performance.now();
 while(!predicate()){
  if(performance.now()-start>timeout)throw Error(message);
  await delay(20);
 }
}
async function ready(){
 if(audio.readyState>=1)return;
 await new Promise((resolve,reject)=>{audio.addEventListener('loadedmetadata',resolve,{once:true});audio.addEventListener('error',()=>reject(Error('Audio could not decode')),{once:true});});
}
async function seek(time){
 await new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(Error('Seek timeout')),3000);
  audio.addEventListener('seeked',()=>{clearTimeout(timeout);resolve();},{once:true});
  audio.currentTime=time;
 });
 await delay(40);
}
function checkPaint(index){
 const highlight=CSS.highlights.get('castreader-speaking');
 assert(reader.snapshot().active===index,'Wrong active index');
 if(index===-1)assert(!highlight,'Highlight remained during silence');
 else{
  assert(highlight?.size===1,'Missing rendered CSS highlight');
  const range=[...highlight][0];
  assert(range.toString().replace(/[.!]/g,'')===words[index].word,'Wrong original DOM range');
  assert([...range.getClientRects()].some(r=>r.width>0&&r.height>0),'Highlight has no visible rectangle');
 }
}
async function test(name,fn){try{await fn();results.push({name,passed:true});}catch(error){results.push({name,passed:false,error:error.message});}}
window.runSyncTests=async()=>{
 await ready();
 await test('真实 WAV 与时间戳时长匹配',()=>assert(Math.abs(audio.duration-window.fixture.duration)<.03,'Audio/alignment duration mismatch'));
 await test('8 个词逐个跳转，命中原文 Range',async()=>{
  for(let i=0;i<words.length;i++){await seek((words[i].start_time+words[i].end_time)/2);checkPaint(i);}
 });
 await test('静音间隙无残留高亮',async()=>{await seek(1.5);checkPaint(-1);});
 await test('跨行内标签高亮保留原 HTML',async()=>{await seek(2.7);checkPaint(1);assert(root.innerHTML===originalHTML,'Original HTML changed');});
 await test('暂停时音频时间和高亮同时停止',async()=>{
  await seek(.74);await audio.play();await delay(90);audio.pause();await delay(30);
  const t=audio.currentTime, state=reader.snapshot().active;await delay(200);
  assert(Math.abs(audio.currentTime-t)<.02,'Paused clock advanced');assert(reader.snapshot().active===state,'Paused highlight moved');
 });
 await test('2× 播放使用真实音频时钟',async()=>{
  audio.playbackRate=2;await seek(2.65);await audio.play();
  await until(()=>audio.currentTime>2.73,'Media clock did not start');
  const start=audio.currentTime,wall=performance.now();await delay(300);audio.pause();
  const elapsed=(performance.now()-wall)/1000,delta=audio.currentTime-start;await delay(30);
  assert(Math.abs(delta-elapsed*2)<.22,`2x timing mismatch: media=${delta.toFixed(3)}s wall=${elapsed.toFixed(3)}s`);
  const expected=words.findIndex(w=>audio.currentTime>=w.start_time&&audio.currentTime<w.end_time);checkPaint(expected);
 });
 await test('向后跳转不会沿用旧高亮',async()=>{await seek(.9);checkPaint(0);});
 await test('滚动和缩放仍锚定相同文本节点',async()=>{
  await seek(3.5);const range=[...CSS.highlights.get('castreader-speaking')][0];
  document.body.style.zoom='1.1';document.body.style.minHeight='1500px';
  const before=range.getBoundingClientRect().top;window.scrollTo(0,60);await delay(50);
  checkPaint(4);assert(range.startContainer.isConnected,'Range detached');
  assert(window.scrollY>0&&range.getBoundingClientRect().top<before,'Scrolling was not exercised');
  document.body.style.zoom='';document.body.style.minHeight='';window.scrollTo(0,0);
 });
 await test('原回答重渲染时停止并清除',async()=>{
  await seek(3.5);await audio.play();root.innerHTML=originalHTML;await delay(60);
  assert(reader.snapshot().disposed&&audio.paused&&!CSS.highlights.has('castreader-speaking'),'Stale DOM mapping survived');connect();
 });
 await test('原回答移除时停止并清除',async()=>{
  await seek(3.5);await audio.play();const next=root.nextSibling,parent=root.parentNode;root.remove();await delay(60);
  assert(reader.snapshot().disposed&&audio.paused&&!CSS.highlights.has('castreader-speaking'),'Detached answer kept playing');parent.insertBefore(root,next);connect();
 });
 await test('停止与播放结束清除高亮',async()=>{
  await seek(4.9);audio.playbackRate=2;await audio.play();
  await until(()=>audio.ended,'Audio did not finish');await delay(40);
  assert(audio.ended&&!CSS.highlights.has('castreader-speaking'),'End retained highlight');reader.stop();await delay(30);checkPaint(-1);
 });
 await test('释放阅读器同步停止真实音频',async()=>{
  await seek(2.7);await audio.play();
  await until(()=>audio.currentTime>2.75,'Media clock did not start');
  reader.dispose();await delay(40);
  assert(audio.paused&&!CSS.highlights.has('castreader-speaking'),'Disposed reader left audio playing');
 });
 // Fault-injection cases below verify lifecycle handling, not speech alignment quality.
 await test('零秒起始词在停止后不会被异步 seek 重新高亮（边界夹具）',async()=>{
  reader.dispose();audio.pause();
  const fixture=document.createElement('p');fixture.textContent='Hello';root.after(fixture);
  const probe=attachOriginalTextReader({root:fixture,audio,words:[{word:'Hello',start_time:0,end_time:1}],name:'stop-probe'});
  try{
   await seek(.8);probe.stop();await delay(100);
   assert(audio.paused&&probe.snapshot().active===-1&&!CSS.highlights.has('stop-probe'),'Stop repainted the zero-time word');
  }finally{probe.dispose();fixture.remove();}
 });
 await test('媒体错误立即停止并清除（故障注入）',async()=>{
  reader.dispose();connect();await seek(3.5);await audio.play();
  audio.dispatchEvent(new Event('error'));await delay(40);
  assert(reader.snapshot().disposed&&audio.paused&&!CSS.highlights.has('castreader-speaking'),'Media error kept a live reader');
 });
 reader.dispose();connect();
 audio.pause();audio.playbackRate=1;await seek(3.55);
 const passed=results.every(r=>r.passed);
 document.getElementById('summary').textContent=`${results.filter(r=>r.passed).length}/${results.length} 项实验通过。当前画面停在 ideas，方便检查原文定位。`;
 document.getElementById('summary').className=passed?'success':'';
 document.getElementById('checks').replaceChildren(...results.map(r=>{const e=document.createElement('div');e.textContent=(r.passed?'✓ ':'✗ ')+r.name+(r.error?' — '+r.error:'');return e;}));
 return {passed,environment:navigator.userAgent,fixture:{source:'Existing CastReader API generation',generatedAt:window.fixture.generatedAt,duration:audio.duration,wordCount:words.length,audioSha256:window.fixture.audioSha256,newGenerationChargeUSD:'0.000000'},results,codexHostIntegrationTested:false,finalState:reader.snapshot()};
};
