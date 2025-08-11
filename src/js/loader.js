export function showLoader(selector) {
  document.querySelector(selector).classList.remove('hidden');
}
export function hideLoader(selector) {
  document.querySelector(selector).classList.add('hidden');
}
