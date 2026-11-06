import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UiSelect from '@/components/ui/UiSelect.vue'

vi.mock('@/utils/gsap', () => ({
  animateDropdownIn: (_el: Element, done?: () => void) => done?.(),
  animateDropdownOut: (_el: Element, done?: () => void) => done?.(),
}))

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('UiSelect floating panel', () => {
  it('teleports the option list to document.body', async () => {
    const wrapper = mount(UiSelect, {
      props: { modelValue: '', options: ['Alpha', 'Beta'] },
      attachTo: document.body,
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await flush()

    const panel = document.body.querySelector('[data-floating-panel="listbox"]')
    expect(panel).not.toBeNull()
    expect(wrapper.element.contains(panel)).toBe(false)

    wrapper.unmount()
  })

  it('selects an option and closes the panel', async () => {
    const wrapper = mount(UiSelect, {
      props: { modelValue: '', options: ['Alpha', 'Beta'] },
      attachTo: document.body,
    })

    await wrapper.get('[role="combobox"]').trigger('click')
    await flush()
    const option = document.body.querySelector('[role="listbox"] button')
    expect(option).not.toBeNull()
    ;(option as HTMLButtonElement).click()
    await flush()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Alpha'])
    expect(document.body.querySelector('[data-floating-panel="listbox"]')).toBeNull()

    wrapper.unmount()
  })
})
