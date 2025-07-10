import { readonly, ref } from 'vue'

export function useRequest<T, E = any>(req: () => Promise<T>) {
  const data = ref<T | null>(null)
  const isFetching = ref(false)
  const error = ref<E>()
  const isFinished = ref(false)

  const execute = async () => {
    try {
      isFetching.value = true
      isFinished.value = false
      data.value = await req()
    }
    catch (e) {
      error.value = e as E
    }
    finally {
      isFetching.value = false
      isFinished.value = true
    }
  }

  return {
    isFetching: readonly(isFetching),
    isFinished: readonly(isFinished),
    data,
    error,
    execute,
  }
}
