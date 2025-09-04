// 막대 그래프 높이 반영 (최대 5시간 → 100%)
      const MAX_HOURS = 5;
      document.querySelectorAll(".bar").forEach((bar) => {
        const val = parseFloat(bar.dataset.value || "0");
        const pct = Math.max(0, Math.min(100, (val / MAX_HOURS) * 100));
        bar.style.setProperty("--h", pct);
        bar.setAttribute("title", `${bar.dataset.day}: ${val}시간`);
      });

      // D-Day 계산: 오늘부터 30일 뒤 예시
      function updateDDay(targetDate) {
        const now = new Date();
        const diff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        const val = diff > 0 ? `D-${diff}` : diff === 0 ? "D-Day" : `D+${Math.abs(diff)}`;
        document.getElementById("dDay").textContent = val;
      }
      const target = new Date();
      target.setDate(target.getDate() + 30);
      updateDDay(target);

      // 푸시 토글 접근성 보조
      const pushToggle = document.getElementById("pushToggle");
      pushToggle.addEventListener("change", (e) => {
        e.target.setAttribute("aria-pressed", e.target.checked ? "true" : "false");
      });

      // 테마 적용: body에 data-theme 넣기
      const themeSelect = document.getElementById("themeSelect");
      function applyTheme(mode) {
        if (mode === "system") {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          document.body.dataset.theme = prefersDark ? "dark" : "light";
        } else {
          document.body.dataset.theme = mode;
        }
      }
      themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));
      applyTheme("light");