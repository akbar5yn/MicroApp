<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import SocialIcons from "./SocialIcons.vue";
import ThemeToggle from "../navigation/ThemeToggle.vue";

// =========================================================
// Props & Emits
// =========================================================

const props = defineProps<{
  activeSection: string;
}>();

const emit = defineEmits<{
  "select-section": [sectionId: string];
}>();

// =========================================================
// State
// =========================================================

const lastMaintained = ref<string | null>(null);

// =========================================================
// Computed
// =========================================================

const activeSectionLabel = computed(() => {
  const labels: Record<string, string> = {
    about: "About Me",
    experience: "Experience",
    projects: "Project",
  };

  return labels[props.activeSection] ?? "About Me";
});

// =========================================================
// DOM Manipulation
// =========================================================
//
// Semua state/ref yang digunakan untuk mengakses atau
// membaca DOM dikelompokkan di sini.
//
// Saat membutuhkan logic DOM tambahan seperti:
// - getBoundingClientRect()
// - offsetWidth / offsetHeight
// - ResizeObserver
// - MutationObserver
// - dynamic CSS properties
//
// Tambahkan di section ini.
//
// =========================================================

const socialLinksEl = ref<HTMLElement | null>(null);
const socialLinksHeight = ref(0);

const cardContainerEl = ref<HTMLElement | null>(null);
const cardContainerWidth = ref(0);
const cardContainerHeight = ref(0);

const cardClipPath = computed(() => {
  const width = cardContainerWidth.value;
  const height = cardContainerHeight.value;

  if (!width || !height) {
    return "path('M 0 0')";
  }

  // =======================================================
  // Card Geometry
  // =======================================================

  const radius = 20;

  return `path("
    M 0 0

    L ${width * 0.6 - radius} 0
    Q ${width * 0.6} 0 ${width * 0.6} ${radius}

    L ${width * 0.6} ${height * 0.2 - radius}
    Q ${width * 0.6} ${height * 0.2}
      ${width * 0.6 + radius} ${height * 0.2}

    L ${width - radius} ${height * 0.2}
    Q ${width} ${height * 0.2}
      ${width} ${height * 0.2 + radius}

    L ${width} ${height - radius}
    Q ${width} ${height}
      ${width + radius} ${height}

    L ${radius} ${height}
    Q 0 ${height} 0 ${height - radius}

    L 0 0
    Q 0 0 ${radius} 0
  ") `
    .replace(/\s+/g, " ")
    .trim();
});

// =========================================================
// DOM Manipulation - Resize Observer
// =========================================================

let resizeObserver: ResizeObserver | null = null;

const updateDomHeight = () => {
  socialLinksHeight.value = socialLinksEl.value?.offsetHeight ?? 0;
  cardContainerHeight.value = cardContainerEl.value?.offsetHeight ?? 0;
  cardContainerWidth.value = cardContainerEl.value?.offsetWidth ?? 0;
};

const setupResizeObserver = () => {
  const socialLinksElement = socialLinksEl.value;
  const cardContainerElement = cardContainerEl.value;

  if (!socialLinksElement && !cardContainerElement) return;

  updateDomHeight();

  resizeObserver = new ResizeObserver(() => {
    updateDomHeight();
  });

  if (socialLinksElement) {
    resizeObserver.observe(socialLinksElement);
  }

  if (cardContainerElement) {
    resizeObserver.observe(cardContainerElement);
  }
};

const cleanupResizeObserver = () => {
  resizeObserver?.disconnect();
  resizeObserver = null;
};

// =========================================================
// Business Logic - GitHub
// =========================================================

interface GitHubCommit {
  commit?: {
    author?: {
      date?: string;
    };
  };
}

