<script setup lang="ts">
import { Github, Linkedin, Instagram } from "lucide-vue-next";

const socialLinks = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/akbar5yn",
    icon: Github,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/akbar5yn/",
    icon: Linkedin,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/akbar_syn/",
    icon: Instagram,
  },
];
</script>

<template>
  <nav class="social-icons" aria-label="Social links">
    <a
      v-for="social in socialLinks"
      :key="social.id"
      :href="social.href"
      :aria-label="social.label"
      target="_blank"
      rel="noopener noreferrer"
      class="social-links"
    >
      <component :is="social.icon" :size="18" :stroke-width="1.8" />
    </a>
  </nav>
</template>

<style scoped lang="scss">
.social-icons {
  position: relative;
  z-index: 30;

  display: flex;
  align-items: center;
  gap: 12px;

  width: max-content;
  padding: 12px 14px 14px 12px;

  color: var(--color-text);
  background: var(--color-page);

  border-right: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  border-bottom-right-radius: 18px;

  box-shadow: 8px 8px 18px color-mix(in srgb, var(--color-line) 7%, transparent);

  a {
    position: relative;
    z-index: 1;
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    color: var(--color-text);
    border-radius: 8px;
    transition:
      transform 0.25s ease,
      color 0.25s ease,
      background-color 0.25s ease;

    &:hover {
      color: var(--color-inverse);
      background: var(--color-strong);
      transform: translateY(-3px);
    }
  }

  &::before,
  &::after {
    content: "";
    position: absolute;

    pointer-events: none;
    background: transparent;
  }

  &::before {
    width: 20px;
    height: 30px;
    top: 1px;
    right: -20px;

    border-top-left-radius: 18px;
    box-shadow: -10px -20px 0 10px var(--color-page);
  }

  &::after {
    width: 20px;
    height: 30px;
    bottom: -30px;
    left: 1px;

    border-top-left-radius: 18px;
    box-shadow: -10px -20px 0 10px var(--color-page);
  }
}
</style>
