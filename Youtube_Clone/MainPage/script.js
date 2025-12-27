// ====== 사이드바 더보기/간략히 ======
function toggleMoreMenu() {
  const moreSearch = document.querySelector("#moreSearch");
  if (!moreSearch) return;
  moreSearch.classList.toggle("active");
}
// ==============================

function isMobileView() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

// backdrop 화면 터치시 사이드바 닫힘
function openMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (!sidebar || !backdrop) return;

  sidebar.classList.add("is-open");
  backdrop.classList.add("active");
  document.body.classList.add("sidebar-lock");
}

function closeMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (!sidebar || !backdrop) return;

  sidebar.classList.remove("is-open");
  backdrop.classList.remove("active");
  document.body.classList.remove("sidebar-lock");
}

// ====== 햄버거 버튼 ======
function toggleHidden() {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  if (isMobileView()) {
    // 모바일/태블릿: 오버레이 열기/닫기
    const isOpen = sidebar.classList.contains("is-open");
    if (isOpen) closeMobileSidebar();
    else openMobileSidebar();
  } else {
    // 데스크톱: 접기/펼치기
    sidebar.classList.toggle("collapsed");
  }
}

// ====== backdrop 클릭 시 닫기 ======
document.addEventListener("DOMContentLoaded", () => {
  const backdrop = document.querySelector(".sidebar-backdrop");
  if (backdrop) backdrop.addEventListener("click", closeMobileSidebar);

  // 모바일 시작 시 닫힌 상태 보장
  if (isMobileView()) closeMobileSidebar();
});

// ====== ESC로 닫기(모바일) ======
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMobileView()) {
    closeMobileSidebar();
  }
});

// ====== 리사이즈 시 상태 정리 ======
window.addEventListener("resize", () => {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // 데스크톱으로 넘어가면 모바일 오버레이 상태 제거
  if (!isMobileView()) {
    closeMobileSidebar();
  } else {
    // 모바일에서 데스크톱 collapsed 흔적 제거(원하면 유지해도 됨)
    sidebar.classList.remove("collapsed");
  }
});
