    // 페이지 진입 시 애니메이션이 잘 보이도록 카드 opacity 제어
    document.addEventListener("DOMContentLoaded", () => {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.style.opacity = 1;
      });
    });