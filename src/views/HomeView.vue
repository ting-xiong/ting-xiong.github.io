<template>
  <main>
    <HeroSlideshow />
    <ProjectGrid
      v-for="cat in categories"
      :key="cat.id"
      :category="cat"
      :projects="projectsByCategory(cat.id)"
    />
    <FooterSection />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getManifest } from '../services/github'
import type { Category, ProjectMeta } from '../types'
import HeroSlideshow from '../components/HeroSlideshow.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import FooterSection from '../components/FooterSection.vue'

const categories = ref<Category[]>([])
const projects = ref<ProjectMeta[]>([])

onMounted(async () => {
  try {
    const manifest = await getManifest()
    categories.value = manifest.categories
    projects.value = manifest.projects
  } catch (e) {
    console.error('Failed to load manifest:', e)
  }
})

function projectsByCategory(categoryId: string): ProjectMeta[] {
  return projects.value
    .filter((p) => p.category === categoryId)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}
</script>
