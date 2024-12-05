import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, content, createdAt, author }) {
  const S3_BUCKET_URL = process.env.REACT_APP_S3_BUCKET_URL;

  
  const normalizedCover = cover.replace(/\\/g, "/");

  const imageUrl = normalizedCover.startsWith("https://") 
    ? normalizedCover  
    : `${S3_BUCKET_URL}${normalizedCover}`;  

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
          
          <img src={imageUrl} alt="Post cover" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a href="/" className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
}
