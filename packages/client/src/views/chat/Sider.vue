<template>
  <div
    class="dark fixed inset-y-0 -left-[260px] w-[260px] transition-transform z-40 bg-gray-900 md:fixed md:left-0 md:flex md:flex-col"
    :class="collapsed ? ' translate-x-full' : ''"
  >
    <div class="flex h-full min-h-0 flex-col">
      <div
        class="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20"
      >
        <nav class="flex h-full flex-1 flex-col space-y-1 p-2">
          <a
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
            @click="handleClickSiderItem(() => handleAddRoom())"
          >
            <svg-icon icon-class="Plus" class="w-4 h-4"></svg-icon>
            创建会话
          </a>
          <div
            id="sider-scroll-container"
            :class="[
              'flex-col flex-1 overflow-y-auto border-b border-white/20',
              hasScrollBar ? ' -mr-2' : ''
            ]"
          >
            <div class="flex flex-col gap-2 text-gray-100 text-sm">
              <sider-item
                v-for="(v, i) in rooms"
                :key="i"
                :is-active="currentIndex === i"
                :room="v"
                @click="handleClickSiderItem(() => (currentIndex = i))"
              />
            </div>
          </div>
          <a
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
            @click="handleClickSiderItem(() => $emit('clear'))"
          >
            <svg-icon icon-class="Delete" class="w-4 h-4"></svg-icon
            >清除所有会话
          </a>
          <a
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
            @click="
              handleClickSiderItem(
                () => (mode = mode === 'Dark' ? 'Light' : 'Dark')
              )
            "
          >
            <svg-icon :icon-class="mode" class="w-4 h-4"></svg-icon>
            {{ mode === 'Dark' ? '切换明亮模式' : '切换深色模式' }}
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SiderItem } from './components'
const rooms = inject('rooms', ref<RoomItem[]>([]))
let currentIndex = inject('currentIndex', ref(-1))
let collapsed = inject('collapsed', ref(false))
let handleAddRoom = inject<{ (): void }>('handleAddRoom')!
let hasScrollBar = ref(false)
defineEmits<{ (e: 'clear'): void }>()
let mode = ref<'Dark' | 'Light'>(
  localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'Dark'
    : 'Light'
)

const handleResize = () => (collapsed.value = false)

const handleClickSiderItem = (fn: Function) => {
  fn()
  collapsed.value = false
}

onMounted(() => window.addEventListener('resize', handleResize))
onUnmounted(() => window.removeEventListener('resize', handleResize))

watch(
  mode,
  (val) => {
    if (val === 'Dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.theme = val.toLocaleLowerCase()
  },
  { immediate: true }
)
watch(rooms, () => {
  nextTick(() => {
    let container = document.getElementById('sider-scroll-container')
    hasScrollBar.value = container!.clientHeight < container!.scrollHeight
  })
})
</script>

<style scoped></style>
