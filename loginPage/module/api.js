const API_BASE = "https://api.web3.io.kr/Aether/resources";

// === 리소스 저장 함수 ===
// 비밀번호는 절대 보내지 않음
export async function saveResource(userName) {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName }), // ← pw 제거
    });

    // 서버가 빈 본문을 줄 수 있으니 방어적 파싱
    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      throw new Error((data && data.message) || "리소스 저장 실패");
    }
    console.log("리소스 저장 성공:", data);
  } catch (err) {
    console.error("리소스 저장 오류:", err);
    alert(`경고: 리소스 저장 중 오류 발생 (${err.message})`);
  }
}

// === 회원가입 함수 ===
// onSuccess: 선택 콜백 (예: 로그인 탭으로 전환)
export async function register(userName, userPw, onSuccess) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      throw new Error((data && data.message) || "회원가입 실패");
    }

    // 비밀번호는 저장 금지. username만 기록(필요 시)
    await saveResource(userName);

    alert("회원가입 성공! 이제 로그인 해주세요.");

    // 1) 콜백이 넘어오면 사용
    if (typeof onSuccess === "function") {
      onSuccess();
      return;
    }
    // 2) 콜백이 없으면 버튼 찾아 클릭(안전 폴백)
    const toggleLoginBtn = document.getElementById("toggleLogin");
    if (toggleLoginBtn) toggleLoginBtn.click();
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

    let data = null;
    try { data = await res.json(); } catch {}

    if (!res.ok) {
      throw new Error((data && data.message) || "로그인 실패");
    }

    if (data && data.token) {
      localStorage.setItem("token", data.token);
    }
    alert("로그인 성공!");
    window.location.href = "../AI-Toeic/index.html";
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(`로그인 오류: ${err.message}`);
  }
}
