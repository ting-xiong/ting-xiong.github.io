<template>
  <router-link
    :to="{ name: 'project', params: { category: project.category, slug: project.slug } }"
    class="project-card"
  >
    <div class="card-image-wrapper">
      <img
        :src="coverUrl"
        :alt="project.title"
        loading="lazy"
        @error="onImageError"
      />
    </div>
    <div class="card-info">
      <h3>{{ project.title }}</h3>
      <p v-if="project.subtitle">{{ project.subtitle }}</p>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectMeta } from '../types'

const props = defineProps<{ project: ProjectMeta }>()

const coverUrl = computed(() => {
  const base = import.meta.env.BASE_URL
  return `${base}portfolio/${props.project.category}/${props.project.slug}/${props.project.cover}`
})

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.project-card {
  display: block;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  border-radius: 4px;
  background: #f5f5f5;
  transition: transform 0.3s, box-shadow 0.3s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-image-wrapper {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
}

.card-image-wrapper img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.project-card:hover .card-image-wrapper img {
  transform: scale(1.05);
}

.card-info {
  padding: 1.2rem 1rem;
  text-align: center;
}

.card-info h3 {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.05em;
  color: #333;
}

.card-info p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #888;
  margin: 0.4rem 0 0;
  letter-spacing: 0.05em;
}
</style>
