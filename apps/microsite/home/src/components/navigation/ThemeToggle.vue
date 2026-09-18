<script setup lang="ts">
import { ref, onMounted } from "vue";

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;

  document.documentElement.classList.toggle("dark", isDark.value);
};

onMounted(() => {
  isDark.value = document.documentElement.classList.contains("dark");
});
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    {{ isDark ? "Light" : "Dark" }}
  </button>
</template>
