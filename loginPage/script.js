// script.js
// main.js

import { addToggleEventListeners } from './eventListeners.js';
import { saveResource,register,login } from './api.js';

// DOM 요소 가져오기
const toggleLoginBtn = document.getElementById("toggleLogin");
const toggleRegisterBtn = document.getElementById("toggleRegister");
const loginFormEl = document.getElementById("loginForm");
const registerFormEl = document.getElementById("registerForm");
const formTitleEl = document.getElementById("formTitle");

// 이벤트 리스너 초기화
addToggleEventListeners({
  toggleLoginBtn,
  toggleRegisterBtn,
  loginFormEl,
  registerFormEl,
  formTitleEl
});

saveResource();
register();
login();

// === 폼 제출 이벤트 바인딩 ===
document.addEventListener("DOMContentLoaded", () => {
  loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = loginFormEl.userName.value.trim();
    const userPw = loginFormEl.userPw.value.trim();
    login(userName, userPw);
  });

  registerFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = registerFormEl.userName.value.trim();
    const userPw = registerFormEl.userPw.value.trim();
    register(userName, userPw);
  });
});
