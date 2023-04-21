<template>
  <suspense>
    <router-view />
  </suspense>
</template>

<script lang="ts" setup>
import { initCopyCode } from '@/utils/copy'
initCopyCode()
</script>
