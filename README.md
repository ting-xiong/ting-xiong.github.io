# Ting Xiong Portfolio

A Vue 3 portfolio site for costume design work, hosted on GitHub Pages.

**Data structure (all in `public/portfolio/`):**
- **Slug**: from folder name (e.g. `concept/lifes-loom/`)
- **Metadata**: `metadata.yml` in each project folder (title, category, subtitle, cover)
- **Order**: `order.yml` in each category folder (list of project slugs in display order)
- **Images**: scanned from the folder
- **Config**: `config.json` for owner, repo, branch, categories
- **Hero images**: scanned from `hero/` folder

The manifest (`projects.json`) is auto-generated when you run `npm run dev` or `npm run build`. Add a new project by creating a folder with images and a `metadata.yml` file.

## Preview Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

To preview the production build locally:
   ```bash
   npm run build
   npm run preview
   ```

## Deploy to GitHub Pages

### One-time setup

1. In your GitHub repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.

### Deploy

Push to the `master` branch. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. Build the Vue app
2. Deploy the output to GitHub Pages

Your site will be live at `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` for a user site like `ting-xiong.github.io`).
