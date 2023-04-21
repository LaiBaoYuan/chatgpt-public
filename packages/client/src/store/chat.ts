import { Module } from 'vuex'
import { IRoot } from '.'
import { roomAPI, chatAPI } from '@/api'

export interface IChat {
  rooms: RoomItem[]
  curIndex: number
  conversations: MsgItem[]
}

const appStore: Module<IChat, IRoot> = {
  namespaced: true,
  state: {
    rooms: [],
    curIndex: -1,
    conversations: []
  },
  mutations: {
    SET_ROOMS(state, rooms) {
      state.rooms = rooms
    },
    SET_INDEX(state, index) {
      state.curIndex = index
    },
    SET_CONVERSATIONS(state, conversations) {
      state.conversations = conversations
    }
  },
  actions: {
    getRooms({ commit }) {
      return roomAPI.getRooms().then((res) => {
        commit('SET_ROOMS', res)
        return res
      })
    },
    addRoom({ state, commit }) {
      return roomAPI.addRoom().then((res) => {
        state.rooms.unshift({ ...res })
        commit('SET_INDEX', 0)
        commit('SET_CONVERSATIONS', [])
      })
    },
    deleteRoom({ state, commit }, payload) {
      return roomAPI.deleteRoom(payload.id).then((res) => {
        if (payload.id === state.rooms[state.curIndex].id) {
          commit('SET_CONVERSATIONS', [])
        }
        state.rooms.splice(payload.index, 1)
        commit(
          'SET_INDEX',
          payload.index > state.curIndex ? state.curIndex : state.curIndex - 1
        )
      })
    },
    clearRooms({ commit }) {
      return roomAPI.clearRooms().then(() => {
        commit('SET_ROOMS', [])
        commit('SET_CONVERSATIONS', [])
        commit('SET_INDEX', -1)
      })
    },
    // updateTitle({ state }, payload) {
    //   return roomAPI.updateTitle(payload.id, payload.data).then((res) => {
    //     let index = state.rooms.findIndex((v) => v._id === res._id)
    //     state.rooms.splice(index, 1, res)
    //   })
    // },
    getMessage({ commit, state }) {
      if (state.curIndex !== -1) {
        return chatAPI
          .getMessage(state.rooms[state.curIndex].id)
          .then((res) => {
            commit('SET_CONVERSATIONS', res)
          })
      }
      return Promise.resolve(null)
    },
    sendMessage({ state, dispatch }, payload) {
      if (state.curIndex !== -1) {
        let last = state.conversations[state.conversations.length - 1]
        let body = Object.assign(
          {},
          {
            send_id: last?.send_id,
            send_content: last?.send_content,
            receive_id: last?.receive_id,
            conversationId: last?.conversationId
          },
          payload
        )
        return chatAPI
          .sendMessage(state.rooms[state.curIndex].id, body)
          .then((res) => {
            res.loading = !res.error
            if (body.send_id) {
              let index = state.conversations.findIndex(
                (v) => v.send_id === body.send_id
              )
              state.conversations.splice(
                index,
                state.conversations.length - index,
                res
              )
            } else {
              state.conversations.push(res)
            }
            return res
          })
      }
    }
  }
}

export default appStore
