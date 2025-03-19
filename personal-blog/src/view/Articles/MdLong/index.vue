<template>
  <div class="mdcatalog">
    <MdCatalog :editorId="id" :scrollElement="scrollElement" />
  </div>
</template>

<script setup>
  import { MdCatalog } from 'md-editor-v3';

  const scrollElement = document.documentElement;
  const id = 'preview-only';

</script>

<style lang="scss" scoped>
.mdcatalog{
  top: 20px;
  position: sticky;
  transition: top .3s;
}
</style>