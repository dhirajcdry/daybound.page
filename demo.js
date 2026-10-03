// Standalone showcase interactions. No app modules, notebook access, or storage.
const params = new URLSearchParams(location.search);
const calendarOnly = params.get('view') === 'calendar';
const compact = params.get('compact') === 'true';
let selected = '2026-09-30';
let mode = 'note';
let month = 8;
const notes = new Map();
const thoughts = ['A short walk made room for a new idea. #outside', 'Read a few pages and let the afternoon slow down. #reading', 'The small version worked. Keep the next step small too. #making'];
function noteFor(date) {
  if (!notes.has(date)) {
    const day = Number(date.slice(-2));
    notes.set(date, {tasks: [{title:day === 30 ? 'Sketch the reading experience' : 'Make time to read',checked:true},{title:day===30?'Polish the little details':'Take a quiet walk',checked:false}],journal:thoughts[day%3],mood:day===14?4:day%3===0?2+day%4:0,pushed:0,result:''});
  }
  return notes.get(date);
}
function dateKey(year,mon,day){return `${year}-${String(mon+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;}
function renderCalendar() {
  const host=document.querySelector('#calendar');host.replaceChildren();
  const header=document.createElement('div');header.className='month';
  const prev=document.createElement('button');prev.textContent='‹';prev.setAttribute('aria-label','Previous month');prev.onclick=()=>{if(month>0){month--;renderCalendar();}};prev.disabled=month===0;
  const title=document.createElement('span');title.textContent=new Date(2026,month,1).toLocaleDateString('en',{month:'long',year:'numeric'}).toUpperCase();
  const next=document.createElement('button');next.textContent='›';next.setAttribute('aria-label','Next month');next.disabled=month===8;next.onclick=()=>{month++;renderCalendar();};
  header.append(prev,title,next);host.append(header);
  const week=document.createElement('div');week.className='week';for(const name of ['S','M','T','W','T','F','S']){const el=document.createElement('span');el.textContent=name;week.append(el);}host.append(week);
  const grid=document.createElement('div');grid.className='days';const start=new Date(2026,month,1).getDay();
  for(let i=0;i<42;i++){const date=new Date(2026,month,i-start+1);const key=dateKey(2026,date.getMonth(),date.getDate());const b=document.createElement('button');b.type='button';b.textContent=String(date.getDate());b.disabled=date.getMonth()!==month||key>'2026-09-30';b.setAttribute('aria-label',date.toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric'}));b.setAttribute('aria-pressed',String(selected===key));if(!b.disabled){const dot=document.createElement('i');dot.className='dot'+(noteFor(key).mood?' mood':'');b.append(dot);}b.onclick=()=>{selected=key;renderCalendar();parent.postMessage({type:'daybound-calendar-select',dateKey:key},location.origin);};grid.append(b);}host.append(grid);
}
function renderNote(){
  const note=noteFor(selected);const date=new Date(selected+'T12:00:00');
  document.querySelector('#date-title').textContent=date.toLocaleDateString('en',{weekday:'long',month:'long',day:'numeric'});
  const host=document.querySelector('#note-content');host.replaceChildren();
  if(mode==='plan'){
    const plan=document.createElement('div');plan.className='plan';plan.innerHTML='<p class="label">A little shape for the day</p>';
    for(const [i,label] of ['Design the next chapter','Build something useful','Read, reflect, refine'].entries()){
      const row=document.createElement('div');row.className='plan-row';const hour=[9,11,14][i];const t=document.createElement('small');t.textContent=`${hour}:00`;const block=document.createElement('div');block.className='block '+['','teal','amber'][i];const name=document.createElement('b');name.textContent=label;const detail=document.createElement('span');detail.textContent=i===1?`${11+Math.floor(note.pushed/60)}:${String(note.pushed%60).padStart(2,'0')} · 1h${note.result?' · '+note.result:''}`:'A little time to focus';block.append(name,detail);
      if(i===1){const push=document.createElement('button');push.textContent='Push +15m';push.onclick=()=>{note.pushed+=15;renderNote();};const done=document.createElement('button');done.textContent='Mark done';done.onclick=()=>{note.result='Done';renderNote();};block.append(push,done);}row.append(t,block);plan.append(row);
    }host.append(plan);return;
  }
  const page=document.createElement('div');page.className='note';const heading=document.createElement('p');heading.className='label';heading.textContent='Today';page.append(heading);
  const tasks=document.createElement('div');tasks.className='tasks';for(const task of note.tasks){const label=document.createElement('label');label.className='task';const input=document.createElement('input');input.type='checkbox';input.checked=task.checked;input.onchange=()=>task.checked=input.checked;const text=document.createElement('span');text.textContent=task.title;label.append(input,text);tasks.append(label);}page.append(tasks);
  const journal=document.createElement('div');journal.className='journal';const jheading=document.createElement('p');jheading.className='label';jheading.textContent='Journal · 10:45 AM';const textarea=document.createElement('textarea');textarea.setAttribute('aria-label','Write a journal thought');textarea.value=note.journal;textarea.oninput=()=>note.journal=textarea.value;journal.append(jheading,textarea);page.append(journal);
  const moods=document.createElement('div');moods.className='moods';const hint=document.createElement('small');hint.textContent='How was today?';moods.append(hint);for(let i=1;i<=5;i++){const b=document.createElement('button');b.setAttribute('aria-label',`Mood ${i} of 5`);b.setAttribute('aria-pressed',String(note.mood===i));b.onclick=()=>{note.mood=note.mood===i?0:i;renderNote();};moods.append(b);}page.append(moods);const file=document.createElement('p');file.className='day-file';file.textContent=selected+'.md';page.append(file);host.append(page);
}
if(calendarOnly){document.body.classList.add('calendar-only');document.querySelector('#notebook').hidden=true;document.querySelector('#calendar').hidden=false;renderCalendar();}else{
  if(compact)document.body.classList.add('compact');renderNote();document.querySelector('#switch-view').onclick=()=>{mode=mode==='note'?'plan':'note';document.querySelector('#switch-view').textContent=mode==='note'?'Day view':'Notebook';renderNote();};document.querySelector('#reset').onclick=()=>{notes.clear();mode='note';document.querySelector('#switch-view').textContent='Day view';renderNote();};
  addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='daybound-show-date')return;if(typeof event.data.dateKey!=='string'||!/^2026-\d{2}-\d{2}$/.test(event.data.dateKey))return;selected=event.data.dateKey;renderNote();});parent.postMessage({type:'daybound-notebook-ready'},location.origin);
}
