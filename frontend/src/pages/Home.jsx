import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

const editorialCategories = ['Essays', 'Interviews', 'Culture', 'Craft', 'Opinion', 'Guides'];

const categoryMatchers = [
  { label: 'Essays', terms: ['essay', 'reflection', 'think', 'mind', 'meaning'] },
  { label: 'Interviews', terms: ['interview', 'conversation', 'talk', 'profile'] },
  { label: 'Culture', terms: ['culture', 'city', 'music', 'film', 'art', 'book'] },
  { label: 'Craft', terms: ['craft', 'write', 'writing', 'process', 'editor', 'draft'] },
  { label: 'Opinion', terms: ['why', 'should', 'opinion', 'take', 'case'] },
  { label: 'Guides', terms: ['guide', 'how', 'tips', 'learn', 'start'] }
];

const categoryForPost = (post, index) => {
  const haystack = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
  const matched = categoryMatchers.find((candidate) => candidate.terms.some((term) => haystack.includes(term)));
  return matched?.label || editorialCategories[index % editorialCategories.length];
};

const readTimeForPost = (post) => {
  const words = `${post.title} ${post.excerpt} ${post.content}`.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.round(words / 220))} min read`;
};

const heroMetrics = (posts) => [
  { label: 'Published stories', value: posts.length.toString().padStart(2, '0') },
  { label: 'Latest focus', value: posts[0]?.category || 'Feature' },
  { label: 'Reading time', value: posts[0]?.readTime || '4 min' }
];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const editorialPosts = useMemo(() => {
    return [...posts]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .map((post, index) => ({
        ...post,
        category: categoryForPost(post, index),
        readTime: readTimeForPost(post)
      }));
  }, [posts]);

  const categories = useMemo(() => {
    const values = Array.from(new Set(editorialPosts.map((post) => post.category)));
    return ['All', ...values];
  }, [editorialPosts]);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return editorialPosts.filter((post) => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesQuery = !normalizedQuery || `${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, editorialPosts, query]);

  const featuredPost = filteredPosts[0];
  const spotlightPosts = filteredPosts.slice(1, 4);
  const latestPosts = filteredPosts.slice(0, 6);
  const trendingPosts = editorialPosts.slice(0, 4);
  const authors = useMemo(() => {
    const seen = new Map();
    editorialPosts.forEach((post) => {
      const authorId = post.author?._id || post.author?.name || post.author || post._id;
      if (!seen.has(authorId)) {
        seen.set(authorId, {
          id: authorId,
          name: post.author?.name || 'Editorial Contributor',
          bio: `${post.category} perspective`,
          cover: post.coverImage
        });
      }
    });
    return Array.from(seen.values()).slice(0, 4);
  }, [editorialPosts]);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Delete this post?');
    if (!confirmed) {
      return;
    }

    await api.delete(`/posts/${postId}`);
    setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="stack-large">
      <section className="hero surface">
        <div>
          <p className="eyebrow">Editorial publishing platform</p>
          <h1>Stories with a magazine-grade reading experience.</h1>
          <p className="hero-copy">
            A premium space for writers, readers, and creators to discover featured essays, trending articles, and thoughtful commentary.
          </p>
          <div className="hero-actions">
            <Link to={user ? '/posts/new' : '/register'} className="primary-button">
              {user ? 'Publish a story' : 'Join the publishing desk'}
            </Link>
            <Link to="#featured-posts" className="secondary-button">
              Explore featured reads
            </Link>
          </div>
          <div className="dashboard-stats" style={{ marginTop: '24px' }}>
            {heroMetrics(editorialPosts).map((metric) => (
              <div className="dashboard-stat" key={metric.label}>
                <span className="eyebrow" style={{ marginBottom: 0 }}>
                  {metric.label}
                </span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-panel">
          <img
            className="hero-panel-image"
            src={featuredPost?.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'}
            alt={featuredPost?.title || 'Featured editorial reading space'}
          />
          <div className="hero-panel-content">
            <p className="hero-panel-kicker">Featured reading</p>
            <strong>{featuredPost?.title || 'A curated space for exceptional stories.'}</strong>
            <p className="hero-copy" style={{ color: 'rgba(255,255,255,0.82)' }}>
              {featuredPost?.excerpt || 'Explore the latest pieces, discover new voices, and follow the stories shaping the conversation.'}
            </p>
            <div className="hero-stats">
              <div>
                <span>Category</span>
                <strong>{featuredPost?.category || 'Essays'}</strong>
              </div>
              <div>
                <span>Read time</span>
                <strong>{featuredPost?.readTime || '4 min'}</strong>
              </div>
              <div>
                <span>Focus</span>
                <strong>Long-form</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface page-banner">
        <p className="eyebrow">Discover the archive</p>
        <h1>Featured posts, trending voices, and recommendations for the next read.</h1>
        <p>
          Search by keyword, narrow by editorial category, and move through the site like a modern publishing desk instead of a generic feed.
        </p>
        <div className="search-bar">
          <input
            type="search"
            placeholder="Search articles, authors, themes, and ideas"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <span className="pill">{filteredPosts.length} stories</span>
        </div>
        <div className="chip-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`chip${activeCategory === category ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section id="featured-posts" className="section-shell">
        <div className="section-header">
          <h2>Featured Posts</h2>
          <p>{loading ? 'Loading featured stories...' : `${filteredPosts.length} matching articles`}</p>
        </div>
        {loading ? (
          <div className="surface empty-state">Loading content...</div>
        ) : filteredPosts.length ? (
          <div className="editorial-grid">
            <div className="posts-grid featured-grid">
              {featuredPost ? (
                <PostCard
                  post={featuredPost}
                  owned={user && featuredPost.author?._id === user.id}
                  onEdit={null}
                  onDelete={user && featuredPost.author?._id === user.id ? () => handleDelete(featuredPost._id) : null}
                  variant="featured"
                />
              ) : null}
              <div className="posts-grid compact-grid">
                {spotlightPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    owned={user && post.author?._id === user.id}
                    onEdit={null}
                    onDelete={user && post.author?._id === user.id ? () => handleDelete(post._id) : null}
                  />
                ))}
              </div>
            </div>
            <aside className="editorial-sidebar">
              <article className="surface insight-card">
                <p className="eyebrow">Trending articles</p>
                <div className="trend-list">
                  {trendingPosts.map((post, index) => (
                    <div key={post._id} className="trend-item">
                      <div>
                        <Link to={`/posts/${post._id}`}>{post.title}</Link>
                        <p>{post.category} · {post.readTime}</p>
                      </div>
                      <span className="pill">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </article>
              <article className="surface newsletter-card">
                <p className="eyebrow">Newsletter subscription</p>
                <strong>Get weekly reading picks in your inbox.</strong>
                <p className="newsletter-note">
                  Curated essays, new voices, and standout storytelling delivered with the same editorial tone as the site.
                </p>
                <form>
                  <input type="email" placeholder="Email address" aria-label="Email address" />
                  <button type="button" className="primary-button">
                    Subscribe
                  </button>
                </form>
              </article>
            </aside>
          </div>
        ) : (
          <div className="surface empty-state">No matching posts. Try a different topic or category.</div>
        )}
      </section>

      <section className="section-shell">
        <div className="section-header">
          <h2>Latest Blogs</h2>
          <p>Fresh additions from the archive</p>
        </div>
        {latestPosts.length ? (
          <div className="posts-grid">
            {latestPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                owned={user && post.author?._id === user.id}
                onEdit={null}
                onDelete={user && post.author?._id === user.id ? () => handleDelete(post._id) : null}
              />
            ))}
          </div>
        ) : (
          <div className="surface empty-state">No posts yet. Create the first story for the archive.</div>
        )}
      </section>

      <section className="editorial-grid">
        <article className="surface content-block">
          <div className="section-header" style={{ padding: 0 }}>
            <h2>Recommended Reads</h2>
            <p>Editorial hand-picked from the current archive</p>
          </div>
          <div className="recommended-list">
            {editorialPosts.slice(0, 4).map((post) => (
              <div key={post._id} className="recommended-item">
                <div>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                  <p>{post.category} · {post.readTime}</p>
                </div>
                <span className="pill">Read</span>
              </div>
            ))}
          </div>
        </article>

        <div className="editorial-sidebar">
          <article className="surface author-card">
            <p className="eyebrow">Author spotlights</p>
            <div className="author-grid">
              {authors.length ? authors.map((author, index) => (
                <div key={author.id} className="author-row">
                  <div>
                    <strong>{author.name}</strong>
                    <span>{author.bio}</span>
                  </div>
                  <img className="avatar" src={author.cover} alt={author.name} />
                </div>
              )) : <p>No authors yet.</p>}
            </div>
          </article>

          <article className="surface summary-card">
            <p className="eyebrow">Popular categories</p>
            <strong>Browse the archive by editorial lens.</strong>
            <div className="chip-row">
              {categories.filter((category) => category !== 'All').slice(0, 5).map((category) => (
                <span key={category} className="chip">
                  {category}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
