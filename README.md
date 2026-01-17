# Portfolio Website

Source code for my personal developer portfolio. This project focuses on performance, accessibility, and a clean codebase without heavy framework dependencies.

## Architecture & Tech Stack

Built using a vanity-free stack to ensure maximum performance and control over the rendering pipeline.

*   **Core**: Semantic HTML5, CSS3, ES6+ JavaScript.
*   **Styling**: CSS Custom Properties (Variables) for theming and layouts. Zero external CSS frameworks.
*   **Icons**: SVG assets and Devicon.
*   **Fonts**: Inter (Google Fonts).

## Implementation Details

### Theming System
The dark/light mode toggle uses CSS variables (`--bg-color`, `--text-color`) mapped to a `data-theme` attribute on the `<body>` tag. State is persisted via `localStorage` to maintain user preference across sessions.

### Performance
*   **Lazy Loading**: Images and heavy assets are lazy-loaded where appropriate.
*   **Animations**: Uses the `IntersectionObserver` API for scroll-triggered animations, avoiding expensive scroll event listeners.
*   **Bundling**: Zero build steps required; runs natively in modern browsers.

### Project Structure

```
d:/portfolio
├── assets/          # Static assets (images, SVGs, PDF resume)
├── css/
│   └── styles.css   # Main stylesheet using CSS variables
├── js/
│   └── main.js      # Interaction logic (DOM, Events, Observer)
└── index.html       # Main entry point
```

## Local Development

Since this project uses native web technologies, no package manager (npm/yarn) is strictly required.

1.  Clone the repository:
    ```bash
    git clone https://github.com/abdullahkapadia/portfolio.git
    ```
2.  Open `index.html` in your browser.

*Note: For the best development experience (auto-reload), use the Live Server extension in VS Code.*

## License

© 2026 Abdullah Kapadia. All rights reserved.
