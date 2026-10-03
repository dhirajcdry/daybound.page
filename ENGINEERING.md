# Engineering case study

## One file, three surfaces

daybound is a local first notebook whose durable model is a folder of Markdown
files. The Mac shell is Tauri 2 with a Rust backend and a React 19 frontend.
The iPhone app is SwiftUI. Both platforms interpret the same document dialect
through a shared document core: one TypeScript grammar feeds parsing,
journal extraction, inline tags, task operations, and the day plan. The iPhone
bundles a deliberately small JavaScriptCore bridge rather than maintaining a
second parser in Swift.

## A readable page that is still an editor

The editor is live preview. CodeMirror decorations hide Markdown syntax on
inactive lines and reveal it at the caret, so reading and editing share one
surface. Programmatic rewrites use a common prefix and suffix diff to preserve
the selection and caret. Task reordering is a transaction on the source text;
the drag layer is only a visual projection while the operation is in flight.

## The timeline is a projection, not a second database

The Day view treats the `## Plan` section as a projection of the same file.
Time block insert, move, resize, rename, removal, outcome updates, reminder
overrides, pushes, and follow-up sessions are owned by plan logic that returns
new note text. A reviewed block keeps its history. A follow-up inherits only
the reminder override. Reviewed blocks and overlaps are checked before a move,
and rejected operations explain the conflict instead of silently changing the
schedule.

## Native work survives the hidden webview

The Mac menubar readout is native Rust because the hidden web view cannot be
trusted to keep JavaScript timers alive. Rust selects the current block, or a
nearby upcoming block, updates the title, and swaps a pre-rendered SF Symbol
template for the task icon. When there is nothing imminent it paints an idle
icon and an empty title. The Mac reminder scheduler also lives in Rust, keys
delivery to the active notebook and date, persists delivery state, and avoids
replaying stale alerts after sleep.

## A native companion and a bounded widget snapshot

The iPhone keeps plan presentation in shared SwiftUI types. The app and widgets
share task colours, task symbols, and a derived day snapshot through the app
group. Tasks and Plan are two faces of the widget; small, medium, and large
layouts expose different amounts of the same snapshot. The app refreshes that
snapshot after loading or editing a note, while the Markdown file remains the
source of truth. Conflict detection protects an on-screen edit when the file
changes elsewhere and gives the user a deliberate resolution path.

## Tradeoffs and verification

Document-model tests exercise parsing and rewrites. Headless browser tests drive the real editor and timeline, including task rendering and snapped drag positions. Native reminder checks exercise scheduling behavior. A scheduled request alone does not prove that a notification banner appeared.

These choices have clear limits. A notebook is still a file, so iCloud and
other sync providers decide when another device sees an edit. The public demo
uses fictional in-memory data and cannot demonstrate native file access,
notifications, menubar behavior, or widget refresh. Native notification
delivery and real-device sync require platform permission and hardware checks.

## Origin and scope

The project began as a personal fork of [Daily](https://github.com/hellorashid/daily).
This case study describes the current product and does not reproduce private
source paths, credentials, or large source excerpts. Upstream attribution and
redistribution terms still need explicit review before distributing builds.


[Explore the product](https://daybound.page) · [Back to the showcase](README.md)
