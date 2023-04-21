export const roomAPI = {
  getRooms: () => AxiosPost('/room/getRooms'),
  addRoom: () => AxiosPost('/room/addRoom'),
  clearRooms: () => AxiosDelete('/room/clearRooms'),
  deleteRoom: (id: string) => AxiosDelete(`/room/deleteRoom/${id}`)
}

export const chatAPI = {
  getMessage: (id: string) => AxiosGet(`/chat/get/${id}`),
  sendMessage: (
    id: string,
    data: Partial<
      Pick<
        MsgItem,
        'send_content' | 'receive_id' | 'send_id' | 'conversationId'
      >
    >
  ) => AxiosPost<MsgItem>(`/chat/send/${id}`, data),
  cancelMessage: () => AxiosGet('/chat/cancel')
}
