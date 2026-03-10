/**
 * One-time script: Create metadata.yml in each project folder from existing projects.json.
 * Run once to bootstrap the folder-based structure.
 */
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'yaml'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

async function main() {
  const manifestPath = join(ROOT, 'public', 'portfolio', 'projects.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'))

  for (const project of manifest.projects) {
    const metadata = {
      title: project.title,
      category: project.category,
      subtitle: project.subtitle || '',
      cover: project.cover,
    }
    const ymlContent = yaml.stringify(metadata)
    const metadataPath = join(
      ROOT,
      'public',
      'portfolio',
      project.category,
      project.slug,
      'metadata.yml',
    )
    await writeFile(metadataPath, ymlContent)
    console.log(`Created ${project.category}/${project.slug}/metadata.yml`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
