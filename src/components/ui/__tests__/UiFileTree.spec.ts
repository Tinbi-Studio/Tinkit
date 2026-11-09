import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UiFileTree, { type FileTreeItem } from '@/components/ui/UiFileTree.vue'

const treeData: FileTreeItem[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'main', name: 'main.ts', type: 'file', size: '1.2 KB' },
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          { id: 'btn', name: 'UiButton.vue', type: 'file', size: '3.4 KB' },
        ],
      },
    ],
  },
  { id: 'readme', name: 'README.md', type: 'file', size: '4.0 KB' },
]

describe('UiFileTree', () => {
  it('renders top-level items and expands root folders by default', () => {
    const wrapper = mount(UiFileTree, {
      props: { items: treeData },
    })

    expect(wrapper.text()).toContain('src')
    expect(wrapper.text()).toContain('main.ts')
    expect(wrapper.text()).toContain('README.md')
    // Nested folder 'components' is not expanded unless clicked or in defaultExpandedIds
    expect(wrapper.text()).not.toContain('UiButton.vue')
  })

  it('expands a nested folder when clicked and emits select event', async () => {
    const wrapper = mount(UiFileTree, {
      props: { items: treeData },
    })

    const compFolder = wrapper
      .findAll('[role="treeitem"]')
      .find((el) => el.text().includes('components'))
    expect(compFolder).toBeTruthy()
    await compFolder!.trigger('click')

    expect(wrapper.text()).toContain('UiButton.vue')
    expect(wrapper.emitted('select')?.[0]?.[1]).toBe('src/components')
  })

  it('auto-expands matching ancestor folders when searching', async () => {
    const wrapper = mount(UiFileTree, {
      props: { items: treeData },
    })

    const input = wrapper.find('input[type="text"]')
    await input.setValue('UiButton')

    expect(wrapper.text()).toContain('UiButton.vue')
    expect(wrapper.text()).not.toContain('README.md')
  })
})
