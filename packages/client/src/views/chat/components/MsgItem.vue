<template>
  <div
    class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 dark:bg-gray-800"
  >
    <div
      class="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto"
    >
      <div class="w-[30px] flex flex-col relative items-end">
        <div
          class="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center"
          style="background-color: rgb(16, 163, 127)"
        >
          <svg-icon icon-class="User" class="w-6 h-6"></svg-icon>
        </div>
      </div>
      <div
        class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]"
      >
        <div class="flex flex-grow flex-col gap-3">
          <div
            v-if="!msg.isEdit"
            class="min-h-[20px] flex flex-col items-start gap-4 break-all"
          >
            {{ msg.send_content }}
          </div>
          <textarea
            v-else
            class="m-0 resize-none border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0"
            ref="textarea"
            rows="1"
            :value="modalValue"
            @input="handleInput"
          ></textarea>
          <div class="text-center mt-2 flex justify-center" v-if="msg.isEdit">
            <button
              class="btn relative btn-primary mr-2"
              @click="$emit('submit')"
            >
              <div class="flex w-full items-center justify-center gap-2">
                Save &amp; Submit
              </div></button
            ><button class="btn relative btn-neutral" @click="$emit('cancel')">
              <div class="flex w-full items-center justify-center gap-2">
                Cancel
              </div>
            </button>
          </div>
        </div>
        <div
          v-if="!msg.isEdit"
          class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible"
        >
          <button
            class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible"
            @click="$emit('edit')"
          >
            <svg-icon icon-class="Edit" class="w-4 h-4"></svg-icon>
          </button>
        </div>
        <div class="flex justify-between"></div>
      </div>
    </div>
  </div>
  <div
    v-if="msg.receive_content || msg.error"
    class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]"
  >
    <div
      class="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto"
    >
      <div class="w-[30px] flex flex-col relative items-end">
        <div
          class="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center"
          style="background-color: rgb(16, 163, 127)"
        >
          <svg-icon icon-class="Chatgpt" class="w-6 h-6"></svg-icon>
          <span
            v-if="msg.error"
            class="absolute w-4 h-4 rounded-full text-[10px] flex justify-center items-center right-0 top-[20px] -mr-2 border border-white bg-red-500 text-white"
            >!</span
          >
        </div>
      </div>
      <div
        class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]"
      >
        <div class="flex flex-grow flex-col gap-3">
          <div
            v-if="!msg.error"
            class="min-h-[20px] flex flex-col items-start gap-4"
          >
            <div
              ref="reply"
              class="markdown prose w-full break-words dark:prose-invert light"
              v-html="markdown.render(msg.receive_content)"
            ></div>
          </div>
          <div
            v-else
            class="py-2 px-3 border text-gray-600 rounded-md text-sm dark:text-gray-100 border-red-500 bg-red-500/10"
          >
            {{ msg.error }}
          </div>
        </div>
        <div class="flex justify-between"></div>
      </div>
    </div>
  </div>
  <div class="cursor bg-gray-400 opacity-0 w-2 h-5" v-if="msg.loading"></div>
</template>

<script setup lang="ts">
import { markdown } from '@/plugins'
const props = defineProps<{ msg: MsgItem; modalValue: string }>()
const isEdit = computed(() => props.msg.isEdit)
const receiveContent = computed(() => props.msg.receive_content)
let pos = reactive({ x: -20, y: -20 })
const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'submit'): void
  (e: 'cancel'): void
  (e: 'update:modalValue', val: string): void
}>()

const textarea = ref<HTMLElement>()
const reply = ref<HTMLElement>()
const handleInput = (e: Event) => {
  emits('update:modalValue', (e.target as HTMLInputElement).value)
  autoResizeTextarea()
}

const autoResizeTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const getLastTextNode: (dom: Node) => Node | null = (dom) => {
  const children = dom?.childNodes
  if (children) {
    for (let i = children.length - 1; i >= 0; i--) {
      const node = children[i]
      if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue!)) {
        node.nodeValue = node.nodeValue!.replace(/\s+$/, '')
        return node
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const last = getLastTextNode(node)
        if (last) {
          return last
        }
      }
    }
  }
  return null
}

watch(isEdit, () => {
  nextTick(() => {
    autoResizeTextarea()
  })
})

watch(receiveContent, (val) => {
  nextTick(() => {
    if (val && reply.value) {
      const lastText = getLastTextNode(reply.value)
      const textNode = document.createTextNode('\u200b')
      if (lastText) {
        lastText.parentElement!.appendChild(textNode)
      } else {
        reply.value.appendChild(textNode)
      }
      const range = document.createRange()
      range.setStart(textNode, 0)
      range.setEnd(textNode, 0)
      const rect = range.getBoundingClientRect()
      pos.x = rect.left
      pos.y = rect.top
      textNode.remove()
    } else {
      pos.x = -20
      pos.y = -20
    }
  })
})
</script>

<style scoped>
.cursor {
  left: calc(v-bind('pos.x') * 1px);
  top: calc(v-bind('pos.y') * 1px);
  transform: translateX(3px);
  position: fixed;
  opacity: 0;
  animation: toggle 0.6s infinite;
}

@keyframes toggle {
  30% {
    opacity: 1;
  }
}
</style>
