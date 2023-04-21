<template>
  <div
    class="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2"
  >
    <form
      class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
      @submit.prevent="$emit('confirm')"
    >
      <div class="relative flex h-full flex-1 md:flex-col">
        <div
          v-if="hasError"
          class="flex md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center m-auto flex-col items-center"
        >
          <span class="mb-3 block text-xs md:mb-auto dark:text-white"
            >在生成答复的过程中发生了错误</span
          >
          <button
            class="btn relative btn-primary m-auto"
            @click="$emit('regenerate')"
          >
            <div class="flex w-full items-center justify-center gap-2">
              <svg-icon icon-class="Refresh" class="w-3 h-3"></svg-icon>
              重新生成答复
            </div>
          </button>
        </div>
        <template v-else>
          <div
            class="ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center hidden md:flex"
          >
            <button
              v-if="isShowRegenerate"
              class="btn relative btn-neutral border-0 md:border"
              @click="$emit('regenerate')"
            >
              <div class="flex w-full items-center justify-center gap-2">
                <svg-icon icon-class="Refresh" class="w-3 h-3"></svg-icon>
                重新生成答复
              </div>
            </button>
            <button
              v-else-if="isShowStop"
              @click="chatAPI.cancelMessage"
              class="btn relative btn-neutral border-0 md:border"
            >
              <div class="flex w-full items-center justify-center gap-2">
                <svg-icon icon-class="Stop" class="w-3 h-3"></svg-icon>
                停止答复
              </div>
            </button>
          </div>
          <div
            class="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
          >
            <textarea
              ref="textarea"
              :value="modalValue"
              rows="1"
              @input="handleInput"
              @keydown="handleConfirm"
              style="max-height: 200px; overflow-y: hidden"
              class="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
            ></textarea>
            <button
              :disabled="loading"
              class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2"
            >
              <div v-if="loading" class="text-2xl">
                <span v-for="(v, i) in pointNum" :key="i">.</span>
              </div>
              <svg-icon v-else icon-class="Arrow" class="w-4 h-4"></svg-icon>
            </button>
          </div>
          <div
            class="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center md:hidden"
          >
            <button
              v-if="isShowRegenerate"
              class="btn relative btn-neutral border-0 md:border"
              @click="$emit('regenerate')"
            >
              <div class="flex w-full items-center justify-center gap-2">
                <svg-icon icon-class="Refresh" class="w-4 h-4"></svg-icon>
              </div>
            </button>
            <button
              v-else-if="isShowStop"
              @click="chatAPI.cancelMessage"
              class="btn relative btn-neutral border-0 md:border"
            >
              <div class="flex w-full items-center justify-center gap-2">
                <svg-icon icon-class="Stop" class="w-4 h-4"></svg-icon>
              </div>
            </button>
          </div>
        </template>
      </div>
    </form>
    <div
      class="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6"
    >
      <a
        href="https://help.openai.com/en/articles/6825453-chatgpt-release-notes"
        target="_blank"
        rel="noreferrer"
        class="underline"
        >ChatGPT Mar 14 Version</a
      >. WebSite PowerBy LaiBaoYuan. GitHub:
      <a
        href="https://github.com/LaiBaoYuan"
        target="_blank"
        rel="noreferrer"
        class="underline"
        >https://github.com/LaiBaoYuan</a
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// import { cancel } from '@/api'
// const props = defineProps<{ modalValue: string }>()
// const rooms = inject('rooms', reactive<RoomItem[]>([]))
// let currentIndex = inject('currentIndex', ref(-1))
// let loading = inject('loading', ref(false))
// let timer = ref<NodeJS.Timeout | null>(null)
// let pointNum = ref(1)

// const textarea = ref<HTMLElement>()

// const isShowRegenerate = computed(
//   () =>
//     currentIndex.value !== -1 &&
//     rooms[currentIndex.value].conversations.length &&
//     rooms[currentIndex.value].conversations.every((v) => !v.loading) &&
//     !loading.value
// )

// const isShowStop = computed(
//   () =>
//     currentIndex.value !== -1 &&
//     rooms[currentIndex.value].conversations.length &&
//     rooms[currentIndex.value].conversations.some((v) => v.loading)
// )

// const hasError = computed(() =>
//   rooms[currentIndex.value]?.conversations.some((v) => v.error)
// )

// const emits = defineEmits<{
//   (e: 'update:modalValue', val: string): void
//   (e: 'confirm'): void
//   (e: 'regenerate'): void
// }>()
// const handleInput = (e: Event) => {
//   emits('update:modalValue', (e.target as HTMLInputElement).value)
//   autoResizeTextarea()
// }
// const handleConfirm = (e: Event) => {
//   if ((e as KeyboardEvent).keyCode === 13) {
//     emits('confirm')
//     e.preventDefault()
//     autoResizeTextarea()
//   }
// }

// const handleCancel = () => {
//   cancel().then((res) => {})
// }

// const autoResizeTextarea = () => {
//   if (textarea.value) {
//     nextTick(() => {
//       textarea.value!.style.height = 'auto'
//       textarea.value!.style.height = `${textarea.value!.scrollHeight}px`
//     })
//   }
// }

// onMounted(() => {
//   nextTick(() => {
//     autoResizeTextarea()
//   })
// })

// watch(props, () => {
//   autoResizeTextarea()
// })

// watch(loading, (val) => {
//   if (val) {
//     timer.value = setInterval(() => {
//       if (pointNum.value++ > 2) {
//         pointNum.value = 1
//       }
//     }, 300)
//   } else {
//     clearInterval(timer.value!)
//     timer.value = null
//   }
// })
import { chatAPI } from '@/api'
import { useAppStore } from '@/store'
const store = useAppStore()
const props = defineProps<{ modalValue: string }>()
const { curIndex, conversations } = toRefs(store.state.chat)
let loading = inject('loading', ref(false))
let timer = ref<NodeJS.Timeout | null>(null)
let pointNum = ref(1)

const textarea = ref<HTMLElement>()

const isShowRegenerate = computed(
  () =>
    curIndex.value !== -1 &&
    conversations.value.length &&
    conversations.value.every((v) => !v.loading) &&
    !loading.value
)

const isShowStop = computed(
  () =>
    curIndex.value !== -1 &&
    conversations.value.length &&
    conversations.value.some((v) => v.loading)
)

const hasError = computed(() => conversations.value.some((v) => v.error))

const emits = defineEmits<{
  (e: 'update:modalValue', val: string): void
  (e: 'confirm'): void
  (e: 'regenerate'): void
}>()
const handleInput = (e: Event) => {
  emits('update:modalValue', (e.target as HTMLInputElement).value)
  autoResizeTextarea()
}
const handleConfirm = (e: Event) => {
  if ((e as KeyboardEvent).keyCode === 13) {
    emits('confirm')
    e.preventDefault()
    autoResizeTextarea()
  }
}

const autoResizeTextarea = () => {
  if (textarea.value) {
    nextTick(() => {
      textarea.value!.style.height = 'auto'
      textarea.value!.style.height = `${textarea.value!.scrollHeight}px`
    })
  }
}

onMounted(() => {
  nextTick(() => {
    autoResizeTextarea()
  })
})

watch(props, () => {
  autoResizeTextarea()
})

watch(loading, (val) => {
  if (val) {
    timer.value = setInterval(() => {
      if (pointNum.value++ > 2) {
        pointNum.value = 1
      }
    }, 300)
  } else {
    clearInterval(timer.value!)
    timer.value = null
  }
})
</script>

<style scoped></style>
