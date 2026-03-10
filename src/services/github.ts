import type { ProjectManifest } from '../types'

let manifestCache: ProjectManifest | null = null

export async function getManifest(): Promise<ProjectManifest> {
  if (manifestCache) return manifestCache
  const res = await fetch(import.meta.env.BASE_URL + 'portfolio/projects.json')
  if (!res.ok) throw new Error('Failed to load project manifest')
  manifestCache = await res.json()
  return manifestCache!
}

export async function listProjectImages(
  category: string,
  slug: string,
): Promise<string[]> {
  const manifest = await getManifest()
  const project = manifest.projects.find(
    (p) => p.category === category && p.slug === slug,
  )
  if (project?.images && project.images.length > 0) {
    return project.images
  }
  return []
}

export async function listHeroImages(): Promise<string[]> {
  const manifest = await getManifest()
  if (manifest.heroImages && manifest.heroImages.length > 0) {
    return manifest.heroImages
  }
  return []
}
