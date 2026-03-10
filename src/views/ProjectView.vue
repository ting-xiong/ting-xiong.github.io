<template>
  <div class="project-layout">
    <ProjectSidebar />
    <main class="project-page">
      <div class="project-header">
      <a href="#" class="back-link" @click.prevent="goBack">&larr; Back to Portfolio</a>
      <h1 class="project-title">{{ projectMeta?.title }}</h1>
      <p v-if="projectMeta?.subtitle" class="project-subtitle">
        {{ projectMeta.subtitle }}
      </p>
      <div class="title-divider"></div>
    </div>
      <ImageGallery :images="imageUrls" @retry="loadImages" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getManifest, listProjectImages } from '../services/github'
import type { ProjectMeta } from '../types'
import ImageGallery from '../components/ImageGallery.vue'
import ProjectSidebar from '../components/ProjectSidebar.vue'

const route = useRoute()
const router = useRouter()
const projectMeta = ref<ProjectMeta | null>(null)
const imageUrls = ref<string[]>([])

onMounted(() => loadImages())
watch(() => route.params, () => loadImages())

async function loadImages() {
  const category = route.params.category as string
  const slug = route.params.slug as string

  try {
    const manifest = await getManifest()
    projectMeta.value =
      manifest.projects.find(
        (p) => p.category === category && p.slug === slug,
      ) || null

    const filenames = await listProjectImages(category, slug)
    imageUrls.value = filenames.map(
      (f) => import.meta.env.BASE_URL + `portfolio/${category}/${slug}/${f}`,
    )
  } catch (e) {
    console.error('Failed to load project images:', e)
  }
}

async function goBack() {
  const category = route.params.category as string
  await router.push('/')
  await nextTick()

  const scrollToSection = (attempts = 0) => {
    const el = document.getElementById(category)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (attempts < 40) {
      setTimeout(() => scrollToSection(attempts + 1), 50)
    }
  }
  scrollToSection()
}
</script>

<style scoped>
.project-layout {
  display: flex;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
}

.project-page {
  flex: 1;
  padding-top: 70px;
  min-height: 100vh;
  min-width: 0;
}

@media (max-width: 768px) {
  .project-page {
    padding-top: 195px; /* navbar 70px + sidebar ~120px */
  }
}

.project-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  color: #888;
  text-decoration: none;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.3s;
  display: inline-block;
  margin-bottom: 2rem;
}

.back-link:hover {
  color: #c9a96e;
}

.project-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: #333;
  margin: 0;
}

.project-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  color: #888;
  margin: 0.8rem 0 0;
  letter-spacing: 0.05em;
}

.title-divider {
  width: 60px;
  height: 2px;
  background: #c9a96e;
  margin: 2rem auto;
}
</style>
