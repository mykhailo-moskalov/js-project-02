const button = document.querySelectorAll('button');

button.addEventListener('click', () => {
  button.forEach(btn => {
    btn.blur();
  });
});
