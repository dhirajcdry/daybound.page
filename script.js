const q = selector => document.querySelector(selector);
const qa = selector => [...document.querySelectorAll(selector)];

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08 });
  qa('.reveal').forEach(element => observer.observe(element));
}

function activate(selector, current) {
  qa(selector).forEach(button => {
    const active = button === current;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

const video = q('#walkthrough');
qa('[data-view]').forEach(button => button.addEventListener('click', () => {
  const day = button.dataset.view === 'day';
  activate('[data-view]', button);
  video.pause();
  video.hidden = true;
  q('#product-frame').hidden = false;
  q('#product-image').src = `assets/showcase/mac-${day ? 'day' : 'note'}.png`;
  q('#product-image').alt = day ? 'Actual daybound React Day view with three fictional time blocks' : 'Actual daybound React notebook with fictional tasks and journal';
  q('#view-label').textContent = day ? 'The day planner' : 'The notebook';
  q('#play-button').hidden = false;
}));
q('#play-button').addEventListener('click', () => {
  q('#product-frame').hidden = true;
  video.hidden = false;
  q('#play-button').hidden = true;
  video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
});
qa('[data-mode]').forEach(button => button.addEventListener('click', () => {
  activate('[data-mode]', button);
  const source = button.dataset.mode === 'source';
  q('#file-page').hidden = source;
  q('#file-source').hidden = !source;
}));
const notes = {
  paper: 'Warm paper. Iowan Old Style. Room to breathe.',
  linear: 'Cool graphite and violet. A precise, quiet desk.',
  modern: 'True black. Vermilion red. A little Swiss confidence.',
  typewriter: 'Sepia pages. American Typewriter. A familiar ritual.',
  sakura: 'Blossom pink. Plum ink. A softer kind of focus.',
};
qa('[data-theme]').forEach(button => button.addEventListener('click', () => {
  activate('[data-theme]', button);
  const theme = button.dataset.theme;
  q('#theme-image').src = `assets/showcase/theme-${theme}.png`;
  q('#theme-image').alt = `Actual daybound Mac notebook components in the ${button.textContent} theme`;
  q('#theme-note').textContent = notes[theme];
}));
q('#open-demo').addEventListener('click', () => {
  const host = q('#demo-host');
  if (!host.firstChild) {
    const frame = document.createElement('iframe');
    frame.src = 'demo.html';
    frame.title = 'Interactive daybound product illustration with fictional notes';
    frame.loading = 'lazy';
    host.append(frame);
  }
  host.hidden = !host.hidden;
  q('#open-demo').setAttribute('aria-expanded', String(!host.hidden));
  q('#open-demo').textContent = host.hidden ? 'Open the interactive notebook ↗' : 'Close the interactive notebook ↑';
});

// Standalone marketing interactions; production app modules stay private.
const calendarFrame = q('#inline-calendar');
const notebookFrame = q('#calendar-note-frame');
let selectedDay = '2026-09-30';
let notebookReady = false;
function sendSelectedDay() {
  notebookFrame.contentWindow.postMessage({ type: 'daybound-show-date', dateKey: selectedDay }, location.origin);
}
function openCalendarDay(dateKey) {
  selectedDay = dateKey;
  q('#selected-file').textContent = `${dateKey}.md`;
  q('.calendar-copy').hidden = true;
  q('#calendar-notebook').hidden = false;
  if (!notebookFrame.getAttribute('src')) notebookFrame.src = 'demo.html?compact=true';
  else if (notebookReady) sendSelectedDay();
}

calendarFrame.addEventListener('load', () => {
  calendarFrame.hidden = false;
  q('#calendar-fallback').hidden = true;
});
calendarFrame.src = 'demo.html?view=calendar';
window.addEventListener('message', event => {
  if (event.origin !== location.origin) return;
  if (event.source === notebookFrame.contentWindow && event.data?.type === 'daybound-notebook-ready') {
    notebookReady = true;
    sendSelectedDay();
    return;
  }
  if (event.source !== calendarFrame.contentWindow) return;
  if (event.data?.type === 'daybound-calendar-select') openCalendarDay(event.data.dateKey);
});
q('#close-calendar-note').addEventListener('click', () => {
  q('#calendar-notebook').hidden = true;
  q('.calendar-copy').hidden = false;
  calendarFrame.focus();
});
q('#calendar-invitation').addEventListener('click', event => {
  event.preventDefault();
  openCalendarDay(selectedDay);
});

qa('[data-planner]').forEach(button => button.addEventListener('click', () => {
  activate('[data-planner]', button);
  const view = button.dataset.planner;
  const file = view === 'day' ? 'mac-day.png' : view === 'block' ? 'mac-block.png' : 'mac-review.png';
  q('#planner-image').src = `assets/showcase/${file}`;
  q('#planner-image').alt = {day:'Current Mac timeline with fictional time blocks',block:'Current Mac block card showing reminder and push controls',review:'Current Mac block card showing Done, Partly and Skipped outcomes'}[view];
  q('#planner-image').closest('[data-zoom]').dataset.zoom = file;
  q('#planner-label').textContent = {day:'The shape of a day',block:'A little control, where you need it',review:'A record of what actually happened'}[view];
}));
qa('[data-phone]').forEach(button => button.addEventListener('click', () => {
  activate('[data-phone]', button);
  const view=button.dataset.phone;
  q('#phone-image').src=`assets/showcase/iphone-${view}.png`;
  q('#phone-image').alt=`Native iPhone Simulator capture: ${view}, with fictional notes`;
  q('#phone-zoom').dataset.zoom=`iphone-${view}.png`;
  q('#phone-caption').textContent={day:'Native SwiftUI notebook',plan:'Native visual planner',block:'Native block controls',dark:'The notebook, after dark'}[view];
}));
qa('[data-widget]').forEach(button => button.addEventListener('click', () => {
  activate('[data-widget]', button);
  const view=button.dataset.widget;
  q('#widget-image').src=`assets/showcase/widget-${view}.png`;
  q('#widget-image').alt=`Native WidgetKit ${view==='plan'?'plan':'task'} layout with fictional content`;
  q('#widget-zoom').dataset.zoom=`widget-${view}.png`;
  q('#widget-description').textContent=view==='plan'?'See the current block, what comes next, and a miniature timeline of the rest of the day.':'Today, Later, and task shortcuts. Individual task links lead back into the app.';
}));
const layers={mac:['Inside the Mac','One document. Two ways to work.','The live-preview editor and visual timeline operate on the same Markdown string. Syntax decorations reveal the active line; plan gestures become document rewrites. Rust owns file access, the native menubar clock, and reminders.'],ios:['Inside the iPhone','Native views. Shared document rules.','SwiftUI draws the phone interface. JavaScriptCore runs the shared TypeScript document engine for parsing and rewrites. Files permissions belong to iOS, saves check for conflicting changes, and local notifications are scheduled by the system.'],widget:['On the Home Screen','Fast glances, from a derived snapshot.','The phone refreshes a snapshot in the shared app-group container. WidgetKit renders tasks or a plan timeline; App Intents change the face without launching the app. Timed entries update the plan, while another device’s edits require the phone to reload the note.']};
qa('[data-layer]').forEach(button=>button.addEventListener('click',()=>{activate('[data-layer]',button);const [label,title,detail]=layers[button.dataset.layer];q('#architecture-label').textContent=label;q('#architecture-title').textContent=title;q('#architecture-detail').textContent=detail;}));
const imageDialog=q('#image-dialog');
qa('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{q('#enlarged-image').src=`assets/showcase/${button.dataset.zoom}`;q('#enlarged-image').alt=button.querySelector('img').alt;q('#enlarged-caption').textContent=button.querySelector('img').alt;imageDialog.showModal();}));
q('#close-image').addEventListener('click',()=>imageDialog.close());
imageDialog.addEventListener('click',event=>{if(event.target===imageDialog)imageDialog.close();});

const accessDialog = q('#access-dialog');
qa('[data-request-access]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  accessDialog.showModal();
}));
q('#close-access-dialog').addEventListener('click', () => accessDialog.close());
accessDialog.addEventListener('click', event => {
  if (event.target === accessDialog) {
    const bounds = accessDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) accessDialog.close();
  }
});
