<script setup>
  import PhotoGallery from './components/PhotoGallery.vue';
  import { ref, computed, onMounted, watch } from 'vue';
  import { useDark } from '@vueuse/core';
  import { getPhotoList } from '@/api/photo';

  // 当前路径状态提升到 App 组件
  const currentPath = ref([]);

  // 加载状态
  const loading = ref(false);

  // 分页相关状态
  const currentPage = ref(1);
  const pageSize = 16;
  const hasMore = ref(true);
  const total = ref(0);

  // 数据结构定义
  const Photo = {
    id: Number,
    url: String,
    title: String,
    description: String
  };

  const AlbumData = {
    id: Number,
    name: String,
    description: String,
    photos: Array,
    subAlbums: Array,
    coverUrl: String || null
  };

  // 相册数据
  const galleries = ref({
    root: []
  });

  // 转换后端数据为前端需要的格式
  const convertBackendData = (data) => {
    return data.map(item => {
      if (item.type === 1) {
        // 相册
        return {
          type: 'album',
          data: {
            id: item.id,
            name: item.name,
            description: item.description || '',
            photos: [],
            coverUrl: item.url
          }
        };
      } else {
        // 照片
        return {
          type: 'photo',
          data: {
            id: item.id,
            url: item.url || '',
            title: item.name,
            description: item.description || ''
          }
        };
      }
    });
  };

  // 加载相册和照片数据
  const loadGalleryData = async (parentId, page = 1, append = false) => {
    try {
      loading.value = true;
      const response = await getPhotoList({
        pageNum: page,
        pageSize: pageSize,
        parentId: parentId || null
      });

      const galleryKey = parentId ? parentId.toString() : 'root';
      const newItems = convertBackendData(response.data.items);

      if (append) {
        galleries.value[galleryKey] = [...(galleries.value[galleryKey] || []), ...newItems];
      } else {
        galleries.value[galleryKey] = newItems;
      }

      total.value = response.data.total;
      hasMore.value = page * pageSize < response.data.total;
      currentPage.value = page;
    } catch (error) {
      console.error('加载相册数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 加载更多数据
  const loadMore = async () => {
    if (loading.value || !hasMore.value) return;
    const currentId = currentPath.value.length > 0 ? currentPath.value[currentPath.value.length - 1] : undefined;
    await loadGalleryData(currentId, currentPage.value + 1, true);
  };

  // 获取相册封面的函数
  const getAlbumCover = (albumId) => {
    const album = galleries.value.root.find(
      item => item.type === 'album' && item.data.id === albumId
    );

    if (album && album.type === 'album') {
      const albumData = album.data;
      if (albumData.coverUrl) {
        return albumData.coverUrl;
      }
    }

    // 返回默认封面
    return null;
  };

  // 监听路径变化，加载对应的数据
  watch(() => currentPath.value, async (newPath) => {
    const currentId = newPath.length > 0 ? newPath[newPath.length - 1] : undefined;
    currentPage.value = 1;
    hasMore.value = true;
    await loadGalleryData(currentId, 1, false);
  }, { immediate: true });

  const getCurrentGallery = () => {
    const path = currentPath.value.length === 0 ? 'root' : currentPath.value[currentPath.value.length - 1].toString();
    return galleries.value[path] || [];
  };

  const getBreadcrumbPath = computed(() => {
    if (currentPath.value.length === 0) return '当前位置：/';

    // 获取完整的路径名称
    const names = currentPath.value.map(id => getBreadcrumbName(id));
    return `当前位置：/${names.join('/')}`;
  });

  const navigateToAlbum = (id) => {
    // 如果已经在这个相册中，不做任何操作
    if (currentPath.value[currentPath.value.length - 1] === id) {
      return;
    }

    // 查找完整的路径
    const newPath = findAlbumPath(id);
    if (newPath) {
      currentPath.value = newPath;
    } else {
      currentPath.value = [id];
    }
  };

  // 优化 findAlbumPath 方法
  const findAlbumPath = (targetId, currentPath = []) => {
    // 检查根级相册
    for (const item of galleries.value['root']) {
      if (item.type === 'album') {
        const album = item.data;
        if (album.id === targetId) {
          return [targetId];
        }
        // 检查这个相册的子相册
        const childPath = findInAlbum(album.id, targetId);
        if (childPath) {
          return childPath;
        }
      }
    }
    return null;
  };

  // 添加辅助函数来在相册中查找路径
  const findInAlbum = (albumId, targetId) => {
    const items = galleries.value[albumId.toString()];
    if (!items) return null;

    // 直接子相册中查找
    for (const item of items) {
      if (item.type === 'album') {
        const album = item.data;
        if (album.id === targetId) {
          return [albumId, targetId];
        }
        // 递归查找更深层的子相册
        const childPath = findInAlbum(album.id, targetId);
        if (childPath) {
          return [albumId, ...childPath];
        }
      }
    }
    return null;
  };

  // 在 script 部分的开头，其他 import 语句后面添加
  const isMobileMenuOpen = ref(false);

  // 修改移动端菜单打开/关闭的方法
  const toggleMobileMenu = (isOpen) => {
    isMobileMenuOpen.value = isOpen;
    // 控制 body 的滚动
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // 修改关闭菜单方法
  const closeMobileMenu = () => {
    toggleMobileMenu(false);
  };

  // 添加面包屑导航点击处理方法
  const handleBreadcrumbClick = (index) => {
    if (index === -1) {
      currentPath.value = [];
    } else {
      currentPath.value = currentPath.value.slice(0, index + 1);
    }
    // 关闭动端菜单
    closeMobileMenu();
  };

  // 添加 getBreadcrumbName 函数
  const getBreadcrumbName = (id) => {
    // 在所有相册数据中查找对应的相册
    for (const [key, items] of Object.entries(galleries.value)) {
      const album = items.find(item =>
        item.type === 'album' && item.data.id === id
      );
      if (album) {
        return album.data.name;
      }
    }
    return '';
  };

  // 添加简化版的 albumTree computed 属性
  const albumTree = computed(() => {
    const tree = [];

    const buildTree = (parentId = null, level = 0) => {
      const result = [];
      for (const [key, items] of Object.entries(galleries.value)) {
        const albums = items.filter(item => item.type === 'album')
          .map(item => {
            const album = item.data;
            return {
              id: album.id,
              name: album.name
            };
          });

        for (const album of albums) {
          if (parentId === null && key === 'root') {
            result.push({
              id: album.id,
              name: album.name,
              children: buildTree(album.id.toString(), level + 1),
              level
            });
          } else if (parentId === key) {
            result.push({
              id: album.id,
              name: album.name,
              children: buildTree(album.id.toString(), level + 1),
              level
            });
          }
        }
      }
      return result;
    };

    return buildTree();
  });

  // 使用 VueUse 的 useDark
  const isDark = useDark();
</script>

<template>
  <div class="app-container" :class="{ 'dark-mode': isDark }">
    <header class="header">
      <div class="header-content">
        <button class="menu-toggle" @click="toggleMobileMenu(!isMobileMenuOpen)">
          <span class="menu-icon"></span>
        </button>
      </div>
    </header>
    <main class="main-content">
      <aside class="album-menu" :class="{ 'mobile-open': isMobileMenuOpen }">
        <div class="menu-header">
          <h2>相册列表</h2>
          <button class="close-menu" @click="closeMobileMenu">×</button>
        </div>
        <ul class="album-tree">
          <li class="home-item" :class="{ active: currentPath.length === 0 }" @click="currentPath = []; closeMobileMenu()">
            主页
          </li>
          <li v-for="album in albumTree" :key="album.id" class="album-tree-item" :class="{
                active: currentPath[currentPath.length - 1] === album.id,
                'has-children': album.children.length > 0,
                'expanded': currentPath.includes(album.id)
              }" :style="{ paddingLeft: `${album.level * 16}px` }" @click="navigateToAlbum(album.id); closeMobileMenu()">
            <span class="album-name">
              {{ album.name }}
            </span>
            <ul v-if="album.children.length > 0" class="sub-albums">
              <li v-for="child in album.children" :key="child.id" class="album-tree-item" :class="{
                    active: currentPath[currentPath.length - 1] === child.id,
                    'has-children': child.children.length > 0,
                    'expanded': currentPath.includes(child.id)
                  }" :style="{ paddingLeft: `${child.level * 16}px` }" @click.stop="navigateToAlbum(child.id); closeMobileMenu()">
                <span class="album-name">
                  {{ child.name }}
                </span>
                <ul v-if="child.children.length > 0" class="sub-albums">
                  <li v-for="grandChild in child.children" :key="grandChild.id" class="album-tree-item" :class="{
                        active: currentPath[currentPath.length - 1] === grandChild.id
                      }" :style="{ paddingLeft: `${grandChild.level * 16}px` }" @click.stop="navigateToAlbum(grandChild.id); closeMobileMenu()">
                    <span class="album-name">
                      {{ grandChild.name }}
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
      <div class="overlay" v-if="isMobileMenuOpen" @click="closeMobileMenu"></div>
      <div class="gallery-container">
        <PhotoGallery v-model:currentPath="currentPath" :galleries="galleries" :is-dark-mode="isDark" :loading="loading" :has-more="hasMore" @load-more="loadMore" />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss';
</style>