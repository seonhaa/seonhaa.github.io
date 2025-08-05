const API_BASE = "https://api.web3.io.kr/Aether/resources";

// 리소스 저장 함수
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
    alert(`경고: 리소스 저장 중 오류 발생 (${err.message})`);
  }
}

// 회원가입 함수
export async function register(userName, userPw, onSuccessToggleLogin) {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPw }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "회원가입 실패");
    }

    await saveResource(userName, userPw);
    alert("회원가입 성공! 이제 로그인 해주세요.");

    if (typeof onSuccessToggleLogin === "function") {
      onSuccessToggleLogin();
    }
  } catch (err) {
    console.error("회원가입 오류:", err);
    alert(`회원가입 오류: ${err.message}`);
  }
}

// 로그인 함수
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

    localStorage.setItem("token", data.token);
    alert("로그인 성공!");
    window.location.href = "/MemoryGame/index.html";
  } catch (err) {
    console.error("로그인 오류:", err);
    alert(`로그인 오류: ${err.message}`);
  }
}
