import type { AppConfig, ComputedGetter, ComputedRef, WritableComputedOptions, WritableComputedRef } from 'vue-demi'
import { computed, getCurrentInstance } from 'vue-demi'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

interface MapReturnd {
  [key: string]: ComputedGetter<unknown>
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

const withComputed = (target: MapReturnd, { allowValueChange = false, ns }: { allowValueChange?: boolean; ns?: string | string[] } = {}) => {
  const ctx = getContext()
  const returnd = {} as any
  Object.entries(target).forEach(([key, val]) => {
    const computedFn = bindContext(val, ctx)
    if (allowValueChange) {
      const mapedMutations = typeof ns === 'string' ? useMapMutations(ns, ['_SET_STATE']) : useMapMutations(['_SET_STATE'])
      const update = mapedMutations._SET_STATE
      const writableComputedOptions: WritableComputedOptions<unknown> = {
        get: computedFn,
        set: (v: any) => {
          update({
            key,
            value: v
          })
        }
      }
      returnd[key] = computed(writableComputedOptions)
    }
    else {
      returnd[key] = computed(computedFn)
    }
  })
  return returnd
}

export function useMapState<T extends string[], AllowValueChange extends boolean = false>(ns: string, getters: T, allowValueChange?: AllowValueChange): Record<Extract<PickReturnType<T>, string>, AllowValueChange extends true ? WritableComputedRef<any> : ComputedRef>
export function useMapState<T extends string[], AllowValueChange extends boolean = false>(getters: T, allowValueChange?: AllowValueChange): Record<Extract<PickReturnType<T>, string>, AllowValueChange extends true ? WritableComputedRef<any> : ComputedRef>
export function useMapState<T extends Record<string, any>, AllowValueChange extends boolean = false>(ns: string, getters: T, allowValueChange?: AllowValueChange): Record<keyof T, AllowValueChange extends true ? WritableComputedRef<any> : ComputedRef>
export function useMapState<T extends Record<string, any>, AllowValueChange extends boolean = false>(getters: T, allowValueChange?: AllowValueChange): Record<keyof T, AllowValueChange extends true ? WritableComputedRef<any> : ComputedRef>
export function useMapState<T extends string[], AllowValueChange extends boolean = false>(ns: string, getters?: T | AllowValueChange, allowValueChange?: AllowValueChange): Record<Extract<PickReturnType<T>, string>, AllowValueChange extends true ? WritableComputedRef<any> : ComputedRef> {
  getters = typeof getters === 'boolean' ? undefined : getters
  allowValueChange = typeof getters === 'boolean' ? getters : allowValueChange
  return withComputed(mapState(ns, getters!), {
    allowValueChange,
    ns
  })
}

export function useMapGetters<T extends string[]>(ns: string, getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapGetters<T extends string[]>(getters: T): Record<Extract<PickReturnType<T>, string>, ComputedRef>
export function useMapGetters<T extends Record<string, any>>(ns: string, getters: T): Record<keyof T, ComputedRef>
export function useMapGetters<T extends Record<string, any>>(getters: T): Record<keyof T, ComputedRef>
export function useMapGetters<T extends string[]>(ns: string, getters?: T): Record<Extract<PickReturnType<T>, string>, ComputedRef> {
  return withComputed(mapGetters(ns, getters!))
}

export function useMapActions<T extends string[]>(ns: string, map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapActions<T extends string[]>(map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapActions<T extends Record<string, any>>(ns: string, map: T): Record<keyof T, Function>
export function useMapActions<T extends Record<string, any>>(map: T): Record<keyof T, Function>
export function useMapActions<T extends string[]>(ns: string, map?: T): Record<Extract<PickReturnType<T>, string>, Function> {
  const actions = mapActions(ns, map!)
  const ctx = getContext()
  bindContexts(actions, ctx)
  return actions as unknown as Record<Extract<PickReturnType<T>, string>, Function>
}

export function useMapMutations<T extends string[]>(ns: string, map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapMutations<T extends Record<string, any>>(ns: string, map: T): Record<keyof T, Function>
export function useMapMutations<T extends string[]>(map: T): Record<Extract<PickReturnType<T>, string>, Function>
export function useMapMutations<T extends Record<string, any>>(map: T): Record<keyof T, Function>
export function useMapMutations<T extends string[]>(ns: string, map?: T): Record<Extract<PickReturnType<T>, string>, Function> {
  const mutations = mapMutations(ns, map!)
  const ctx = getContext()
  bindContexts(mutations, ctx)
  return mutations as unknown as Record<Extract<PickReturnType<T>, string>, Function>
}

type PickReturnType<T> = Exclude<{
  [K in keyof T]: T[K]
}[Exclude<keyof T, 'length'>], (...args: any[]) => any>
