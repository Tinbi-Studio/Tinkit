import { ref } from 'vue'
import { defineStore } from 'pinia'
import { PRODUCTS, type Product, type ProductStatus } from '@/data/products'

export interface ProductDraft {
  name: string
  sku: string
  category: string
  status: ProductStatus
  price: number
  discount: number
  stock: number
  tags: string[]
  description: string
  gallery: string[]
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'

function compareAtFor(price: number, discount: number): number {
  if (discount <= 0 || discount >= 100) return price
  return Math.round(price / (1 - discount / 100))
}

export const useProductStore = defineStore('tinkit-products', () => {
  const products = ref<Product[]>(
    PRODUCTS.map((product) => ({
      ...product,
      tags: [...product.tags],
      gallery: [...product.gallery],
    })),
  )

  function findProduct(id: number): Product | undefined {
    return products.value.find((product) => product.id === id)
  }

  function nextId(): number {
    return Math.max(0, ...products.value.map((product) => product.id)) + 1
  }

  function addProduct(draft: ProductDraft): Product {
    const gallery = draft.gallery.length ? draft.gallery : [FALLBACK_IMAGE]
    const product: Product = {
      ...draft,
      id: nextId(),
      compareAt: compareAtFor(draft.price, draft.discount),
      stockLimit: Math.max(100, draft.stock),
      sold: 0,
      rating: 0,
      reviews: 0,
      image: gallery[0],
      gallery,
      createdAt: 'Baru saja',
    }
    products.value = [product, ...products.value]
    return product
  }

  function updateProduct(id: number, draft: ProductDraft): Product | undefined {
    const target = findProduct(id)
    if (!target) return undefined

    const gallery = draft.gallery.length ? draft.gallery : target.gallery
    Object.assign(target, draft, {
      gallery,
      image: gallery[0] ?? target.image,
      compareAt: compareAtFor(draft.price, draft.discount),
    })
    return target
  }

  function updatePricing(id: number, price: number, discount: number) {
    const target = findProduct(id)
    if (!target) return
    target.price = price
    target.discount = discount
    target.compareAt = compareAtFor(price, discount)
  }

  function duplicateProduct(id: number): Product | undefined {
    const source = findProduct(id)
    if (!source) return undefined

    const clone: Product = {
      ...source,
      id: nextId(),
      name: `${source.name} (Copy)`,
      sku: `${source.sku}-COPY`,
      status: 'Draft',
      sold: 0,
      reviews: 0,
      tags: [...source.tags],
      gallery: [...source.gallery],
      createdAt: 'Baru saja',
    }
    products.value = [clone, ...products.value]
    return clone
  }

  function archiveProduct(id: number) {
    const target = findProduct(id)
    if (target) target.status = 'Archived'
  }

  function removeProducts(ids: number[]) {
    products.value = products.value.filter((product) => !ids.includes(product.id))
  }

  return {
    products,
    findProduct,
    addProduct,
    updateProduct,
    updatePricing,
    duplicateProduct,
    archiveProduct,
    removeProducts,
  }
})
