<template>
  <div
    class="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100"
  >
    <h1
      class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 sm:mb-16 flex gap-2 items-center justify-center"
    >
      ChatGPT
    </h1>
    <div class="md:flex items-start text-center gap-3.5">
      <div
        class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1"
        v-for="(v, i) in data"
        :key="i"
      >
        <h2
          class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2"
        >
          <svg-icon :icon-class="v.svg" class="w-6 h-6"></svg-icon>
          {{ v.svg }}
        </h2>
        <ul class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
          <div v-for="(cv, ci) in v.items" :key="ci">
            <li
              v-if="i"
              class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
            >{{ cv }}</li>
            <button
              class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
              v-else
              @click="$emit('update:modelValue', cv)"
            >
            {{ `"${cv}" →` }}
            </button>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let data = [
  {
    svg: 'Examples',
    items: [
      'Explain quantum computing in simple terms',
      'Got any creative ideas for a 10 year old’s birthday?',
      'How do I make an HTTP request in Javascript?'
    ]
  },
  {
    svg: 'Capabilities',
    items: [
      'Remembers what user said earlier in the conversation',
      'Allows user to provide follow-up corrections',
      'Trained to decline inappropriate requests'
    ]
  },
  {
    svg: 'Limitations',
    items: [
      'May occasionally generate incorrect information',
      'May occasionally produce harmful instructions or biased content',
      'Limited knowledge of world and events after 2021'
    ]
  }
]
</script>
