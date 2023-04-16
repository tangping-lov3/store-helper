import { Pinia } from 'pinia'
import { storeToRefs as _storeToRefs } from 'pinia'
import { Ref } from 'vue-demi'

export function useStoreToRefs<T extends (pinia?: Pinia) => any>(storeCreator: T, pinia?: Pinia) {
  const store = storeCreator(pinia) as unknown as ReturnType<T>
  const data = {
    ...store,
    ..._storeToRefs(store)
  } as Data<typeof store> //as unknown as Merge<PickFunctions<ReturnType<T>>, ReturnType<typeof _storeToRefs<ReturnType<T>>>>
  return data
}

// type Merge<T, D> = T & D

type Data<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : Ref<T[K]>
}

// type PickFunctions<T> = {
//   [K in keyof T]: T[K] extends Function ? T[K] : never
// }

// const st = defineStore('t', () => {
//   const a = (a: string) => a
//   return {
//     a,
//     b: ref(1)
//   };
// })

// const sd = defineStore({
//   id: 'd',
//   state: () => ({
//     a: 1
//   }),
//   getters: {
//     b: (state) => state.a + 1
//   },
//   actions: {
//     c(a: string) {
//       return 1
//     }
//   }
// })

// const a = useStoreToRefs(sd)
// a.b
// a.c()

// const store = useStoreToRefs(st)

// store.b