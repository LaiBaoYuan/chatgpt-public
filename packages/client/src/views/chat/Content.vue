<template>
  <div class="flex h-full flex-1 flex-col md:pl-[260px]">
    <Header></Header>
    <main
      class="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1"
    >
      <div class="flex-1 overflow-hidden">
        <div class="relative h-full dark:bg-gray-800">
          <div
            class="w-full h-full overflow-y-auto"
            ref="container"
            @scroll="listenScroll"
          >
            <div class="flex flex-col items-center text-sm dark:bg-gray-800">
              <Introduce
                v-model="input"
                v-if="curIndex === -1 || !conversations.length"
              ></Introduce>
              <template v-else>
                <msg-item
                  v-for="(v, i) in conversations"
                  :key="i"
                  :msg="v"
                  v-model:modalValue="v.send_content"
                  @edit="v.isEdit = true"
                  @cancel="v.isEdit = false"
                  @submit="handleSubmit(v)"
                />
              </template>
              <div class="w-full h-32 md:h-48 flex-shrink-0"></div>
            </div>
            <button
              v-if="showToBottom"
              class="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
              @click="scrollToBottom"
            >
              <svg-icon icon-class="ToBottom" class="w-4 h-4 m-1"></svg-icon>
            </button>
          </div>
        </div>
      </div>
      <Footer
        v-model:modalValue="input"
        @confirm="handleConfirm"
        @regenerate="handleRegenerate"
      ></Footer>
    </main>
  </div>
</template>

<script setup lang="ts">
// import { Introduce, MsgItem } from './components'
// import Header from './Header.vue'
// import Footer from './Footer.vue'
// import { sendMsg } from '@/api'

// let sse = new EventSource(`${import.meta.env.VITE_BASE_API}/conversation`, {
//   withCredentials: true
// })

// sse.addEventListener('message', (e) => {
//   let [send_id, conversationId, receive_id] = e.lastEventId.split('.')
//   let currentConversation = rooms[currentIndex.value]?.conversations
//   let msg = currentConversation.find((v) => v.send_id === send_id)
//   if (msg) {
//     msg.loading = true
//     msg.receive_id = receive_id
//     msg.conversationId = conversationId
//     msg.receive_content += (e.data as string).replace(/^"|"$/g, '')
//     msg.receive_content = msg.receive_content
//       .replace(/\\n/g, '\n')
//       .replace(/\\"/, '"')
//     scrollToBottom()
//   }
// })

// sse.addEventListener('error', (e) => {
//   let currentConversation = rooms[currentIndex.value].conversations
//   let msg = currentConversation.find(
//     (v) => v.send_id === (e as MessageEvent).lastEventId
//   )
//   if (msg) {
//     msg.error = (e as MessageEvent).data.replace(/^"|"$/g, '')
//     msg.loading = false
//     loading.value = false
//   }
// })

// sse.addEventListener('cancel', (e) => {
//   let currentConversation = rooms[currentIndex.value].conversations
//   let msg = currentConversation.find(
//     (v) => v.send_id === (e as MessageEvent).lastEventId
//   )
//   if (msg) {
//     msg.error = false
//     msg.loading = false
//     loading.value = false
//   }
// })

// sse.addEventListener('complete', (e) => {
//   let currentConversation = rooms[currentIndex.value].conversations
//   let msg = currentConversation.find(
//     (v) => v.send_id === (e as MessageEvent).lastEventId
//   )
//   if (msg) {
//     loading.value = false
//     msg.loading = false
//   }
// })

// let input = ref('')
// let loading = ref(false)
// let showToBottom = ref(false)
// const rooms = inject('rooms', reactive<RoomItem[]>([]))
// let currentIndex = inject('currentIndex', ref(-1))
// let handleAddRoom = inject<{ (): void }>('handleAddRoom')!
// const handleConfirm = async () => {
//   if (input.value.trim() === '') {
//     return
//   }
//   if (currentIndex.value === -1) {
//     await handleAddRoom()
//   }
//   let room = rooms[currentIndex.value]
//   let conversations = room.conversations
//   sendMsg(room.id, {
//     send_content: input.value,
//     receive_id: conversations[conversations.length - 1]?.receive_id,
//     conversationId: conversations[conversations.length - 1]?.conversationId
//   })
//     .then((res) => {
//       rooms[currentIndex.value].conversations = res
//       if (res.some((v) => v.error)) {
//         loading.value = false
//       }
//     })
//     .catch(() => {
//       loading.value = false
//     })
//   scrollToBottom()
//   loading.value = true
//   input.value = ''
// }

// let container = ref<HTMLElement>()

// watch(
//   currentIndex,
//   () => {
//     nextTick(() => {
//       listenScroll()
//     })
//   },
//   { immediate: true }
// )

// const listenScroll = () => {
//   if (container.value) {
//     const { scrollHeight, offsetHeight, scrollTop } = container.value
//     showToBottom.value = scrollHeight !== offsetHeight + scrollTop
//   }
// }

