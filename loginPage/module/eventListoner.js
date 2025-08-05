export function addToggleEventListeners({
  toggleLoginBtn,
  toggleRegisterBtn,
  loginFormEl,
  registerFormEl,
  formTitleEl,
}) {
  toggleLoginBtn.addEventListener("click", () => {
    toggleLoginBtn.classList.add("active");
    toggleRegisterBtn.classList.remove("active");
    formTitleEl.textContent = "Login";
    loginFormEl.classList.remove("hidden");
    registerFormEl.classList.add("hidden");
  });

  toggleRegisterBtn.addEventListener("click", () => {
    toggleRegisterBtn.classList.add("active");
    toggleLoginBtn.classList.remove("active");
    formTitleEl.textContent = "Register";
    registerFormEl.classList.remove("hidden");
    loginFormEl.classList.add("hidden");
  });
}
