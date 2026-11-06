import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiAccordion from '@/components/ui/UiAccordion.vue'

const items = [
  { id: 'a', title: 'Alpha', content: 'Isi Alpha' },
  { id: 'b', title: 'Beta', content: 'Isi Beta' },
]

describe('UiAccordion', () => {
  it('opens an item without a v-model binding', async () => {
    const wrapper = mount(UiAccordion, { props: { items } })
    const headers = wrapper.findAll('button')

    expect(headers[0].attributes('aria-expanded')).toBe('false')
    await headers[0].trigger('click')
    expect(headers[0].attributes('aria-expanded')).toBe('true')
  })

  it('keeps only one item open in single mode', async () => {
    const wrapper = mount(UiAccordion, { props: { items } })
    const headers = wrapper.findAll('button')

    await headers[0].trigger('click')
    await headers[1].trigger('click')

    expect(headers[0].attributes('aria-expanded')).toBe('false')
    expect(headers[1].attributes('aria-expanded')).toBe('true')
  })

  it('allows multiple open items when multiple is set', async () => {
    const wrapper = mount(UiAccordion, { props: { items, multiple: true } })
    const headers = wrapper.findAll('button')

    await headers[0].trigger('click')
    await headers[1].trigger('click')

    expect(headers[0].attributes('aria-expanded')).toBe('true')
    expect(headers[1].attributes('aria-expanded')).toBe('true')
  })
})
