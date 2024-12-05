import { useState } from "react";


export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); 
  const [isError, setIsError] = useState(false); 
  const API_BASE = process.env.REACT_APP_API_BASE;

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      setMessage('Registration successful! Please Login to continue.');
      setIsError(false);
    } else {
      setMessage('Registration failed. Please try again.');
      setIsError(true);
    }
  }
  
  return (
    <form className="register" onSubmit={register}>
      <h1>Start sharing your emotions...</h1>
      <img src="../favicon.ico" alt="logo" />
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
        required
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
        required
      />
      
      {message && (
        <p style={{
          marginTop: '10px',
          color: isError ? 'red' : 'green',
          fontSize: '14px',
        }}>
          {message}
        </p>
      )}
      <button>Register</button>

    </form>
  );
}
