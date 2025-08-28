const input = document.querySelector("#newtask input");
const tasks = document.querySelector("#tasks");

document.querySelector("#push").onclick = function () {
  if (!input.value.trim()) {
    alert("Please Enter a Task");
    return;
  }

  tasks.innerHTML += `
    <div class="task">
      <span class="taskname">${input.value.trim()}</span>
      <button class="delete">
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  `;
  input.value = "";
};

// 삭제: 이벤트 위임
tasks.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete");
  if (btn) btn.parentNode.remove();
});
