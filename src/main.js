import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { registerLicense } from '@syncfusion/ej2-base';
import { enableRipple } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmtCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWX5ed3VWQmlZVkd0XEE=');
enableRipple(true);
//DebugUrl https://localhost:7260/api/ ProdUrl https://api.sts-finanzen.de/api/
const app = createApp(App)
app.config.globalProperties.$version = "1.0.0.0"
app.config.globalProperties.$serviceBaseUrl = "https://localhost:7260/api/"
app.use(store).use(router).mount("#app");