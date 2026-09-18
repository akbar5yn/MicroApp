<template>
  <div id="work-status" class="identity-status">
    <span class="identity-status-dot" aria-hidden="true" />

    <span id="work-status-copy">
      <strong> Currently working at Alfamart </strong>

      <small> PT Global Loyalty Indonesia </small>
    </span>
  </div>
</template>

<style scoped>
.identity-status {
  display: flex;
  align-items: center;

  gap: 0.5rem;
}

.identity-status-dot {
  width: 0.5rem;
  height: 0.5rem;

  flex: 0 0 auto;

  border-radius: 999px;

  background: currentColor;
}

#work-status-copy {
  display: flex;
  flex-direction: column;
}

#work-status-copy strong {
  font-weight: 700;
}

#work-status-copy small {
  font-size: 0.75rem;

  color: var(--color-muted);
}
</style>
