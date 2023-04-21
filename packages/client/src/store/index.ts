import app, { IApp } from './app'
import chat, { IChat } from './chat'

export interface IRoot {
  app: IApp
  chat: IChat
}

const store = createStore({
  modules: { app, chat },
  getters: {
    // id: (state) => state.user.id,
    // token: (state) => state.user.token,
    // openid: (state) => state.user.openid,
    // sse: (state) => state.app.sse,
    // mode: (state) => state.app.mode,
    // rooms: (state) => state.chat.rooms,
    // curIndex: (state) => state.chat.curIndex
  }
})

export default store

export type AppStore = typeof store
export const useAppStore: () => AppStore = useStore
