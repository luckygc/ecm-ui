import { createPinia } from 'pinia'
export { usePageStore } from '@/store/modules/page-store.ts'
export { useUserStore } from '@/store/modules/user-store'

const pinia = createPinia();

export default pinia
