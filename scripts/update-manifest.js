/**
 * Scans project folders in public/portfolio/{category}/ and builds projects.json.
 * - Slug: from folder name
 * - Metadata: from metadata.yml in each folder (title, category, subtitle, cover)
 * - Order: from order.yml in each category folder (list of slugs)
 * - Images: scanned from folder
 * - If metadata.yml is missing: uses placeholder values
 */
import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PORTFOLIO = join(ROOT, 'public', 'portfolio')
const IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp)$/i

async function getImageFiles(dir) {
  try {
    const files = await readdir(dir)
    return files
      .filter((f) => IMAGE_EXT.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  } catch {
    return []
  }
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function readMetadata(category, slug) {
  const metadataPath = join(PORTFOLIO, category, slug, 'metadata.yml')
  try {
    const content = await readFile(metadataPath, 'utf-8')
    const parsed = yaml.parse(content)
    return {
      title: parsed?.title ?? slugToTitle(slug),
      category: parsed?.category ?? category,
      subtitle: parsed?.subtitle ?? '',
      cover: parsed?.cover ?? '',
    }
  } catch {
    return {
      title: slugToTitle(slug),
      category,
      subtitle: '',
      cover: '',
    }
  }
}

async function readCategoryOrder(categoryId) {
  const orderPath = join(PORTFOLIO, categoryId, 'order.yml')
  try {
    const content = await readFile(orderPath, 'utf-8')
    const parsed = yaml.parse(content)
    const list = Array.isArray(parsed) ? parsed : parsed?.order ?? parsed?.projects ?? []
    return new Map(list.map((slug, i) => [String(slug), i]))
  } catch {
    return new Map()
  }
}

async function main() {
  const manifestPath = join(PORTFOLIO, 'projects.json')
  const configPath = join(PORTFOLIO, 'config.json')
  const scannedHero = await getImageFiles(join(PORTFOLIO, 'hero'))

  let config = {
    owner: 'ting-xiong',
    repo: 'ting-xiong.github.io',
    branch: 'master',
    heroImages: scannedHero,
    categories: [
      { id: 'stage', label: 'Stage' },
      { id: 'concept', label: 'Concept' },
      { id: 'construction', label: 'Costume Construction' },
    ],
  }

  try {
    const cfg = JSON.parse(await readFile(configPath, 'utf-8'))
    config = {
      owner: cfg.owner ?? config.owner,
      repo: cfg.repo ?? config.repo,
      branch: cfg.branch ?? config.branch,
      heroImages: scannedHero.length > 0 ? scannedHero : cfg.heroImages ?? [],
      categories: cfg.categories ?? config.categories,
    }
  } catch {
    try {
      const existing = JSON.parse(await readFile(manifestPath, 'utf-8'))
      config.owner = existing.owner ?? config.owner
      config.repo = existing.repo ?? config.repo
      config.branch = existing.branch ?? config.branch
      config.heroImages =
        scannedHero.length > 0 ? scannedHero : existing.heroImages ?? []
      config.categories = existing.categories ?? config.categories
    } catch {}
  }

  const projects = []

  for (const cat of config.categories) {
    const categoryId = cat.id
    const categoryPath = join(PORTFOLIO, categoryId)
    const orderMap = await readCategoryOrder(categoryId)
    let dirs = []
    try {
      dirs = (await readdir(categoryPath, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    } catch {
      continue
    }

    for (const slug of dirs) {
      const metadata = await readMetadata(categoryId, slug)
      const images = await getImageFiles(join(categoryPath, slug))
      const cover =
        metadata.cover && images.includes(metadata.cover)
          ? metadata.cover
          : images[0] ?? ''
      const order = orderMap.has(slug) ? orderMap.get(slug) : 999

      projects.push({
        slug,
        title: metadata.title,
        category: categoryId,
        subtitle: metadata.subtitle,
        cover,
        order,
        images,
      })
    }
  }

  const categoryIndex = new Map(
    config.categories.map((c, i) => [c.id, i]),
  )
  projects.sort((a, b) => {
    const catA = categoryIndex.get(a.category) ?? 999
    const catB = categoryIndex.get(b.category) ?? 999
    if (catA !== catB) return catA - catB
    return (a.order ?? 999) - (b.order ?? 999)
  })

  const manifest = {
    ...config,
    projects,
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(
    `Updated projects.json: ${projects.length} projects from folders + metadata.yml`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
