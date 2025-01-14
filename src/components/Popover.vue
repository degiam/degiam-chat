<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";

defineProps<{
  content: string | null;
}>();

const isInit = ref(true);
const isVisible = ref(false);
const position = reactive({ x: 0, y: 0 });

const handleMouseMove = (event: MouseEvent) => {
  const { clientX, clientY } = event;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const maxPopoverWidth = 200;
  const popoverPadding = 10;

  position.x = Math.min(
    clientX + 0,
    screenWidth - maxPopoverWidth - popoverPadding
  );
  position.y = Math.min(
    clientY + 65,
    screenHeight - popoverPadding
  );
};

const handleMouseEnter = () => {
  isVisible.value = true;
};

const handleMouseLeave = () => {
  isVisible.value = false;
};

onMounted(() => {
  setTimeout(() => {
    isInit.value = false;
  }, 500);
});
</script>

<template>
  <div
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>

    <div
      v-if="isVisible"
      class="absolute bg-black text-white px-4 py-3 text-center text-xs rounded-xl z-10 pointer-events-none transition-opacity transform -translate-x-1/2 -translate-y-1/2 max-w-[180px] break-word after:content-[''] after:absolute after:-top-3.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-8 after:border-t-transparent after:border-x-transparent after:border-b-black"
      :style="{
        opacity: `${isInit ? 0 : 1}`,
        top: `${position.y}px`,
        left: `${position.x}px`
      }"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>