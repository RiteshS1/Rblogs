import {Link} from "react-router-dom";
import {useContext, useState, useEffect} from "react";
import {UserContext} from "./UserContext";

export default function Header() {
  const {setUserInfo,userInfo} = useContext(UserContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;
  useEffect(() => {
    fetch(`${API_BASE}/profile`, {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);  
  

  function logout() {
    fetch(`${API_BASE}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }
  
  const username = userInfo?.username;

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode); 
  };

  return (
    <header>
      <Link to="/" className="logo">R BLOGS</Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
     
            <a href="/login" onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            
          </>
        )}
         <div class="corner">
            <a href="https://github.com/your-repo" target="_blank">
                <img src="/github.png" alt="GitHub" id="github-icon" />
            </a>
            <img
        id="mode-toggle"
        src={isDarkMode ? '/night-mode.png' : '/day-mode.png'}
        alt="mode-toggle"
        onClick={handleToggle}
        style={{ cursor: 'pointer' }}
      />
        </div>
        
      </nav>
     
      
    </header>
  );
}