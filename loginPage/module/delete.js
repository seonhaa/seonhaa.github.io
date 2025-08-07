// delete.js

const API_BASE = "https://api.web3.io.kr/Aether/resources";
/**
 * 주어진 리소스 ID를 삭제합니다.
 * @param {string|number} id 삭제할 리소스의 고유 ID
 */
export async function deleteResource(id) {
  try {
    const url = `${API_BASE}/${id}`;
    const res = await fetch(url, {
      method: "DELETE"
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