<template>
  <section class="hero">
    <div class="hero-slides">
      <div
        v-for="(img, i) in images"
        :key="img"
        class="hero-slide"
        :class="{ active: i === currentIndex }"
        :style="{ backgroundImage: `url(${img})` }"
      ></div>
    </div>
    <div class="hero-overlay">
      <h1 class="hero-title">Ting Xiong</h1>
      <p class="hero-subtitle">Costume Designer</p>
      <a class="hero-cta" @click="scrollDown">Explore Portfolio</a>
    </div>
    <div class="hero-scroll-indicator" @click="scrollDown">
      <span></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { listHeroImages } from '../services/github'

const images = ref<string[]>([])
const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  try {
    const filenames = await listHeroImages()
    images.value = filenames.map(
      (f) => import.meta.env.BASE_URL + 'portfolio/hero/' + encodeURIComponent(f),
    )
  } catch {
    images.value = []
  }

  if (images.value.length > 1) {
    interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % images.value.length
    }, 5000)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

function scrollDown() {
  const firstSection = document.getElementById('stage')
  if (firstSection) {
    firstSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 500px;
  overflow: hidden;
}

.hero-slides {
  position: absolute;
  inset: 0;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: #fff;
  margin: 0;
  letter-spacing: 0.15em;
  font-weight: 400;
}

.hero-subtitle {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.85);
  margin: 1rem 0 2.5rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 300;
}

.hero-cta {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0.9rem 2.5rem;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.hero-cta:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #fff;
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.hero-scroll-indicator span {
  display: block;
  width: 24px;
  height: 24px;
  border-right: 2px solid rgba(255, 255, 255, 0.7);
  border-bottom: 2px solid rgba(255, 255, 255, 0.7);
  transform: rotate(45deg);
  animation: scrollBounce 2s infinite;
}

@keyframes scrollBounce {
  0%, 100% { transform: rotate(45deg) translate(0, 0); opacity: 1; }
  50% { transform: rotate(45deg) translate(8px, 8px); opacity: 0.5; }
}
</style>
