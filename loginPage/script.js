// script.js
const API_BASE = "https://api.web3.io.kr/Aether/test";
const AUTH_BASE = `${API_BASE}/auth`;
const RESOURCE_URL = `${API_BASE}/resources`;

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

// === 리소스 저장 함수 ===
// 회원가입 정보(username, password)를 /resources에 POST
async function saveResource(userName, userPw) {
  try {
    const res = await fetch(RESOURCE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "리소스 저장 실패");
    }
    console.log("리소스 저장 성공:", data);
  } catch (err) {
    console.error("리소스 저장 오류:", err);
    // 리소스 저장 실패해도 사용자 흐름엔 지장 없도록 알림만 남겨두었습니다.
    alert(`경고: 리소스 저장 중 오류 발생 (${err.message})`);
  }
}

// === 회원가입 함수 ===
async function register(userName, userPw) {
  try {
    // 1) 인증 서버에 회원가입 요청
    const res = await fetch(`${AUTH_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "회원가입 실패");
    }

    // 2) 회원가입 성공 시 /resources에도 정보 저장
    await saveResource(userName, userPw);

    alert("회원가입 성공! 이제 로그인 해주세요.");
    // 자동으로 로그인 폼으로 전환
    toggleLoginBtn.click();
  } catch (err) {
    console.error("회원가입 오류:", err);
    alert(`회원가입 오류: ${err.message}`);
  }
}

// === 로그인 함수 ===
async function login(userName, userPw) {
  try {
    const res = await fetch(`${AUTH_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "로그인 실패");
    }

    // JWT 토큰이 data.token에 담겨 온다고 가정
    localStorage.setItem("token", data.token);
    alert("로그인 성공!");
    // 필요 시 대시보드 등 보호된 페이지로 리다이렉트
    // window.location.href = "/dashboard.html";
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(`로그인 오류: ${err.message}`);
  }
}

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
