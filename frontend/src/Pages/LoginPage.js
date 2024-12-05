import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [message, setMessage] = useState(''); 
  const [isError, setIsError] = useState(false); 
  const { setUserInfo } = useContext(UserContext);
  const API_BASE = process.env.REACT_APP_API_BASE;

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
      setMessage('');
    } else {
      setMessage('Wrong credentials. Please try again.');
      setIsError(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="login" onSubmit={login}>
      <h1>Welcome back! 👋</h1>
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
      <button>Login</button>

    </form>
  );
}
