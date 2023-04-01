<template>
  <svg aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{ iconClass: string }>()
const iconName = computed(() => `#icon-${props.iconClass}`)
</script>
