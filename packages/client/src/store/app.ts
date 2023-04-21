import { Module } from 'vuex'
import { IRoot } from '.'

export interface IApp {
  sse?: EventSource
  collapsed: boolean
  mode: 'Light' | 'Dark'
}

const mode =
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches)
    ? 'Dark'
    : 'Light'

function setMode(mode: IApp['mode']) {
  if (mode === 'Dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.theme = mode.toLocaleLowerCase()
}
setMode(mode)

const appStore: Module<IApp, IRoot> = {
  namespaced: true,
  state: {
    sse: new EventSource(`${import.meta.env.VITE_BASE_API}/conversation`, {
      withCredentials: true
    }),
    collapsed: false,
    mode
  },
  mutations: {
    SET_COLLAPSED(state, collapsed) {
      state.collapsed = collapsed
    },
    SET_MODE(state, mode) {
      state.mode = mode
      setMode(mode)
    }
  }
}

export default appStore
