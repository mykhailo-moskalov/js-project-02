export function showLoader() {
  document.querySelector('.loader').classList.remove('hidden');
}

export function hideLoader() {
  document.querySelector('.loader').classList.add('hidden');
}
