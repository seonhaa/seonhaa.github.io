import { addToggleEventListeners } from './module/eventListeners.js';
import { register, login } from './module/api.js';

document.addEventListener("DOMContentLoaded", () => {
  const toggleLoginBtn = document.getElementById("toggleLogin");
  const toggleRegisterBtn = document.getElementById("toggleRegister");
  const loginFormEl = document.getElementById("loginForm");
  const registerFormEl = document.getElementById("registerForm");
  const formTitleEl = document.getElementById("formTitle");

  // 안전 가드: 필수 엘리먼트 확인
  if (!loginFormEl || !registerFormEl) {
    console.error("폼 요소를 찾을 수 없습니다.");
    return;
  }

  // 토글 버튼 이벤트 연결
  addToggleEventListeners({
    toggleLoginBtn,
    toggleRegisterBtn,
    loginFormEl,
    registerFormEl,
    formTitleEl
  });

  // 공용 헬퍼: 폼 로딩 토글
  function setFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = isLoading;
    const inputs = form.querySelectorAll('input, button, select, textarea');
    inputs.forEach(el => {
      if (el !== submitBtn) el.disabled = isLoading;
    });
    form.classList.toggle('opacity-60', isLoading);
    form.classList.toggle('pointer-events-none', isLoading);
  }

  // 로그인 폼 제출
  loginFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = loginFormEl.querySelector('input[name="userName"]')?.value.trim() || "";
    const userPw   = loginFormEl.querySelector('input[name="userPw"]')?.value.trim() || "";
    if (!userName || !userPw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setFormLoading(loginFormEl, true);
      await login(userName, userPw); // api.js 내부에서 에러 핸들링/리다이렉트
    } finally {
      setFormLoading(loginFormEl, false);
    }
  });

  // 회원가입 폼 제출
  registerFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = registerFormEl.querySelector('input[name="userName"]')?.value.trim() || "";
    const userPw   = registerFormEl.querySelector('input[name="userPw"]')?.value.trim() || "";
    if (!userName || !userPw) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setFormLoading(registerFormEl, true);
      // api.register: 성공 시 /resources에는 username만 저장, 비번은 서버에서 해시 저장
      await register(userName, userPw, () => toggleLoginBtn?.click());
    } finally {
      setFormLoading(registerFormEl, false);
    }
  });
});
