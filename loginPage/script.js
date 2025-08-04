// script.js
const API_BASE = "https://api.web3.io.kr/Aether/test/auth";

// 토글 요소 가져오기
const toggleLoginBtn = document.getElementById("toggleLogin");
const toggleRegisterBtn = document.getElementById("toggleRegister");
const loginFormEl = document.getElementById("loginForm");
const registerFormEl = document.getElementById("registerForm");
const formTitleEl = document.getElementById("formTitle");

// 토글 클릭 이벤트
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

// 회원가입 함수
async function register(userName, userPw) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "회원가입 실패");
    alert("회원가입 성공! 이제 로그인 해주세요.");
    // 자동으로 로그인 폼으로 전환
    toggleLoginBtn.click();
  } catch (err) {
    console.error(err);
    alert(`회원가입 오류: ${err.message}`);
  }
}

// 로그인 함수
async function login(userName, userPw) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "로그인 실패");
    localStorage.setItem("token", data.token);
    alert("로그인 성공!");
    // 로그인 후 페이지 이동 예:
    // window.location.href = '/dashboard.html';
  } catch (err) {
    console.error(err);
    alert(`로그인 오류: ${err.message}`);
  }
}

// 폼 제출 이벤트 바인딩
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
