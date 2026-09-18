<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import ProfileSection from "./components/profile/ProfileSection.vue";
import AboutSection from "./components/about/AboutSection.vue";
import ExperienceSection from "./components/experience/ExperienceSection.vue";
import ProjectsSection from "./components/projects/ProjectsSection.vue";

const activeSection = ref("about");

const sectionIds = ["about", "experience", "projects"] as const;

let observer: IntersectionObserver | null = null;

const scrollToSection = (sectionId: string) => {
  const target = document.getElementById(sectionId);

  if (!target) return;

  activeSection.value = sectionId;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

onMounted(() => {
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  if (!sections.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      const active = visibleSections[0];

      if (!active) return;

      activeSection.value = active.target.id;
    },
    {
      root: document.getElementById("main-scroll"),
      threshold: [0.2, 0.5, 0.75],
    },
  );

  sections.forEach((section) => {
    observer?.observe(section);
  });
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <main class="home">
    <div id="app-layout" class="layout">
      <!-- ========================= -->
      <!-- PROFILE / LEFT COLUMN -->
      <!-- ========================= -->

      <div id="profile-column" class="profile-column">
        <ProfileSection :active-section="activeSection" @select-section="scrollToSection" />
      </div>

      <!-- ========================= -->
      <!-- MAIN CONTENT / RIGHT -->
      <!-- ========================= -->

      <div id="main-content" class="main-content">
        <div id="main-scroll" class="main-scroll">
          <section id="about" class="portfolio-section">
            <AboutSection />
          </section>

          <section id="experience" class="portfolio-section">
            <ExperienceSection />
          </section>

          <section id="projects" class="portfolio-section">
            <ProjectsSection />
          </section>
        </div>

        <div class="main-content-blur main-content-blur-top" aria-hidden="true" />

        <div class="main-content-blur main-content-blur-bottom" aria-hidden="true" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.layout {
  width: 100%;
  max-width: 1536px;
  margin-inline: auto;

  display: grid;
  grid-template-columns: 40% minmax(0, 1fr);
  align-items: stretch;

  gap: 2.5rem;

  box-sizing: border-box;

  /*
   * Parent punya tinggi viewport.
   */
  height: calc(100dvh - 4rem);

  padding: 2.5rem;

  overflow: hidden;
}

.profile-column,
.main-content {
  /*
   * Keduanya memenuhi tinggi .layout.
   */
  height: 100%;
  min-height: 0;
}

/*
 * LEFT
 */
.profile-column {
  width: 100%;

  display: flex;

  align-self: stretch;

  min-width: 0;
}

/*
 * RIGHT
 */
.main-content {
  position: relative;

  width: 100%;
  min-width: 0;

  align-self: stretch;

  overflow: hidden;
}

.main-scroll {
  width: 100%;
  height: 100%;

  min-height: 0;

  overflow-x: hidden;
  overflow-y: auto;

  scroll-behavior: smooth;
}

.portfolio-section {
  width: 100%;
}

/*
 * MOBILE
 */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;

    align-items: start;

    gap: 1.125rem;

    /*
     * Mobile tidak dipaksa full viewport.
     */
    height: auto;
    min-height: 0;

    padding: 2rem 1.25rem 1.5rem;

    overflow: visible;
  }

  .profile-column,
  .main-content {
    height: auto;
    min-height: 0;
  }

  .profile-column {
    display: block;
  }

  .main-content {
    overflow: visible;
  }

  .main-scroll {
    height: auto;

    overflow: visible;
  }
}
</style>
