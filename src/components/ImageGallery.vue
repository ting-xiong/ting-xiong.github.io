<template>
  <div class="gallery-container">
    <div v-if="loading" class="gallery-loading">
      <div class="spinner"></div>
      <p>Loading images...</p>
    </div>
    <div v-else-if="error" class="gallery-error">
      <p>{{ error }}</p>
      <button @click="retry">Retry</button>
    </div>
    <div v-else class="masonry" ref="masonryRef">
      <div
        v-for="(img, i) in imageUrls"
        :key="img"
        class="masonry-item"
        @click="openLightbox(i)"
      >
        <img :src="img" :alt="`Image ${i + 1}`" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = defineProps<{
  images: string[]
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const loading = ref(true)
const error = ref('')
const imageUrls = ref<string[]>([])
const masonryRef = ref<HTMLElement | null>(null)
let lightbox: PhotoSwipeLightbox | null = null

watch(
  () => props.images,
  (newImages) => {
    if (newImages.length > 0) {
      loadImages()
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
})

async function loadImages() {
  loading.value = true
  error.value = ''
  try {
    imageUrls.value = props.images
    loading.value = false
    await nextTick()
    initPhotoSwipe()
  } catch (e: any) {
    error.value = e.message || 'Failed to load images'
    loading.value = false
  }
}

function initPhotoSwipe() {
  if (lightbox) {
    lightbox.destroy()
  }

  lightbox = new PhotoSwipeLightbox({
    gallery: masonryRef.value!,
    children: '.masonry-item',
    pswpModule: () => import('photoswipe'),
    bgOpacity: 0.9,
    padding: { top: 40, bottom: 40, left: 20, right: 20 },
  })

  lightbox.addFilter('domItemData', (itemData, element) => {
    const img = element.querySelector('img')
    if (img) {
      itemData.src = img.src
      itemData.w = img.naturalWidth || 1600
      itemData.h = img.naturalHeight || 1200
      itemData.msrc = img.src
    }
    return itemData
  })

  lightbox.on('contentLoad', (e) => {
    const { content } = e
    if (content.data.w === 1600 && content.data.src) {
      const img = new Image()
      img.onload = () => {
        content.data.w = img.naturalWidth
        content.data.h = img.naturalHeight
        content.width = img.naturalWidth
        content.height = img.naturalHeight
        lightbox?.pswp?.updateSize(true)
      }
      img.src = content.data.src as string
    }
  })

  lightbox.init()
}

function openLightbox(index: number) {
  if (lightbox) {
    lightbox.loadAndOpen(index, { gallery: masonryRef.value! })
  }
}

function retry() {
  emit('retry')
}
</script>

<style scoped>
.gallery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.masonry {
  column-count: 3;
  column-gap: 12px;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.masonry-item:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.masonry-item img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 0;
  color: #888;
  font-family: 'Montserrat', sans-serif;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #eee;
  border-top-color: #c9a96e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.gallery-error {
  text-align: center;
  padding: 4rem 0;
  font-family: 'Montserrat', sans-serif;
  color: #888;
}

.gallery-error button {
  margin-top: 1rem;
  padding: 0.6rem 2rem;
  border: 1px solid #c9a96e;
  background: transparent;
  color: #c9a96e;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.gallery-error button:hover {
  background: #c9a96e;
  color: #fff;
}

@media (max-width: 900px) {
  .masonry {
    column-count: 2;
  }
}

@media (max-width: 500px) {
  .masonry {
    column-count: 1;
  }
}
</style>
