// api.js

const API_BASE = "https://api.web3.io.kr/Aether/resources";

// === 리소스 저장 함수 ===
// 회원가입 정보(username, password)를 /resources에 POST
export async function saveResource(userName, userPw) {
  try {
    const res = await fetch(API_BASE, {
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
export async function register(userName, userPw) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });

    // 서버가 빈 본문을 줄 수도 있으니 방어적으로 파싱
    let data = null;
    try { data = await res.json(); } catch (_) {}

    if (!res.ok) {
      throw new Error((data && data.message) || "회원가입 실패");
    }

    await saveResource(userName, userPw);

    alert("회원가입 성공! 이제 로그인 해주세요.");

// 여기서 DOM 다시 찾아서 클릭 실행
    const toggleLoginBtn = document.getElementById("toggleLogin");
    if (toggleLoginBtn) {
      toggleLoginBtn.click();
    }
  } catch (err) {
    console.error("회원가입 오류:", err);
    alert(`회원가입 오류: ${err.message}`);
  }
}

// === 로그인 함수 ===
export async function login(userName, userPw) {
  try {
    const res = await fetch(`${API_BASE}/login`, {
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
    // 로그인 성공 시 대시보드 등 보호된 페이지로 리다이렉트
    window.location.href = "../AI-newsletter/index.html";
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(`로그인 오류: ${err.message}`);
  }
}