// const scrollToBottom = () => {
//   if (container.value) {
//     container.value.scrollTo({
//       behavior: 'smooth',
//       top: container.value.scrollHeight
//     })
//   }
// }

// const handleRegenerate = () => {
//   if (loading.value) {
//     return
//   }
//   let room = rooms[currentIndex.value]
//   let conversations = room.conversations
//   let last = conversations[conversations.length - 1]

//   sendMsg(room.id, {
//     send_id: last.send_id,
//     send_content: last.send_content,
//     receive_id: last.receive_id,
//     conversationId: last.conversationId
//   })
//     .then((res) => {
//       rooms[currentIndex.value].conversations = res
//       if (res.some((v) => v.error)) {
//         loading.value = false
//       }
//     })
//     .catch(() => {
//       loading.value = false
//     })
//   scrollToBottom()
//   loading.value = true
// }

// const handleSubmit = (msg: MsgItem) => {
//   if (loading.value) {
//     return
//   }
//   let room = rooms[currentIndex.value]
//   sendMsg(room.id, {
//     send_id: msg.send_id,
//     send_content: msg.send_content,
//     receive_id: msg.receive_id,
//     conversationId: msg.conversationId
//   })
//     .then((res) => {
//       rooms[currentIndex.value].conversations = res
//       if (res.some((v) => v.error)) {
//         loading.value = false
//       }
//     })
//     .catch(() => {
//       loading.value = false
//     })
//   scrollToBottom()
//   loading.value = true
// }

// provide('loading', loading)
import { Introduce, MsgItem } from './components'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { useAppStore } from '@/store'
defineProps<{ load: boolean }>()
const store = useAppStore()
const app = store.state.app
const { curIndex, conversations } = toRefs(store.state.chat)
let input = ref('')
let loading = ref(false)
let showToBottom = ref(false)
provide('loading', loading)

const handleMessage = (e: MessageEvent) => {
  let [send_id, conversationId, receive_id] = e.lastEventId.split('.')
  let msg = conversations.value.find((v) => v.send_id === send_id)
  if (msg) {
    msg.loading = true
    msg.receive_id = receive_id
    msg.conversationId = conversationId
    msg.receive_content += (e.data as string).replace(/^"|"$/g, '')
    msg.receive_content = msg.receive_content
      .replace(/\\n/g, '\n')
      .replace(/\\"/, '"')
    // scrollToBottom()
  }
}
const handleError = (e: MessageEvent) => {
  let msg = conversations.value.find((v) => v.send_id === e.lastEventId)
  if (msg) {
    msg.error = true
    msg.loading = false
    loading.value = false
  }
}
const handleCancel = (e: MessageEvent) => {
  let msg = conversations.value.find((v) => v.send_id === e.lastEventId)
  if (msg) {
    msg.error = false
    msg.loading = false
    loading.value = false
  }
}
const handleComplete = async (e: MessageEvent) => {
  let msg = conversations.value.find((v) => v.send_id === e.lastEventId)
  if (msg) {
    loading.value = false
    msg.loading = false
  }
}

onMounted(() => {
  app.sse!.addEventListener('message', handleMessage)
  app.sse!.addEventListener('error', handleError)
  app.sse!.addEventListener('cancel', handleCancel)
  app.sse!.addEventListener('complete', handleComplete)
})
onUnmounted(() => {
  app.sse!.removeEventListener('message', handleMessage)
  app.sse!.removeEventListener('error', handleError)
  app.sse!.removeEventListener('cancel', handleCancel)
})

let container = ref<HTMLElement>()
const listenScroll = () => {
  if (container.value) {
    const { scrollHeight, offsetHeight, scrollTop } = container.value
    showToBottom.value = scrollHeight !== offsetHeight + scrollTop
  }
}

const scrollToBottom = () => {
  if (container.value) {
    container.value.scrollTo({
      behavior: 'smooth',
      top: container.value.scrollHeight
    })
  }
}

const handleConfirm = async () => {
  if (input.value.trim() === '') {
    return
  }
  if (curIndex.value === -1) {
    await store.dispatch('chat/addRoom')
  }
  store
    .dispatch('chat/sendMessage', {
      send_id: '',
      send_content: input.value
    })
    .then((res) => (loading.value = !res.error))
    .catch(() => (loading.value = false))
  loading.value = true
  input.value = ''
}

const handleRegenerate = () => {
  if (loading.value) {
    return
  }
  store
    .dispatch('chat/sendMessage')
    .then((res) => (loading.value = !res.error))
    .catch(() => (loading.value = false))
  loading.value = true
}

const handleSubmit = (msg: MsgItem) => {
  if (loading.value) {
    return
  }
  store
    .dispatch('chat/sendMessage', msg)
    .then((res) => (loading.value = !res.error))
    .catch(() => (loading.value = false))
  loading.value = true
}

defineExpose({ listenScroll })
</script>
