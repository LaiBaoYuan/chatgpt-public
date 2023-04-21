<template>
  <div
    class="sticky top-0 z-10 flex items-center border-b border-white/20 bg-gray-800 pl-1 pt-1 text-gray-200 sm:pl-3 md:hidden"
  >
    <button
      class="-ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:hover:text-white"
      @click="store.commit('app/SET_COLLAPSED', true)"
    >
      <span class="sr-only">Open sidebar</span>
      <svg-icon icon-class="Menu" class="w-6 h-6"></svg-icon>
    </button>
    <h1
      class="flex-1 text-center text-base font-normal whitespace-nowrap text-ellipsis overflow-hidden"
    >
      {{ title }}
    </h1>
    <button type="button" class="px-3" @click="store.dispatch('chat/addRoom')">
      <svg-icon icon-class="Plus" class="w-6 h-6"></svg-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
// const rooms = inject('rooms', reactive<RoomItem[]>([]))
// let currentIndex = inject('currentIndex', ref(-1))
// let collapsed = inject('collapsed', ref(false))
// let handleAddRoom = inject<{ (): void }>('handleAddRoom')!
// let title = computed(
//   () =>
//     (rooms[currentIndex.value]?.conversations.length &&
//       rooms[currentIndex.value].conversations[0].send_content) ||
//     '新会话'
// )
// watch(
//   title,
//   (val) => {
//     document.title = val
//   },
//   { immediate: true }
// )
import { useAppStore } from '@/store'
const store = useAppStore()
const { rooms, curIndex } = toRefs(store.state.chat)
let title = computed(
  () => (curIndex.value !== -1 && rooms.value[curIndex.value].title) || '新会话'
)
watch(
  title,
  (val) => {
    document.title = val
  },
  { immediate: true }
)
</script>
