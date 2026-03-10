<template>
  <header :class="['navbar', { scrolled: isScrolled, open: menuOpen }]">
    <nav>
      <router-link to="/" class="logo" @click="menuOpen = false">
        <img src="/assets/sign-2.png" alt="Ting Xiong" />
      </router-link>
      <button
        class="hamburger"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul :class="['nav-links', { open: menuOpen }]">
        <li v-for="cat in categories" :key="cat.id">
          <a @click="scrollToSection(cat.id)">{{ cat.label }}</a>
        </li>
        <li>
          <a @click="scrollToSection('about')">About</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getManifest } from '../services/github'
import type { Category } from '../types'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)
const categories = ref<Category[]>([])

onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  try {
    const manifest = await getManifest()
    categories.value = manifest.categories
  } catch {
    categories.value = [
      { id: 'concept', label: 'Concept' },
      { id: 'stage', label: 'Stage' },
      { id: 'construction', label: 'Costume Construction' },
    ]
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  isScrolled.value = window.scrollY > 60
}

async function scrollToSection(sectionId: string) {
  menuOpen.value = false
  if (route.name !== 'home') {
    await router.push({ name: 'home' })
    await new Promise((r) => setTimeout(r, 100))
  }
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 2rem;
  transition: background-color 0.3s, box-shadow 0.3s;
  background: transparent;
}

.navbar.scrolled,
.navbar.open {
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo img {
  height: 40px;
  transition: opacity 0.3s;
}

.logo img:hover {
  opacity: 0.7;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0.5rem 0;
  position: relative;
}

.navbar.scrolled .nav-links a,
.navbar.open .nav-links a {
  color: #333;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #c9a96e;
  transition: width 0.3s;
}

.nav-links a:hover::after {
  width: 100%;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  transition: all 0.3s;
}

.navbar.scrolled .hamburger span,
.navbar.open .hamburger span {
  background: #333;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 1rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s, opacity 0.3s;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-links a {
    color: #333 !important;
    padding: 1rem 2rem;
    display: block;
    width: 100%;
    text-align: center;
  }
}
</style>
