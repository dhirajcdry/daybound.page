<p align="center"><a href="https://daybound.page"><img src="assets/showcase/hero.png" alt="Daybound: a daily notebook, visual planner, native iPhone app, and Home Screen widgets" width="100%"></a></p>

<p align="center"><strong>A day. A page. A little peace.</strong><br>Plans, tasks, and passing thoughts—one plain Markdown file per day.</p>
<p align="center"><a href="https://daybound.page">Explore the experience ↗</a> · <a href="https://daybound.page/#access">Request early access</a> · <a href="https://daybound.page/#planner">The planner</a> · <a href="https://daybound.page/#pocket">iPhone & widgets</a> · <a href="ENGINEERING.md">Engineering case study</a></p>
<p align="center"><sub>An independent product and engineering project by Dhiraj.<br>React 19 · CodeMirror 6 · Tauri 2 · Rust · SwiftUI · JavaScriptCore · WidgetKit</sub></p>

## Small enough for every day. Thoughtful enough to keep.

Daybound lives in the Mac menubar, travels with you on iPhone, and keeps the next thing close on your Home Screen. Write directly on the page, give the day a visual plan, and come back to a journal that stays in ordinary `YYYY-MM-DD.md` files.

This public repository is the **product showcase and engineering case study**. The app source remains private. Explore the [live site](https://daybound.page) for interactive illustrations, full-size screenshots, themes, and the architecture walkthrough.

## The day, in motion

<p align="center"><img src="assets/showcase/walkthrough.gif" alt="Recorded current Mac UI: task editing, visual planning, block controls, and themes" width="440"></p>
<p align="center"><sub>Recorded from the real Mac components in an isolated browser preview, using fictional notes.<br><a href="https://daybound.page/#experience">Watch the video ↗</a></sub></p>

## Make room for the thought. Make time for the work.

<table><tr><td width="50%" align="center"><img src="assets/showcase/mac-note.png" width="390" alt="Current Mac live-preview notebook with fictional tasks and journal"></td><td width="50%" align="center"><img src="assets/showcase/mac-block.png" width="390" alt="Current Mac plan with reminder and push controls"></td></tr><tr><td align="center"><strong>A quietly editable page.</strong><br><sub>Live Markdown, task reordering, timestamped journal entries, links, tags, mood, and daily carry-forward.</sub></td><td align="center"><strong>A plan that leaves room for life.</strong><br><sub>Move and resize blocks, preview pushes, set reminders, record outcomes, and create follow-up sessions.</sub></td></tr></table>

The editor and planner are two views of one document. A gesture changes the Markdown; the timeline does not maintain a second schedule database. A native Rust clock keeps the menubar readout current while the hidden webview sleeps.

## The same day, a little closer

<table><tr><td width="50%" align="center"><img src="assets/showcase/iphone-day.png" width="270" alt="Native iPhone notebook in Paper theme"></td><td width="50%" align="center"><img src="assets/showcase/iphone-plan.png" width="270" alt="Native iPhone visual plan with colored blocks"></td></tr><tr><td align="center"><strong>A native place for the small moments.</strong><br><sub>Tasks, rich links, journal, mood, and five themes in SwiftUI.</sub></td><td align="center"><strong>The plan comes with you.</strong><br><sub>Shared document rules, native block controls, reminders, and outcomes.</sub></td></tr></table>

<table><tr><td width="50%" align="center"><img src="assets/showcase/widget-plan.png" width="340" alt="Native large plan widget layout"></td><td width="50%" align="center"><img src="assets/showcase/widget-large.png" width="340" alt="Native large tasks widget layout"></td></tr><tr><td align="center"><strong>See what comes next.</strong><br><sub>A current-block readout and a miniature timeline.</sub></td><td align="center"><strong>Keep the thread.</strong><br><sub>Today, Later, and task shortcuts.</sub></td></tr></table>

Widgets offer small, medium, and large layouts. An App Intent switches Tasks and Plan without launching the app. They read a derived snapshot refreshed by the phone; edits made elsewhere appear after the phone reloads the note. iCloud controls file delivery timing.

## The engineering behind the quiet

| Design decision | Why it matters |
| --- | --- |
| One TypeScript document engine, shared with iPhone through JavaScriptCore | Both platforms interpret and rewrite the same Markdown dialect. |
| CodeMirror live preview with minimal document diffs | Reading and editing share a surface; programmatic changes preserve the caret. |
| Document-based plan rewrites | Movement, outcomes, and reminders remain part of the file you own. |
| Native Rust menubar and OS reminders | Time-sensitive work continues outside the hidden webview. |
| SwiftUI + WidgetKit with an app-group snapshot | Native presentation with explicit widget freshness boundaries. |
| Conflict checks before iPhone saves | A newer file is offered for resolution instead of silently overwritten. |

[Read the architecture, tradeoffs, and verification approach →](ENGINEERING.md)

## About this showcase

All notes are fictional. Mac screens are renders of the actual app components; iPhone screens are native Simulator captures; widgets are native layouts rendered in an isolated SwiftUI host. The browser demo is a separate product illustration, not the app implementation. No public app download or App Store distribution is offered here.

Daybound began as a personal fork of [Daily by hellorashid](https://github.com/hellorashid/daily). That menubar notebook provided the starting point; Daybound's subsequent work includes live-preview editing, planning, journaling, shared document rules, and native iPhone and widget experiences.
