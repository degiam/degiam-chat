import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
// import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(PrimeVue, {
  ripple: true,
  theme: {
    preset: Lara,
    options: {
      darkModeSelector: '.disable-dark-mode',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
});
// app.use(ToastService);
app.mount('#app');