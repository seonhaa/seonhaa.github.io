// eventListoner.js

// eventListeners.js

export function addToggleEventListeners({
  toggleLoginBtn,
  toggleRegisterBtn,
  loginFormEl,
  registerFormEl,
  formTitleEl
}) {
  // 로그인 버튼 클릭 이벤트
  toggleLoginBtn.addEventListener("click", () => {
    toggleLoginBtn.classList.add("active");
    toggleRegisterBtn.classList.remove("active");
    formTitleEl.textContent = "Login";
    loginFormEl.classList.remove("hidden");
    registerFormEl.classList.add("hidden");
  });

  // 회원가입 버튼 클릭 이벤트
  toggleRegisterBtn.addEventListener("click", () => {
    toggleRegisterBtn.classList.add("active");
    toggleLoginBtn.classList.remove("active");
    formTitleEl.textContent = "Register";
    registerFormEl.classList.remove("hidden");
    loginFormEl.classList.add("hidden");
  });
}
