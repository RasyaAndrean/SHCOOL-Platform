import { useState } from 'react';

function AppMinimal() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>SHCOOL Platform - Minimal Test</h1>
      <p>If you can see this, React is working correctly!</p>
      <div>
        <button onClick={() => setCount(count + 1)}>Count is {count}</button>
      </div>
    </div>
  );
}

export default AppMinimal;
