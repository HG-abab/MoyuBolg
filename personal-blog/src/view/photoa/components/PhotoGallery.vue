<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { getPhotoUrl } from '@/api/photo'
  import PhotoPreview from './PhotoPreview.vue'
  import AlbumBanner from './AlbumBanner.vue'

  const props = defineProps({
    currentPath: {
      type: Array,
      required: true
    },
    galleries: {
      type: Object,
      required: true
    },
    isDarkMode: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    hasMore: {
      type: Boolean,
      required: true
    }
  })

  const emit = defineEmits(['update:currentPath', 'loadMore'])

  const showPreview = ref(false)
  const currentPhotoIndex = ref(0)
  const previewPhotos = ref([])

  const handleItemClick = (item) => {
    if (isPhoto(item)) {
      const scrollPosition = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollPosition}px`
      document.body.style.overflow = 'hidden'
      document.body.style.left = '0'
      document.body.style.marginTop = '0'

      const photos = getCurrentGallery()
        .filter(isPhoto)
        .map(item => item.data.url)
      previewPhotos.value = photos
      currentPhotoIndex.value = photos.indexOf(item.data.url)
      showPreview.value = true
    } else if (isAlbum(item)) {
      emit('update:currentPath', [...props.currentPath, item.data.id])
    }
  }

  const itemsVisible = ref([])
  const prevGalleryLength = ref(0)

  const getCurrentGallery = () => {
    const path = props.currentPath.length === 0 ? 'root' : props.currentPath[props.currentPath.length - 1].toString()
    const gallery = props.galleries[path] || []

    // 遍历当前画廊，检查每个相册是否有封面图，若没有则设置封面图为第一张图片的 URL
    gallery.forEach(async item => {
      if (item.type === 'album' && !item.data.coverUrl) {
        await getPhotoUrl(item.data.id).then(res => {
          if (res.code === 0) {
            item.data.coverUrl = res.data
          }
        })
      }
    })
    console.log(gallery)

    return gallery
  }


  const initializeVisibility = (startIndex = 0) => {
    const gallery = getCurrentGallery()
    if (itemsVisible.value.length < gallery.length) {
      itemsVisible.value = [
        ...itemsVisible.value,
        ...new Array(gallery.length - itemsVisible.value.length).fill(false)
      ]
    }
    requestAnimationFrame(() => {
      for (let i = startIndex; i < gallery.length; i++) {
        setTimeout(() => {
          itemsVisible.value[i] = true
        }, (i - startIndex) * 100)
      }
    })
  }

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    if (!props.loading && props.hasMore && documentHeight - scrollPosition <= 100) {
      emit('loadMore')
    }
  }

  onMounted(() => {
    initializeVisibility()
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.top = ''
    document.body.style.overflow = ''
    document.body.style.left = ''
    document.body.style.marginTop = ''
    window.removeEventListener('scroll', handleScroll)
  })

  watch(() => [props.currentPath, props.galleries], (newValue, oldValue) => {
    const gallery = getCurrentGallery()
    const isPathChange = oldValue && oldValue[0] ? (
      props.currentPath.length !== oldValue[0].length ||
      props.currentPath.some((id, index) => id !== oldValue[0][index]) ||
      (props.currentPath.length === 0 && oldValue[0].length > 0)
    ) : false
    if (isPathChange) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      itemsVisible.value = new Array(gallery.length).fill(false)
      initializeVisibility(0)
    } else if (gallery.length > prevGalleryLength.value) {
      initializeVisibility(prevGalleryLength.value)
    }
    prevGalleryLength.value = gallery.length
  }, { deep: true, immediate: true })

  const getAlbumCover = (albumId) => {
    const items = props.galleries['root'] || []
    const album = items.find(
      item => item.type === 'album' && item.data.id === albumId
    )
    if (album && album.type === 'album') {
      return album.data.coverUrl
    }
    return undefined
  }

  const hasPhotos = (item) => {
    if (isAlbum(item)) {
      return item.data.photos.length > 0 || !!item.data.coverUrl
    }
    return false
  }

  const currentAlbum = computed(() => {
    const path = props.currentPath.length === 0 ? 'root' : props.currentPath[props.currentPath.length - 1].toString()
    const gallery = props.galleries[path] || []
    let albumInfo
    if (path === 'root') {
      const firstPhoto = gallery.find(item => isPhoto(item))
      return {
        title: '我的相册',
        description: '相册功能正在测试阶段，图片来源于网络，如有侵权请联系我！！！',
        photosCount: gallery.filter(item => isPhoto(item)).length,
        albumsCount: gallery.filter(item => isAlbum(item)).length,
        coverImage: firstPhoto ? firstPhoto.data.url : undefined
      }
    } else {
      const parentPath = props.currentPath.length > 1
        ? props.currentPath[props.currentPath.length - 2].toString()
        : 'root'
      const parentGallery = props.galleries[parentPath] || []
      albumInfo = parentGallery.find(
        item => isAlbum(item) && item.data.id === Number(path)
      )
      const firstPhoto = gallery.find(item => isPhoto(item))
      return {
        title: albumInfo?.data.name || '未命名相册',
        description: albumInfo?.data.description || '',
        photosCount: gallery.filter(item => isPhoto(item)).length,
        albumsCount: gallery.filter(item => isAlbum(item)).length,
        coverImage: firstPhoto ? firstPhoto.data.url : undefined
      }
    }
  })


  const handleAlbumClick = (albumId) => {
    emit('update:currentPath', [...props.currentPath, albumId])
  }

  const breadcrumbs = computed(() => {
    return props.currentPath.map((id, index) => {
      const parentPath = index === 0 ? 'root' : props.currentPath[index - 1].toString()
      const parentGallery = props.galleries[parentPath] || []
      const albumInfo = parentGallery.find(
        item => isAlbum(item) && item.data.id === id
      )
      return {
        id,
        name: albumInfo ? albumInfo.data.name : '未命名相册'
      }
    })
  })

  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      emit('update:currentPath', [])
    } else {
      emit('update:currentPath', props.currentPath.slice(0, index + 1))
    }
  }


  const isPhoto = (item) => {
    return item.type === 'photo'
  }

  const isAlbum = (item) => {
    return item.type === 'album'
  }
</script>

<template>
  <div class="photo-gallery" :class="{ 'dark-mode': isDarkMode }">
    <AlbumBanner :title="currentAlbum.title" :description="currentAlbum.description" :photos-count="currentAlbum.photosCount" :albums-count="currentAlbum.albumsCount" :cover-image="currentAlbum.coverImage" :breadcrumbs="breadcrumbs" :is-dark-mode="isDarkMode" @breadcrumb-click="handleBreadcrumbClick" />

    <div class="gallery-wrapper">
      <div v-if="props.loading && getCurrentGallery().length === 0" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <template v-else>
        <div v-if="getCurrentGallery().length > 0" class="gallery-grid">
          <div v-for="(item, index) in getCurrentGallery()" :key="item.type + (isPhoto(item) ? item.data.id : item.data.id)" class="gallery-item" :class="{ visible: itemsVisible[index] }" @click="handleItemClick(item)">
            <template v-if="isAlbum(item)">
              <div v-if="!hasPhotos(item) && !item.data.coverUrl" class="default-album-cover">
                <div class="default-album-inner">
                  <div class="album-icon"></div>
                </div>
              </div>
              <img v-else :src="item.data.coverUrl || '/images/default-album-cover.jpg'" :alt="item.data.name" loading="lazy">
            </template>
            <img v-else-if="isPhoto(item)" :src="item.data.url" :alt="item.data.title" loading="lazy">
            <div class="item-info" v-if="isAlbum(item)">
              <h3>{{ item.data.name }}</h3>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>这个相册还没有内容哦~</p>
        </div>

        <div v-if="props.hasMore && getCurrentGallery().length > 0" class="loading-more">
          <div v-if="props.loading" class="loading-spinner"></div>
          <p v-else>向下滚动加载更多</p>
        </div>
      </template>
    </div>

    <PhotoPreview v-model:show="showPreview" v-model:currentIndex="currentPhotoIndex" :photos="previewPhotos" />
  </div>
</template>


<style scoped>
.photo-gallery {
  width: 100%;
  min-height: 100%;
  background: transparent;
  overflow: visible;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

.gallery-wrapper {
  padding: 30px;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 32px;
  backdrop-filter: blur(10px);
  margin-top: 0;
  flex: 1;
  min-height: 400px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px 0 30px 0;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 200px); /* 保持最小高度，防止内容加载时页面跳动 */
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  will-change: opacity, transform;
}

.gallery-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(92, 106, 196, 0.15);
}

.gallery-item:hover img {
  transform: scale(1.05);
}

/* 相册信息样式 */
.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.item-info::before {
  content: '📁';
  font-size: 1.4em;
  line-height: 1;
}

.item-info h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
}

@media (max-width: 1200px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .photo-gallery {
    padding: 0 10px;
  }

  .gallery-wrapper {
    padding: 20px;
    margin-top: 0;
    border-radius: 24px;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    min-height: calc(100vh - 150px);
  }

  .loading-more {
    padding: 20px 0;
    height: 80px;
    margin-top: -80px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

/* 默认相册封面样式 */
.default-album-cover {
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, #e0e7ff 0%, #f5f7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.default-album-cover::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
  );
  animation: shine 3s infinite linear;
  pointer-events: none;
}

.album-icon {
  width: 50px;
  height: 50px;
  position: relative;
  margin: 20px;
}

.album-icon::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: #5c6ac4;
  border-radius: 12px;
  transform: rotate(-10deg);
  box-shadow: 0 3px 10px rgba(92, 106, 196, 0.2);
}

.album-icon::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 5px;
  width: 100%;
  height: 100%;
  background: #7b8cd4;
  border-radius: 12px;
  transform: rotate(5deg);
  box-shadow: 0 3px 10px rgba(92, 106, 196, 0.2);
}

/* 悬浮效果 */
.gallery-item:hover .default-album-cover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(92, 106, 196, 0.2);
}

.gallery-item:hover .album-icon::before {
  transform: rotate(-15deg);
}

.gallery-item:hover .album-icon::after {
  transform: rotate(10deg);
}

/* 点击效果 */
.gallery-item:active .default-album-cover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(92, 106, 196, 0.15);
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

/* 修改深色模式样式，使用类选择器而不是媒体查询 */
.dark-mode .gallery-wrapper {
  background: rgba(30, 30, 30, 0.98);
  box-shadow: none;
}

.dark-mode .gallery-item {
  background: rgba(40, 40, 40, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.dark-mode .gallery-item:hover {
  box-shadow: 0 8px 20px rgba(92, 106, 196, 0.2);
}

.dark-mode .empty-state {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.03);
}

.dark-mode .default-album-cover {
  background: linear-gradient(120deg, #2a2f4c 0%, #1a1f35 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.dark-mode .album-icon::before {
  background: #3d4674;
}

.dark-mode .album-icon::after {
  background: #4d5894;
}

.dark-mode .gallery-item:hover .default-album-cover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.dark-mode .item-info {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
}

.dark-mode .gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* 加载更多样式优化 */
.loading-more {
  text-align: center;
  padding: 40px 0;
  color: #666;
  position: relative;
  height: 100px; /* 固定高度，防止加载时页面跳动 */
  margin-top: -100px; /* 上移，覆盖在内容上方 */
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none; /* 防止遮挡点击 */
}

.loading-spinner {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(92, 106, 196, 0.1);
  border-radius: 50%;
  border-top-color: #5c6ac4;
  animation: spin 1s ease-in-out infinite;
}

/* 深色模式适配 */
.dark-mode .loading-more {
  color: #999;
  background: linear-gradient(to top, rgba(30, 30, 30, 0.98) 0%, rgba(30, 30, 30, 0.8) 50%, rgba(30, 30, 30, 0) 100%);
}

.dark-mode .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: #7b8cd4;
}

/* 添加空状态样式 */
.empty-state {
  padding: 40px;
  color: #999;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 16px;
  margin: 20px 0;
}

/* 添加加载状态样式 */
.loading-state {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 300px;
}

.loading-state p {
  color: #666;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 