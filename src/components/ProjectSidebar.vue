<template>
  <aside :class="['project-sidebar', { 'mobile-mode': isMobile }]">
    <div class="sidebar-scroll" ref="scrollRef">
      <template v-for="group in projectsByCategory" :key="group.id">
        <div class="sidebar-divider">{{ group.label }}</div>
        <router-link
          v-for="p in group.projects"
          :key="`${p.category}-${p.slug}`"
          :to="{ name: 'project', params: { category: p.category, slug: p.slug } }"
          :class="['sidebar-item', { active: isActive(p) }]"
        >
          <div class="sidebar-cover">
            <img
              :src="coverUrl(p)"
              :alt="p.title"
              loading="lazy"
              @error="onImageError"
            />
          </div>
          <span class="sidebar-title">{{ p.title }}</span>
        </router-link>
      </template>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getManifest } from '../services/github'
import type { ProjectMeta, Category } from '../types'

const route = useRoute()
const projects = ref<ProjectMeta[]>([])
const categories = ref<Category[]>([])

const projectsByCategory = computed(() => {
  const groups: { id: string; label: string; projects: ProjectMeta[] }[] = []
  const catOrder = categories.value.map((c) => c.id)
  const byCat = new Map<string, ProjectMeta[]>()
  for (const p of projects.value) {
    const list = byCat.get(p.category) ?? []
    list.push(p)
    byCat.set(p.category, list)
  }
  for (const catId of catOrder) {
    const list = byCat.get(catId)
    if (list?.length) {
      const cat = categories.value.find((c) => c.id === catId)
      groups.push({ id: catId, label: cat?.label ?? catId, projects: list })
    }
  }
  return groups
})
const isMobile = ref(false)
const scrollRef = ref<HTMLElement | null>(null)

const MOBILE_BREAKPOINT = 768

let resizeHandler: () => void

onMounted(async () => {
  try {
    const manifest = await getManifest()
    projects.value = manifest.projects
    categories.value = manifest.categories
  } catch (e) {
    console.error('Failed to load projects for sidebar:', e)
  }

  resizeHandler = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT
  }
  resizeHandler()
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})

watch(
  () => [route.params.category, route.params.slug],
  () => {
    nextTick(() => {
      const active = scrollRef.value?.querySelector('.sidebar-item.active')
      if (active) {
        active.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
      }
    })
  },
)

function coverUrl(p: ProjectMeta): string {
  const base = import.meta.env.BASE_URL
  return `${base}portfolio/${p.category}/${p.slug}/${p.cover}`
}

function isActive(p: ProjectMeta): boolean {
  return (
    route.params.category === p.category && route.params.slug === p.slug
  )
}

function onImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.project-sidebar {
  position: sticky;
  top: 70px;
  align-self: flex-start;
  width: 180px;
  flex-shrink: 0;
  max-height: calc(100vh - 70px);
  background: #fafafa;
  border-right: 1px solid #eee;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.project-sidebar::-webkit-scrollbar {
  display: none;
}

.sidebar-divider {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #999;
  padding: 1rem 0.75rem 0.35rem;
  margin-top: 0.5rem;
  border-top: 1px solid #eee;
}

.sidebar-divider:first-child {
  margin-top: 0;
  border-top: none;
  padding-top: 0.5rem;
}

.sidebar-scroll {
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: background 0.2s;
}

.sidebar-item:hover {
  background: rgba(201, 169, 110, 0.15);
}

.sidebar-item.active {
  background: rgba(201, 169, 110, 0.25);
  border-left: 3px solid #c9a96e;
  margin-left: -3px;
  padding-left: calc(0.5rem + 3px);
}

.sidebar-cover {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  background: #eee;
}

.sidebar-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sidebar-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Mobile: horizontal top bar */
.project-sidebar.mobile-mode {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  width: 100%;
  height: auto;
  max-height: 120px;
  border-right: none;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.project-sidebar.mobile-mode::-webkit-scrollbar {
  display: none;
}

.project-sidebar.mobile-mode .sidebar-scroll {
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 0.75rem 1rem;
  gap: 0.75rem;
}

.project-sidebar.mobile-mode .sidebar-divider {
  flex-shrink: 0;
  align-self: stretch;
  width: 28px;
  padding: 0.25rem 0;
  margin: 0 0.25rem 0 0;
  border-left: 1px solid #ddd;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #999;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  display: flex;
  align-items: center;
}

.project-sidebar.mobile-mode .sidebar-divider:first-child {
  border-left: none;
  margin-left: 0;
}

.project-sidebar.mobile-mode .sidebar-item {
  flex-direction: column;
  flex-shrink: 0;
  min-width: 80px;
  max-width: 100px;
  padding: 0.5rem;
}

.project-sidebar.mobile-mode .sidebar-item.active {
  border-left: none;
  border-bottom: 3px solid #c9a96e;
  margin-left: 0;
  margin-bottom: -3px;
  padding-left: 0.5rem;
  padding-bottom: calc(0.5rem + 3px);
}

.project-sidebar.mobile-mode .sidebar-cover {
  width: 56px;
  height: 56px;
}

.project-sidebar.mobile-mode .sidebar-title {
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  display: block;
  max-width: 100%;
}
</style>
