const API_BASE_DELETE = "https://api.web3.io.kr/Aether/resources";

async function deleteResource(id) {
  try {
    const url = `${API_BASE_DELETE}/${id}`;
    // console.log(url);
    const res = await fetch(url, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `리소스 삭제 실패: ${res.status}`);
    }
    console.log(`리소스(id=${id}) 삭제 성공`);
  } catch (err) {
    console.error("deleteResource 오류:", err);
    throw err;
  }
}

// api 정보
deleteResource("689415cd50e1542a818bcf3e")
  .then(() => {
    // UI 업데이트: 목록에서 해당 항목 제거 등
  })
  .catch((err) => {
    alert("삭제 중 오류가 발생했습니다: " + err.message);
  });
