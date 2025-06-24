import { createPinia } from 'pinia'
export { usePageStore } from '@/stores/modules/page-store.ts'
export { useUserStore } from '@/stores/modules/user-store'

const pinia = createPinia();

export default pinia
