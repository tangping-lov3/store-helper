import type { AppConfig, ComputedRef } from 'vue-demi'
import { computed, getCurrentInstance } from 'vue-demi'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

interface MapReturnd {
  [key: string]: Function
}

const bindContext = (fn: Function, ctx: AppConfig['globalProperties']) => fn.bind(ctx)

const bindContexts = (target: MapReturnd, ctx: AppConfig['globalProperties']) => {
  for (const key in target)
    target[key] = bindContext(target[key], ctx)
}

const getContext = () => {
  const currentInstance = getCurrentInstance()
  return currentInstance!.appContext.config.globalProperties
}

const withComputed = (target: MapReturnd) => {
  const ctx = getContext()
  const returnd = {} as any
  Object.entries(target).forEach(([key, val]) => {
    const computedFn = bindContext(val, ctx)
    returnd[key] = computed(computedFn)
  })
  return returnd
}

export function useMapState<T extends string[]>(ns: string, getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapState<T extends string[]>(getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapState<T extends string[]>(ns: string, getters?: T): Record<Extract<PickReturnType<T>, string>, ComputedRef> {
  return withComputed(mapState(ns, getters!))
}

export function useMapGetters<T extends string[]>(ns: string, getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapGetters<T extends string[]>(getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapGetters<T extends string[]>(ns: string, getters?: T): Record<Extract<PickReturnType<T>, string>, ComputedRef> {
  return withComputed(mapGetters(ns, getters!))
}

export function useMapActions<T extends string[]>(ns: string, map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapActions<T extends string[]>(map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapActions<T extends string[]>(ns: string, map?: T): Record<Extract<PickReturnType<T>, string>, Function> {
  const actions = mapActions(ns, map!)
  const ctx = getContext()
  bindContexts(actions, ctx)
  return actions as unknown as Record<Extract<PickReturnType<T>, string>, Function>
}

export function useMapMutations<T extends string[]>(ns: string, map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapMutations<T extends string[]>(map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapMutations<T extends string[]>(ns: string, map?: T): Record<Extract<PickReturnType<T>, string>, Function> {
  const mutations = mapMutations(ns, map!)
  const ctx = getContext()
  bindContexts(mutations, ctx)
  return mutations as unknown as Record<Extract<PickReturnType<T>, string>, Function>
}

type PickReturnType<T> = Exclude<{
  [K in keyof T]: T[K]
}[Exclude<keyof T, 'length'>], (...args: any[]) => any>

