import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import formCreateDesigner from '@form-create/designer'
import formCreateElement from '@form-create/element-ui'
import formCreateAutoImport from '@form-create/element-ui/auto-import'
import elementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createApp } from 'vue'
import App from '~/App.vue'
import { router } from '~/router/router'
import pinia from '~/store'
import '~/styles/base.scss'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(elementPlus, {
  locale: zhCn,
})

app.use(formCreateDesigner)
formCreateElement.use(formCreateAutoImport)
app.use(formCreateElement)

app.use(pinia)
app.use(router)

app.mount('#app')
