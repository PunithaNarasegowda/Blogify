import { Link } from 'react-router-dom';

const PostCard = ({ post, owned = false, onEdit, onDelete, variant = 'default' }) => {
  const isFeatured = variant === 'featured';

  return (
    <article className={`post-card${isFeatured ? ' post-card--featured' : ''}`}>
      <div className="post-card__image-wrap">
        <Link to={`/posts/${post._id}`} className="post-image-link">
          <img src={post.coverImage} alt={post.title} className="post-image" />
        </Link>
      </div>
      <div className="post-card__body">
        <div className="post-card__meta">
          <span className="article-kicker">{post.category || 'Feature story'}</span>
          <span className="read-time">{post.readTime || '4 min read'}</span>
        </div>
        <p className="meta-line">
          {post.author?.name || 'Editorial desk'} · {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h3>{post.title}</h3>
        <p className="excerpt">{post.excerpt}</p>
        <div className="post-card__footer">
          <Link to={`/posts/${post._id}`} className="text-link">
            Read the story
          </Link>
          {owned && (
            <div className="inline-actions">
              <button type="button" className="ghost-button" onClick={onEdit}>
                Edit
              </button>
              <button type="button" className="danger-button" onClick={onDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
