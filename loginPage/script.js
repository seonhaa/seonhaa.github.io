import { addToggleEventListeners } from './module/eventListeners.js';
import { register, login, deleteResource } from './module/api.js';

document.addEventListener("DOMContentLoaded", () => {
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

  // 로그인 폼 제출 이벤트
  loginFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = loginFormEl.userName.value.trim();
    const userPw = loginFormEl.userPw.value.trim();
    login(userName, userPw);
  });

  // 회원가입 폼 제출 이벤트
  registerFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = registerFormEl.userName.value.trim();
    const userPw = registerFormEl.userPw.value.trim();
    register(userName, userPw, () => toggleLoginBtn.click()); // 회원가입 후 로그인 탭으로 자동 전환
  });
});

// api 정보
deleteResource("689415cc50e1542a818bcf3d")
  .then(() => {
    // UI 업데이트: 목록에서 해당 항목 제거 등
  })
  .catch(err => {
    alert('삭제 중 오류가 발생했습니다: ' + err.message);
  });
