import { createPinia } from 'pinia'
export { usePageStore } from '@/stores/modules/route-store'
export { useAppStore } from '@/stores/modules/app-store'
export { useUserStore } from '@/stores/modules/user-store'

const pinia = createPinia();

export default pinia
