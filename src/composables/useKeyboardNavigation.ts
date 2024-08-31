import { ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'

type KeyboardNavigationOptions = {
  container: HTMLElement
  itemsCount: Ref<number>
  onIndexChange: (index: number) => void
  initialIndex?: Ref<number>
}

export function useKeyboardNavigation({
  container,
  itemsCount,
  onIndexChange,
  initialIndex = ref(0)
}: KeyboardNavigationOptions) {
  const currentIndex = ref(initialIndex.value)

  watch(initialIndex, (newValue) => {
    currentIndex.value = newValue
  })

  function getVisibleItemsCount(): number {
    const firstChild = container.firstElementChild as HTMLElement
    if (!firstChild) return 0
    const itemHeight = firstChild.offsetHeight
    return Math.floor(container.clientHeight / itemHeight)
  }

  function scrollToIndex(index: number) {
    const itemHeight = container.scrollHeight / itemsCount.value
    container.scrollTo({ top: index * itemHeight, behavior: 'smooth' })
  }

  function handleKeyDown(event: KeyboardEvent) {
    const visibleItemsCount = getVisibleItemsCount()

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        if (currentIndex.value > 0) {
          currentIndex.value--
          onIndexChange(currentIndex.value)
          scrollToIndex(currentIndex.value)
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (currentIndex.value < itemsCount.value - 1) {
          currentIndex.value++
          onIndexChange(currentIndex.value)
          scrollToIndex(currentIndex.value)
        }
        break
      case 'PageUp':
        event.preventDefault()
        const pageUpIndex = Math.max(0, currentIndex.value - visibleItemsCount)
        currentIndex.value = pageUpIndex
        onIndexChange(currentIndex.value)
        scrollToIndex(currentIndex.value)
        break
      case 'PageDown':
        event.preventDefault()
        const pageDownIndex = Math.min(itemsCount.value - 1, currentIndex.value + visibleItemsCount)
        currentIndex.value = pageDownIndex
        onIndexChange(currentIndex.value)
        scrollToIndex(currentIndex.value)
        break
    }
  }

  useEventListener(container, 'keydown', handleKeyDown)

  return {
    currentIndex
  }
}
