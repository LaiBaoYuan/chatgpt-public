export function conversation() {
  return AxiosPost('/conversations')
}

export function addRoom() {
  return AxiosPost('/add')
}

export function deleteConversatiuonById(id: string) {
  return AxiosDelete(`/${id}`)
}

export function clearConversatiuons() {
  return AxiosDelete('/clear')
}

export function sendMsg(
  id: string,
  data: Partial<Pick<MsgItem, 'send_content' | 'receive_id' | 'send_id' | 'conversationId'>>
) {
  return AxiosPost<MsgItem[]>(`/send/${id}`, data)
}

export function cancel() {
  return AxiosGet('/cancel')
}
