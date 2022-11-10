import type { Pinia, defineStore } from 'pinia'
import { storeToRefs as _storeToRefs } from 'pinia'

export function useStoreToRefs<T extends ReturnType<typeof defineStore> = any>(storeCreator: T, pinia?: Pinia) {
  const store = storeCreator(pinia) as unknown as ReturnType<T>
  const data = {
    ...store,
    ..._storeToRefs(store)
  } as Merge<PickFunctions<ReturnType<T>>, ReturnType<typeof _storeToRefs<ReturnType<T>>>>
  return data
}

type Merge<T, D> = T & D

type PickFunctions<T> = {
  [K in keyof T]: T[K] extends Function ? T[K] : unknown
}
