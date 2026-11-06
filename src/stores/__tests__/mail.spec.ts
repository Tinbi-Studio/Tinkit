import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMailStore } from '@/stores/mail'

describe('mail store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('marks a message as read when opened', () => {
    const store = useMailStore()
    const message = store.messages.find((item) => item.id === 'mail-1')
    expect(message?.read).toBe(false)

    store.openMessage('mail-1')

    expect(store.messages.find((item) => item.id === 'mail-1')?.read).toBe(true)
    expect(store.activeId).toBe('mail-1')
  })

  it('filters the inbox by search query', () => {
    const store = useMailStore()
    store.query = 'checkout'

    expect(store.filteredMessages).toHaveLength(1)
    expect(store.filteredMessages[0].id).toBe('mail-1')
  })

  it('moves selected messages to trash and clears the selection', () => {
    const store = useMailStore()
    store.toggleSelected('mail-1')
    store.toggleSelected('mail-2')

    store.moveSelected('trash')

    expect(store.messages.find((item) => item.id === 'mail-1')?.folder).toBe('trash')
    expect(store.messages.find((item) => item.id === 'mail-2')?.folder).toBe('trash')
    expect(store.selectedIds).toEqual([])
  })

  it('adds a sent message to the sent folder', () => {
    const store = useMailStore()
    const id = store.sendMail({
      to: ['rina.kartika@studio.io'],
      cc: [],
      subject: 'Halo',
      body: '<p>Pesan uji</p>',
    })

    const sent = store.messages.find((item) => item.id === id)
    expect(sent?.folder).toBe('sent')
    expect(sent?.to[0].email).toBe('rina.kartika@studio.io')
    expect(sent?.preview).toContain('Pesan uji')
  })
})
