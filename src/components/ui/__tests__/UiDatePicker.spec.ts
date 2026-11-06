import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'

vi.mock('@/utils/gsap', () => ({
  animateDropdownIn: (_el: Element, done?: () => void) => done?.(),
  animateDropdownOut: (_el: Element, done?: () => void) => done?.(),
}))

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('UiDatePicker floating panel', () => {
  it('teleports the calendar to document.body and uses a real width class', async () => {
    const wrapper = mount(UiDatePicker, {
      props: { modelValue: '' },
      attachTo: document.body,
    })

    await wrapper.get('[aria-haspopup="dialog"]').trigger('click')
    await flush()

    const panel = document.body.querySelector('[data-floating-panel="dialog"]') as HTMLElement | null
    expect(panel).not.toBeNull()
    expect(panel?.className).toContain('w-[19rem]')
    expect(panel?.className).not.toContain('w-76')
    expect(wrapper.element.contains(panel)).toBe(false)

    wrapper.unmount()
  })
})
