import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import formCreateDesigner from '@form-create/designer'
import formCreateElement from '@form-create/element-ui'
import formCreateAutoImport from '@form-create/element-ui/auto-import'
import { createApp } from 'vue'
import App from '~/App.vue'
import { router } from '~/router/router'
import pinia from '~/store'
import '~/styles/global.scss'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(formCreateDesigner)
formCreateElement.use(formCreateAutoImport)
app.use(formCreateElement)

app.use(pinia)
app.use(router)

app.mount('#app')
