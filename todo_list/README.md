# Quill — A Minimal To-Do Website

A clean, distraction-free to-do app built with **plain HTML, CSS, and JavaScript**.
No frameworks, no build step. Just open `index.html` in your browser.

## Features

- Add, complete, edit (double-click), and delete tasks
- Filter by All / Active / Done
- Clear all completed tasks
- Live counters (total + done)
- **Persistence via `localStorage`** — your tasks survive a refresh
- Fully responsive design

## How to run

1. Unzip the folder.
2. Open `index.html` in any modern browser.

That's it — no server or installation required.

## File structure

```
quill-todo/
├── index.html          # Markup
├── css/
│   └── style.css       # Styles
├── js/
│   └── script.js       # App logic + localStorage
├── images/
│   ├── hero.jpg        # Hero banner
│   ├── favicon.svg
│   ├── icon-check.svg
│   ├── icon-plus.svg
│   ├── icon-edit.svg
│   └── icon-trash.svg
└── README.md
```

## Customize

- **Colors**: edit the CSS variables at the top of `css/style.css` (`--accent`, `--bg`, etc.)
- **Storage key**: change `STORAGE_KEY` in `js/script.js`
- **Hero image**: replace `images/hero.jpg` with your own

Free to remix. Have fun.
