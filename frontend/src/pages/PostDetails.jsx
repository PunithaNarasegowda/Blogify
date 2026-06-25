import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPost = async () => {
      try {
        const [{ data: currentPost }, { data: allPosts }] = await Promise.all([api.get(`/posts/${id}`), api.get('/posts')]);
        setPost(currentPost);
        setRelatedPosts(allPosts.filter((item) => item._id !== id).slice(0, 4));
      } catch (requestError) {
        setError('Unable to load this article right now.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const readTime = post
    ? `${Math.max(3, Math.round(`${post.title} ${post.excerpt} ${post.content}`.split(/\s+/).filter(Boolean).length / 220))} min read`
    : '4 min read';

  if (loading) {
    return <div className="surface empty-state">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="surface empty-state">{error || 'Post not found.'}</div>;
  }

  const canEdit = user && post.author?._id === user.id;
  const canDelete = canEdit;

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) {
      return;
    }

    await api.delete(`/posts/${id}`);
    navigate('/dashboard');
  };

  return (
    <article className="surface detail-layout">
      <div>
        <Link to="/" className="pill" style={{ marginBottom: '16px' }}>
          Back to stories
        </Link>
        <img className="detail-image" src={post.coverImage} alt={post.title} />
        <div className="detail-copy">
          <div className="post-card__meta">
            <span className="article-kicker">{post.category || 'Feature story'}</span>
            <span className="read-time">{readTime}</span>
          </div>
          <p className="meta-line">
            {post.author?.name || 'Unknown'} · {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <h1>{post.title}</h1>
          <p className="detail-excerpt">{post.excerpt}</p>
          <p className="detail-content">{post.content}</p>
          {canEdit ? (
            <div className="inline-actions">
              <Link to={`/posts/${post._id}/edit`} className="primary-button inline-button">
                Edit post
              </Link>
              {canDelete ? (
                <button type="button" className="danger-button inline-button" onClick={handleDelete}>
                  Delete post
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <aside className="detail-sidebar">
        <article className="surface detail-meta">
          <p className="eyebrow">Article details</p>
          <div>
            <strong>{post.category || 'Essays'}</strong>
            <p>{readTime}</p>
          </div>
          <div>
            <span className="meta-line">Published</span>
            <p>{new Date(post.createdAt).toLocaleDateString()}</p>
          </div>
        </article>

        <article className="surface detail-author">
          <p className="eyebrow">Author highlight</p>
          <strong>{post.author?.name || 'Editorial contributor'}</strong>
          <p>
            A story-first profile with room for strong ideas, polished pacing, and a reader-friendly experience.
          </p>
        </article>

        <article className="surface detail-related">
          <p className="eyebrow">More to read</p>
          <div className="recommended-list">
            {relatedPosts.length ? relatedPosts.map((relatedPost) => (
              <div key={relatedPost._id} className="recommended-item">
                <div>
                  <Link to={`/posts/${relatedPost._id}`}>{relatedPost.title}</Link>
                  <small>{relatedPost.excerpt}</small>
                </div>
                <span className="pill">Read</span>
              </div>
            )) : <p>No additional articles yet.</p>}
          </div>
        </article>
      </aside>
    </article>
  );
};

export default PostDetails;
