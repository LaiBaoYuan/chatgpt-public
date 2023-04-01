<template>
  <div class="overflow-hidden w-full h-full relative">
    <Content></Content>
    <Sider @add-room="handleAddRoom" @clear="handleClear"></Sider>
    <div
      v-if="collapsed"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 opacity-100 z-30"
      @click="collapsed = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import Sider from './Sider.vue'
import Content from './Content.vue'
import {
  conversation,
  addRoom,
  clearConversatiuons,
  deleteConversatiuonById
} from '@/api'
let rooms = reactive<RoomItem[]>([])
let currentIndex = ref(-1)
let collapsed = ref(false)
provide('currentIndex', currentIndex)
provide('collapsed', collapsed)
provide('rooms', rooms)

const getConversation = () =>
  conversation().then((res) => rooms.splice(0, rooms.length, ...res))

const handleAddRoom = () => {
  return addRoom().then((res) => {
    rooms.splice(0, rooms.length, ...res)
    currentIndex.value = 0
  })
}
const handleClear = () => {
  return clearConversatiuons().then((res) => {
    rooms.splice(0, rooms.length, ...res)
    currentIndex.value = -1
  })
}

const deleteConversatiuon = (id: string) => {
  return deleteConversatiuonById(id).then((res) => {
    rooms.splice(0, rooms.length, ...res)
    currentIndex.value -= 1
  })
}
provide('deleteConversatiuon', deleteConversatiuon)
provide('handleAddRoom', handleAddRoom)

getConversation()
</script>

<style scoped></style>
