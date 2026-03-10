export interface Category {
  id: string
  label: string
}

export interface ProjectMeta {
  slug: string
  title: string
  category: string
  subtitle: string
  cover: string
  order?: number
  images?: string[]
}

export interface ProjectManifest {
  owner: string
  repo: string
  branch: string
  heroImages?: string[]
  categories: Category[]
  projects: ProjectMeta[]
}
