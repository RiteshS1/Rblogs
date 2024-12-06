import Post from "../Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  const API_BASE = process.env.REACT_APP_API_BASE;
  useEffect(() => {
    fetch(`${API_BASE}/post`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
    
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}

      <footer className="footer">
        <h3>Made with 💖 by <a href="https://github.com/RiteshS1" >RS</a></h3>
      </footer>
    </>
  );
}
