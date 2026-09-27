<script setup lang="ts">
import { computed } from "vue";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";

const props = defineProps<{
  activeSection: string;
  activeSectionLabel: string;
}>();

const emit = defineEmits<{
  "select-section": [sectionId: string];
}>();

const navigationItems = [
  {
    id: "about",
    label: "About Me",
    detail: "Profile overview",
  },
  {
    id: "experience",
    label: "Experience",
    detail: "Work history",
  },
  {
    id: "projects",
    label: "Project",
    detail: "Selected work",
  },
] as const;

const moveNavigation = (direction: number) => {
  const currentIndex = navigationItems.findIndex((item) => item.id === props.activeSection);

  const nextIndex = (currentIndex + direction + navigationItems.length) % navigationItems.length;

  const nextItem = navigationItems[nextIndex];

  if (!nextItem) return;

  emit("select-section", nextItem.id);
};
const selectContent = (sectionId: string) => {
  emit("select-section", sectionId);
};
</script>

<template>
  <div id="section-navigation" class="section-navigation">
    <div id="active-section-heading">
      <p id="active-section-label" class="active-section-label">Current section</p>

      <h2 class="section-title">
        {{ activeSectionLabel }}
      </h2>
    </div>

    <div id="section-arrows" class="section-arrows">
      <button
        id="previous-section"
        type="button"
        class="carousel-arrow"
        aria-label="Previous section"
        @click="moveNavigation(-1)"
      >
        <ArrowLeft :size="18" />
      </button>

      <button
        id="next-section"
        type="button"
        class="carousel-arrow"
        aria-label="Next section"
        @click="moveNavigation(1)"
      >
        <ArrowRight :size="18" />
      </button>
    </div>
  </div>

  <div id="section-carousel" class="profile-carousel" aria-label="Content sections">
    <button
      v-for="(item, index) in navigationItems"
      :id="`section-item-${item.id}`"
      :key="item.id"
      type="button"
      class="profile-carousel-item"
      :class="{
        'is-active': activeSection === item.id,
        'is-inactive': activeSection !== item.id,
      }"
      @click="selectContent(item.id)"
    >
      <span class="carousel-index">
        {{ String(index + 1).padStart(2, "0") }}
      </span>

      <span class="carousel-label">
        {{ item.label }}
      </span>

      <span class="carousel-detail">
        {{ item.detail }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.section-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 1rem;
}

.active-section-label {
  margin: 0;

  font-size: 10px;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 0.2em;

  color: var(--color-muted);
}

.section-title {
  margin: 0.25rem 0 0;

  font-size: 1.25rem;
  font-weight: 700;
}

.section-arrows {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.profile-carousel {
  display: flex;
  flex-direction: column;

  gap: 0.25rem;

  margin-top: 1rem;
}

.profile-carousel-item {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;

  align-items: center;

  width: 100%;

  box-sizing: border-box;

  padding: 0.75rem;

  border: 0;
  border-radius: 0.5rem;

  background: transparent;

  text-align: left;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
}

.profile-carousel-item.is-active {
  background: var(--color-panel);
  opacity: 1;
}

.profile-carousel-item.is-inactive {
  opacity: 0.5;
}

.profile-carousel-item:hover {
  opacity: 1;
}

.carousel-index {
  font-size: 10px;
  font-weight: 700;

  color: var(--color-muted);
}

.carousel-label {
  font-weight: 700;
}

.carousel-detail {
  font-size: 0.75rem;

  color: var(--color-muted);
}

@media (max-width: 640px) {
  .profile-carousel-item {
    grid-template-columns: 2rem minmax(0, 1fr);
  }

  .carousel-detail {
    display: none;
  }
}
</style>
