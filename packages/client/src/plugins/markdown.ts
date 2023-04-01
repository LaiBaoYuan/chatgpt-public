import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import copy from '@/icons/Copy.svg?raw'

let md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
  typographer: true,
  highlight: function (str, lang) {
    let language = (hljs.getLanguage(lang) && lang) || 'bash'
    return `<pre><div class="bg-black rounded-md mb-4"><div class="pre-header flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>${language}</span><button class="flex ml-auto gap-2 copy">${copy}Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-${language}">${
      hljs.highlight(language, str).value
    }</code></div></div></pre>`
  }
})

export const markdown = md
