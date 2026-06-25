import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form);
    if (result.ok) {
      navigate('/dashboard');
      return;
    }
    setError(result.message);
  };

  return (
    <div className="auth-shell">
      <section className="surface auth-intro">
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.78)' }}>
          Welcome back
        </p>
        <h1>Step into your editorial workspace.</h1>
        <p>
          Sign in to manage your stories, review the latest audience interest, and keep your publishing cadence polished.
        </p>
        <div className="benefit-list">
          <div className="benefit-item">
            <strong>Reading-first dashboard</strong>
          </div>
          <div className="benefit-item">
            <strong>Secure publishing controls</strong>
          </div>
          <div className="benefit-item">
            <strong>Editorial-grade presentation</strong>
          </div>
        </div>
      </section>
      <form className="surface auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            required
          />
        </label>
        {error ? <p className="error-banner">{error}</p> : null}
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="switch-text">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
