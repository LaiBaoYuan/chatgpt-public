<template>
  <div class="overflow-hidden w-full h-full relative">
    <Content ref="content" :load="contentLoading"></Content>
    <Sider></Sider>
  </div>
</template>

<script setup lang="ts">
import Sider from './Sider.vue'
import Content from './Content.vue'
import { useAppStore } from '@/store'
const store = useAppStore()
const { curIndex } = toRefs(store.state.chat)
const content = ref<{ listenScroll: Function }>()
const contentLoading = ref(false)
await store.dispatch('chat/getRooms')
watch(curIndex, async () => {
  contentLoading.value = true
  await store.dispatch('chat/getMessage')
  contentLoading.value = false
  if (content.value) {
    content.value.listenScroll()
  }
})
onMounted(() => {
  if (content.value) {
    content.value.listenScroll()
  }
})

// let rooms = reactive<RoomItem[]>([])
// let currentIndex = ref(-1)
// let collapsed = ref(false)
// provide('currentIndex', currentIndex)
// provide('collapsed', collapsed)
// provide('rooms', rooms)

// const getConversation = () =>
//   conversation().then((res) => rooms.splice(0, rooms.length, ...res))

// const handleAddRoom = () => {
//   return addRoom().then((res) => {
//     rooms.splice(0, rooms.length, ...res)
//     currentIndex.value = 0
//   })
// }
// const handleClear = () => {
//   return clearConversatiuons().then((res) => {
//     rooms.splice(0, rooms.length, ...res)
//     currentIndex.value = -1
//   })
// }

// const deleteConversatiuon = (id: string) => {
//   return deleteConversatiuonById(id).then((res) => {
//     rooms.splice(0, rooms.length, ...res)
//     currentIndex.value -= 1
//   })
// }
// provide('deleteConversatiuon', deleteConversatiuon)
// provide('handleAddRoom', handleAddRoom)

// getConversation()
</script>

<style scoped></style>
