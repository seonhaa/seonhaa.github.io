// 리액트로 간단한 계산기 구현하기
import { React } from "react";
import { useState } from "react";

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [result, setResult] = useState("");

  return (
    <div className="App">
      {/* 제목 */}
      <header className="App-header">
        <h1>"React Calculator"</h1>
      </header>

      {/* 계산기 구현부 */}
      <div>
        <input
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="숫자1 입력"
        />{" "}
        <input
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="숫자2 입력"
        />
        {/* 버튼 클릭 시 연산 진행 */}
        <button onClick={() => setResult(Number(num1) + Number(num2))}>
          {" "}
          +{" "}
        </button>
        <button onClick={() => setResult(num1 - num2)}> - </button>
        <button onClick={() => setResult(num1 * num2)}> * </button>
        <button onClick={() => setResult(num1 / num2)}> / </button>
        {/* 결과값 */}
        <p>계산값: {result}</p>
      </div>
    </div>
  );
}

export default App;