const formatMaintenanceDate = (date: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const fetchLastMaintained = async (signal: AbortSignal) => {
  try {
    const response = await fetch(
      "https://api.github.com/repos/akbar5yn/my-porto/commits?per_page=1",
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const commits: GitHubCommit[] = await response.json();

    const latestCommitDate = commits[0]?.commit?.author?.date;

    if (!latestCommitDate) return;

    lastMaintained.value = formatMaintenanceDate(latestCommitDate);
  } catch (error) {
    // AbortError terjadi secara normal ketika component di-unmount.
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    console.error("Failed to fetch repository updates:", error);
  }
};

// =========================================================
// Lifecycle
// =========================================================

let abortController: AbortController | null = null;

onMounted(() => {
  // -------------------------------------------------------
  // DOM Manipulation
  // -------------------------------------------------------

  setupResizeObserver();

  // -------------------------------------------------------
  // Async Data
  // -------------------------------------------------------

  abortController = new AbortController();

  void fetchLastMaintained(abortController.signal);
});

onUnmounted(() => {
  // -------------------------------------------------------
  // DOM Manipulation Cleanup
  // -------------------------------------------------------

  cleanupResizeObserver();

  // -------------------------------------------------------
  // Async Request Cleanup
  // -------------------------------------------------------

  abortController?.abort();
  abortController = null;
});
</script>

<template>
  <div id="profile-section" class="profile-section">
    <!-- ========================= -->
    <!-- IDENTITY -->
    <!-- ========================= -->

    <div
      id="identity-container"
      class="identity-container"
      :style="{ '--social-links-height': `${socialLinksHeight}px` }"
    >
      <div id="social-links" ref="socialLinksEl" class="social-links">
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

      <main id="identity-copy" class="identity-detail" aria-label="Profile identity">
        <div id="profile-name" class="identity-name">Akbar Pratama Suryamin</div>

        <div id="profile-role" class="identity-role">Software Engineer</div>

        <!-- <WorkStatus /> -->

        <p id="profile-description" class="identity-description">
          Developing responsive and intuitive web applications using modern technologies to deliver
          an optimal user experience.
        </p>
      </main>

      <div
        id="identity-card"
        class="card-container"
        ref="cardContainerEl"
        :style="{ '--card-clip-path': cardClipPath }"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-section {
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;

  overflow: hidden;

  // =========================================================
  // Identity Container
  // =========================================================

  .identity-container {
    position: relative;

    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    // min-height: 23.75rem;

    overflow: hidden;

    background-color: var(--color-surface);
    background-size: 32px 32px;

    box-shadow: inset 2px 0 10px 10px color-mix(in srgb, var(--color-text) 7%, transparent);

    // =======================================================
    // Decorative Grid
    // =======================================================

    &::before {
      content: "";

      position: absolute;
      inset: 0;

      z-index: 0;

      pointer-events: none;

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

      mask-image: radial-gradient(ellipse at center, black 35%, transparent 90%);

      -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 90%);
    }

    // =======================================================
    // Decorative Circle
    // =======================================================

    &::after {
      content: "";

      position: absolute;

      right: -5rem;
      bottom: -5rem;

      width: 14rem;
      height: 14rem;

      pointer-events: none;

      border: 1px solid color-mix(in srgb, var(--color-line) 20%, transparent);

      border-radius: 999px;

      box-shadow:
        0 0 0 2rem color-mix(in srgb, var(--color-line) 4%, transparent),
        0 0 0 4rem color-mix(in srgb, var(--color-line) 3%, transparent);
    }

    // =======================================================
    // Social Links
    // =======================================================

    .social-links {
      position: absolute;

      top: -1px;
      left: -1px;

      z-index: 50;
    }

    // =======================================================
    // Identity Tools
    // =======================================================

    .identity-tools {
      position: absolute;

      top: 1rem;
      right: 1.25rem;

      z-index: 10;

      display: flex;
      flex-direction: column;
      align-items: flex-end;

      gap: 0.75rem;

      .maintenance-meta {
        display: flex;
        align-items: center;

        gap: 0.5rem;

        font-size: 10px;
        font-weight: 700;

        letter-spacing: 0.12em;
        text-transform: uppercase;

        color: var(--color-muted);
      }
    }

    // =======================================================
    // Identity Detail
    // =======================================================

    .identity-detail {
      position: relative;

      z-index: 10;

      display: flex;
      flex-direction: column;

      justify-content: center;

      gap: 0.75rem;

      margin-top: var(--social-links-height, 0);
      padding: 25px;

      // -----------------------------------------------------
      // Identity Name
      // -----------------------------------------------------

      .identity-name {
        max-width: 100%;

        font-size: 3rem;
        font-weight: 900;

        line-height: 1.1;

        letter-spacing: -0.055em;

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

      // -----------------------------------------------------
      // Identity Role
      // -----------------------------------------------------

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

      // -----------------------------------------------------
      // Identity Description
      // -----------------------------------------------------

      .identity-description {
        max-width: 34rem;

        margin: 0;

        font-size: 0.875rem;

        line-height: 1.7;

        color: color-mix(in srgb, var(--color-text) 52%, transparent);
      }

      // -----------------------------------------------------
      // Responsive
      // -----------------------------------------------------

      @media (min-width: 768px) {
        .identity-name {
          font-size: 4rem;
        }
      }

      @media (min-width: 1280px) {
        .identity-name {
          font-size: 5.4rem;
        }
      }
    }

    // =======================================================
    // Identity Card
    // =======================================================

    .card-container {
      position: relative;
      background-color: transparent;
      z-index: 20;
      width: 85%;
      height: 200px;
      filter: drop-shadow(0 0px 10px color-mix(in srgb, var(--color-text) 50%, transparent));

      &::before {
        content: "";
        top: -20px;
        position: absolute;
        inset: 0;

        background: color-mix(in srgb, var(--color-page) 60%, transparent);
        inset: 0 -20px -20px 0;

        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);

        clip-path: var(--card-clip-path);
      }
    }

    // =======================================================
    // Responsive - Identity Container
    // =======================================================

    @media (min-width: 768px) {
      .identity-tools {
        right: 1.75rem;
      }
    }

    @media (min-width: 1280px) {
      min-height: 26.25rem;
    }
  }
}
</style>
