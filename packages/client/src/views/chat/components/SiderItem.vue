<template>
  <a
    :class="[
      'flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all group',
      isActive
        ? 'pr-14 bg-gray-800 hover:bg-gray-800'
        : 'hover:pr-4 hover:bg-[#2A2B32]'
    ]"
  >
    <svg-icon icon-class="Msg" class="w-4 h-4"></svg-icon>
    <div
      class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
    >
      {{ room.title }}
      <div
        :class="[
          'absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l',
          isActive
            ? 'from-gray-800'
            : 'from-gray-900 group-hover:from-[#2A2B32]'
        ]"
      ></div>
    </div>
    <div
      :class="[
        'absolute flex right-1 z-10 text-gray-300',
        isActive ? ' visible' : 'invisible'
      ]"
    >
      <button class="p-1 hover:text-white" @click="$emit('delete')">
        <svg-icon icon-class="Delete" class="w-4 h-4"></svg-icon>
      </button>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  room: RoomItem
  isActive: boolean
}>()
defineEmits<{
  (e: 'delete'): void
}>()
</script>

<style scoped></style>
