
```ts
// npm i @tonyptang/store-helper
// for vuex
import { useMapState } from '@tonyptang/store-helper/vuex'
const { state } = useMapState('moduleName', ['state'])

const { state } = useMapState('moduleName', ['state'], true)

state.value = 'changed'

```

```ts
// for pinia
import { useStoreToRefs } from '@tonyptang/store-helper/pinia'

const store = defineStore('id', () => {
  const count = ref(0)

  const increment = () => count.value++
  return {
    count,
    increment
  }
})

export const countStore = () => useStoreToRefs(store)

// usage

const { count, increment } = countStore()
console.log(count.value) // 0
```
