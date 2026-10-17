// The control that opened the booking sheet, so focus can go back to it when the sheet closes.
// Captured before navigating: once the page goes inert, the browser has already dropped focus.
let opener: HTMLElement | null = null

export function rememberOpener() {
  opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
}

export function restoreOpener() {
  opener?.focus()
  opener = null
}
