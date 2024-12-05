import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE;

  async function createNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    ev.preventDefault();

    const response = await fetch(`${API_BASE}/post`, {
      method: 'POST',
      body: data,
      credentials: 'include',
    });

    const result = await response.json();

    if (response.ok) {

      setRedirect(true);
    } else {
      console.error('Error creating post:', result);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
        required
      />
      <input
        type="text"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
        required
      />
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
        required
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}
