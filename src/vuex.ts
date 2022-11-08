import type { AppConfig, ComputedRef } from 'vue-demi'
import { computed, getCurrentInstance } from 'vue-demi'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

interface MapReturnd {
  [key: string]: Function
}

interface ComputedReturnd {
  [key: string]: ComputedRef<Function>
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
  const returnd = {} as ComputedReturnd
  Object.entries(target).forEach(([key, val]) => {
    const computedFn = bindContext(val, ctx)
    returnd[key] = computed(computedFn)
  })
  return returnd
}

type UseMapState = (...args: Parameters<typeof mapState>) => Record<string, ComputedRef>

export const useMapState: UseMapState = (...args) => withComputed(mapState(...args))

export const useMapGetters = (...args: Parameters<typeof mapGetters>): Record<string, ComputedRef> => withComputed(mapGetters(...args))

export const useMapActions = (...args: Parameters<typeof mapActions>) => {
  const actions = mapActions(...args)
  const ctx = getContext()
  bindContexts(actions, ctx)
  return actions
}

export const useMapMutations = (...args: Parameters<typeof mapMutations>) => {
  const mutations = mapMutations(...args)
  const ctx = getContext()
  bindContexts(mutations, ctx)
  return mutations
}
