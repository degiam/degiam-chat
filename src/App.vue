<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Chat from './components/Chat.vue';

const isStandalone = ref(false);
const isMobile = ref(false);

const sendHeightToParent = () => {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize', height }, '*');
};

const observer = new MutationObserver(sendHeightToParent);

const updateTheme = (isDarkMode: boolean) => {
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  sendHeightToParent();
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });

  const messageListener = (event: MessageEvent) => {
    if (event.data?.type === 'theme-change') {
      updateTheme(event.data.isDarkMode);
    }
  };
  window.addEventListener('message', messageListener);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  updateTheme(mediaQuery.matches);

  const handleMediaChange = (event: MediaQueryListEvent) => {
    updateTheme(event.matches);
  };
  mediaQuery.addEventListener('change', handleMediaChange);

  const handleScreenSizeMessage = (event: MessageEvent) => {
    if (event.data?.type === 'screen-size') {
      isStandalone.value = true;
      isMobile.value = event.data.isMobile;
    }
  };
  window.addEventListener('message', handleScreenSizeMessage);

  onUnmounted(() => {
    observer.disconnect();
    window.removeEventListener('message', messageListener);
    window.removeEventListener('message', handleScreenSizeMessage);
    mediaQuery.removeEventListener('change', handleMediaChange);
  });
});

const mainClass = computed(() => {
  if (isStandalone.value) {
    return isMobile.value
      ? '[&_.main-layout]:max-md:pb-24'
      : '[&_.main-layout]:md:pt-24';
  }
  return '';
});
</script>

<template>
  <main :class="mainClass">
    <h1 class="sr-only">QuiChat by Degiam</h1>
    <Chat />
  </main>
</template>

<style scoped>
/* Add any required scoped styles here */
</style>
