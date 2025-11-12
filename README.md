# Ali Abouelazm — Portfolio

Single-page personal website for Ali Abouelazm, undergraduate data scientist focused on applied ML, analytics, and sports technology.

## Tech Stack

- HTML5  
- CSS3 (no preprocessors)  
- Vanilla JavaScript (no frameworks)  

## Project Structure

- `index.html` — semantic markup for all portfolio sections
- `styles.css` — global theme, layout, motion, and accessibility styles
- `main.js` — smooth navigation, scrollspy, and keyboard shortcuts
- `resume/Ali_Abouelazm_Resume.pdf` — résumé download target (placeholder path)
- `fonts/PublicoHeadlineWeb-Bold.woff2` — heading font (supply licensed file or adjust font stack)

## Local Development

No build step is required. Open `index.html` directly in your browser, or serve the folder with any static server, for example:

```bash
npx serve .
```

> **Font note:** Publico Headline Web is a licensed typeface. Place your licensed `PublicoHeadlineWeb-Bold.woff2` file in the `fonts/` directory (or update `styles.css` to reference a different heading font).

## Deployment

### GitHub Pages

1. Push the repository to GitHub (e.g., `main` branch).
2. In the GitHub repository, navigate to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch (`main`) and the `/root` folder, then click **Save**.
5. Wait for GitHub Pages to build; your site will be live at `https://<username>.github.io/<repo>/`.

### Netlify

1. Create a Netlify account (or sign in).
2. Click **Add new site → Import an existing project**.
3. Connect the GitHub repository containing this project.
4. For build settings, choose **Build command: _None_** and **Publish directory: /**.
5. Deploy the site. Netlify will provide a live URL, which you can customize under **Site settings → Domain management**.

## Accessibility & Keyboard Shortcuts

- Skip-to-content link (`Tab` from top of page)
- Number keys `1-6` jump to corresponding sections
- `ArrowLeft` / `ArrowRight` navigate between sections
- `ArrowUp` / `ArrowDown` scroll within the current section

## License

MIT License. See `LICENSE` if provided.*** End Patch

