<template>
  <section :id="category.id" class="project-section">
    <div class="section-inner">
      <h2 class="section-title">{{ category.label }}</h2>
      <div class="section-divider"></div>
      <div class="projects-grid">
        <ProjectCard
          v-for="project in projects"
          :key="project.slug"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category, ProjectMeta } from '../types'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  category: Category
  projects: ProjectMeta[]
}>()
</script>

<style scoped>
.project-section {
  padding: 5rem 2rem;
}

.project-section:nth-child(even) {
  background: #fafafa;
}

.section-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  text-align: center;
  letter-spacing: 0.15em;
  color: #333;
  margin: 0 0 1rem;
}

.section-divider {
  width: 60px;
  height: 2px;
  background: #c9a96e;
  margin: 0 auto 3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 640px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .project-section {
    padding: 3rem 1rem;
  }
}
</style>
