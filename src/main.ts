import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Aura,
    // options: {
    //   darkModeSelector: '.dark',
    // },
  },
});
app.use(ToastService);
app.mount('#app');