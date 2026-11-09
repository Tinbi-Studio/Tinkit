import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiJsonViewer from '@/components/ui/UiJsonViewer.vue'

const sampleData = {
  appName: 'Tinkit',
  port: 8080,
  enabled: true,
  nested: {
    region: 'ap-southeast-1',
    replicas: 3,
  },
}

describe('UiJsonViewer', () => {
  it('renders JSON keys and primitive values in tree mode', () => {
    const wrapper = mount(UiJsonViewer, {
      props: {
        data: sampleData,
        title: 'config.json',
        defaultExpandDepth: 2,
      },
    })

    expect(wrapper.text()).toContain('config.json')
    expect(wrapper.text()).toContain('"appName"')
    expect(wrapper.text()).toContain('"Tinkit"')
    expect(wrapper.text()).toContain('8080')
    expect(wrapper.text()).toContain('"region"')
  })

  it('collapses nested objects when defaultExpandDepth is 1 and expands on click', async () => {
    const wrapper = mount(UiJsonViewer, {
      props: {
        data: sampleData,
        defaultExpandDepth: 1,
      },
    })

    // "nested" should be collapsed initially (showing "2 keys" summary instead of "region")
    expect(wrapper.text()).toContain('2 keys')
    expect(wrapper.text()).not.toContain('"region"')

    // Find and click the collapsed "nested" treeitem row
    const nestedRow = wrapper
      .findAll('[role="treeitem"]')
      .find((el) => el.text().includes('"nested"'))
    expect(nestedRow).toBeTruthy()
    await nestedRow!.trigger('click')

    expect(wrapper.text()).toContain('"region"')
    expect(wrapper.text()).toContain('"ap-southeast-1"')
  })

  it('toggles between interactive tree and raw JSON mode', async () => {
    const wrapper = mount(UiJsonViewer, {
      props: { data: sampleData },
    })

    const rawToggleBtn = wrapper.find('button[aria-label="Toggle Raw JSON"]')
    await rawToggleBtn.trigger('click')

    expect(wrapper.find('pre').exists()).toBe(true)
    expect(wrapper.find('pre').text()).toContain('"appName": "Tinkit"')
  })
})
