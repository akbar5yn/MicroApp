<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";

import SocialIcons from "./SocialIcons.vue";
import WorkStatus from "./WorkStatus.vue";
import SectionNavigation from "../navigation/SectionNavigation.vue";
import ThemeToggle from "../navigation/ThemeToggle.vue";

const props = defineProps<{
  activeSection: string;
}>();

const emit = defineEmits<{
  "select-section": [sectionId: string];
}>();

const lastMaintained = ref<string | null>(null);

const selectSection = (sectionId: string) => {
  emit("select-section", sectionId);
};

const activeSectionLabel = computed(() => {
  const labels: Record<string, string> = {
    about: "About Me",
    experience: "Experience",
    projects: "Project",
  };

  return labels[props.activeSection] ?? "About Me";
});

let abortController: AbortController | null = null;

onMounted(async () => {
  abortController = new AbortController();

  try {
    const response = await fetch(
      "https://api.github.com/repos/akbar5yn/my-porto/commits?per_page=1",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal: abortController.signal,
      },
    );

    if (!response.ok) {
      throw new Error("Unable to fetch repository updates");
    }

    const commits: Array<{
      commit?: {
        author?: {
          date?: string;
        };
      };
    }> = await response.json();

    const latestCommitDate = commits[0]?.commit?.author?.date;

    if (!latestCommitDate) return;

    lastMaintained.value = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(latestCommitDate));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    // Ignore GitHub API errors.
  }
});

onUnmounted(() => {
  abortController?.abort();
});
</script>

<template>
  <div id="profile-section" class="profile-section">
    <!-- ========================= -->
    <!-- IDENTITY -->
    <!-- ========================= -->

    <section id="identity-visual" class="identity-visual">
      <div id="social-links" class="social-links">
        <SocialIcons />
      </div>

      <div id="identity-tools" class="identity-tools">
        <div id="maintenance-meta" class="maintenance-meta">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 7.5V6a2 2 0 0 0-2-2h-1" />
            <path d="M3 7.5V6a2 2 0 0 1 2-2h1" />
            <path d="M21 16.5V18a2 2 0 0 1-2 2h-1" />
            <path d="M3 16.5V18a2 2 0 0 0 2 2h1" />
            <path d="M8 4h8" />
            <path d="M8 20h8" />
            <path d="M12 8v4l2 2" />
            <circle cx="12" cy="12" r="8" />
          </svg>

          <span>
            {{ lastMaintained ? `Last maintained · ${lastMaintained}` : "Checking latest update" }}
          </span>
        </div>

        <ThemeToggle />
      </div>

      <div id="identity-copy" class="identity-copy" aria-label="Profile identity">
        <div id="profile-name" class="identity-name">Akbar Pratama Suryamin</div>

        <div id="profile-role" class="identity-role">Software Engineer</div>

        <!-- <WorkStatus /> -->

        <p id="profile-description" class="identity-description">
          Developing responsive and intuitive web applications using modern technologies to deliver
          an optimal user experience.
        </p>
      </div>
    </section>

    <!-- ========================= -->
    <!-- NAVIGATION -->
    <!-- ========================= -->

    <section id="navigation-visual" class="section-2">
      <SectionNavigation
        :active-section="activeSection"
        :active-section-label="activeSectionLabel"
        @select-section="selectSection"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
.profile-section {
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;

  overflow: hidden;
  border-radius: 1rem 0;

  .identity-visual {
    position: relative;

    display: flex;
    flex: 1;
    flex-direction: column;

    min-height: 23.75rem;

    overflow: hidden;

    padding: 4.5rem 1.5rem 1.5rem;

    border-radius: 1rem 1rem 0 0;

    background-color: var(--color-surface);

    background-image:
      linear-gradient(
        to right,
        color-mix(in srgb, var(--color-line) 8%, transparent) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        color-mix(in srgb, var(--color-line) 8%, transparent) 1px,
        transparent 1px
      );

    background-size: 32px 32px;

    &::after {
      content: "";

      position: absolute;

      width: 14rem;
      height: 14rem;

      right: -5rem;
      bottom: -5rem;

      border: 1px solid color-mix(in srgb, var(--color-line) 20%, transparent);

      border-radius: 999px;

      box-shadow:
        0 0 0 2rem color-mix(in srgb, var(--color-line) 4%, transparent),
        0 0 0 4rem color-mix(in srgb, var(--color-line) 3%, transparent);

      pointer-events: none;
    }
  }

  .social-links {
    position: absolute;

    top: -1px;
    left: -1px;

    z-index: 50;
  }

  .identity-tools {
    position: absolute;

    top: 1rem;
    right: 1.25rem;

    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: flex-end;

    gap: 0.75rem;
  }

  .maintenance-meta {
    display: flex;
    align-items: center;

    gap: 0.5rem;

    font-size: 10px;
    font-weight: 700;

    text-transform: uppercase;
    letter-spacing: 0.12em;

    color: var(--color-muted);
  }

  .identity-copy {
    position: relative;
    z-index: 10;

    display: flex;
    flex-direction: column;

    justify-content: center;

    gap: 0.75rem;

    /*
     * Push identity toward the bottom
     * without using !important.
     */
    margin-top: auto;

    .identity-name {
      max-width: 100%;

      /*
       * Mobile first.
       */
      font-size: 3rem;
      font-weight: 900;

      line-height: 1.1;

      letter-spacing: -0.055em;

      /*
       * Frosted / translucent text.
       */
      color: transparent;

      -webkit-text-fill-color: transparent;

      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--color-text) 88%, transparent),
        color-mix(in srgb, var(--color-text) 42%, transparent)
      );

      -webkit-background-clip: text;
      background-clip: text;

      text-shadow:
        0 1px 0 color-mix(in srgb, var(--color-text) 18%, transparent),
        0 8px 24px color-mix(in srgb, var(--color-text) 6%, transparent);
    }

    .identity-role {
      width: fit-content;

      padding: 0.4rem 0.7rem;

      border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);

      border-radius: 999px;

      background: color-mix(in srgb, var(--color-surface) 45%, transparent);

      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);

      font-size: 0.7rem;
      font-weight: 700;

      line-height: 1;

      letter-spacing: 0.16em;

      text-transform: uppercase;

      color: color-mix(in srgb, var(--color-text) 65%, transparent);

      box-shadow: inset 0 1px 0 color-mix(in srgb, white 25%, transparent);
    }

    .identity-description {
      max-width: 34rem;

      margin: 0;

      font-size: 0.875rem;

      line-height: 1.7;

      color: color-mix(in srgb, var(--color-text) 52%, transparent);
    }

    /*
     * Tablet
     */
    @media (min-width: 768px) {
      .identity-name {
        font-size: 4rem;
      }
    }

    /*
     * Desktop
     */
    @media (min-width: 1280px) {
      .identity-name {
        font-size: 5.4rem;
      }
    }
  }

  .section-2 {
    position: relative;

    z-index: 20;

    width: 100%;

    box-sizing: border-box;

    padding: 1.25rem;

    border: 1px solid var(--color-border);

    border-radius: 1rem;

    background: var(--color-surface);

    box-shadow: var(--shadow);
  }

  /*
   * Tablet+
   */
  @media (min-width: 768px) {
    .identity-visual {
      padding: 5.5rem 2rem 2rem;
    }

    .identity-tools {
      right: 1.75rem;
    }
  }

  /*
   * Large desktop
   */
  @media (min-width: 1280px) {
    .identity-visual {
      min-height: 26.25rem;
    }
  }
}
</style>
