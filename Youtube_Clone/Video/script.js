function toggleDarkMode() {
  const changedarkmode = document.querySelector("#darkMode");
  const body = document.body;

  changedarkmode.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
  });
}
