import { addToggleEventListeners } from "./module/eventListeners.js";
import { register, login } from "./module/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleLoginBtn = document.getElementById("toggleLogin");
  const toggleRegisterBtn = document.getElementById("toggleRegister");
  const loginFormEl = document.getElementById("loginForm");
  const registerFormEl = document.getElementById("registerForm");
  const formTitleEl = document.getElementById("formTitle");

  // 버튼 전환 이벤트 등록
  addToggleEventListeners({
    toggleLoginBtn,
    toggleRegisterBtn,
    loginFormEl,
    registerFormEl,
    formTitleEl,
  });

  // 로그인 폼 제출 처리
  loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = loginFormEl.userName.value.trim();
    const userPw = loginFormEl.userPw.value.trim();
    login(userName, userPw);
  });

  // 회원가입 폼 제출 처리
  registerFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = registerFormEl.userName.value.trim();
    const userPw = registerFormEl.userPw.value.trim();
    register(userName, userPw, () => toggleLoginBtn.click());
  });
});
