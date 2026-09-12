export interface MicroFrontend {
  mount(container: HTMLElement): void | Promise<void>
  unmount(): void | Promise<void>
}