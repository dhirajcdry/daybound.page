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
    frame.src = 'demo/showcase.html';
    frame.title = 'Interactive daybound notebook with fictional in-memory notes';
    frame.loading = 'lazy';
    host.append(frame);
  }
  host.hidden = !host.hidden;
  q('#open-demo').setAttribute('aria-expanded', String(!host.hidden));
  q('#open-demo').textContent = host.hidden ? 'Open the interactive notebook ↗' : 'Close the interactive notebook ↑';
});

// Keep the real calendar and editor isolated from native notebook access.
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
  if (!notebookFrame.getAttribute('src')) notebookFrame.src = 'demo/showcase.html?compact=true';
  else if (notebookReady) sendSelectedDay();
}

calendarFrame.addEventListener('load', () => {
  calendarFrame.hidden = false;
  q('#calendar-fallback').hidden = true;
});
calendarFrame.src = 'demo/showcase.html?view=calendar';
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
