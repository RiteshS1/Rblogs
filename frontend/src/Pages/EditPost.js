import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const API_BASE = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    fetch(`${API_BASE}/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Post not found');
        }
        return response.json();
      })
      .then((postInfo) => {
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      })
      .catch((error) => console.error('Error fetching post:', error));
  }, [id, API_BASE]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);

    if (files?.[0]) {
      data.set('file', files[0]);
    }

    try {
      const response = await fetch(`${API_BASE}/post`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.error('Error updating post:', await response.text());
      }
    } catch (error) {
      console.error('Update request failed:', error);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Update Post</button>
    </form>
  );
}
