import React, { useState, useContext } from 'react';
import Layout from '@theme/Layout';
import { AuthContext } from '../contexts/AuthContext';
import { useHistory, useLocation } from '@docusaurus/router';
import styles from './auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useContext(AuthContext);
  const history = useHistory();
  const location = useLocation(); // Import useLocation

  // Check for redirect message
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const msg = params.get('msg');
    if (msg) {
      setError(msg);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();

      // SHOW SUCCESS ANIMATION
      setSuccess(true);

      // Delay login & redirect
      setTimeout(() => {
        login({ name: data.access_token, email: email });
        history.push('/docs/category/front-matter?welcome=true');
      }, 1200); // Faster 1.2s delay

    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className={styles.successOverlay}>
        <div className={styles.successContent}>
          <div className={styles.checkmarkCircle}>
            <div className={styles.checkmark}></div>
          </div>
          <h2>Login Successful! 🎉</h2>
          <p>Opening the book...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout title="Login" description="Login to access the book">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h2>Login</h2>
              </div>
              <div className="card__body">
                {error && <div className="alert alert--danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="margin-bottom--md">
                    <label>Email</label>
                    <input
                      type="email"
                      className="button button--block button--outline button--secondary"
                      style={{ textAlign: 'left', cursor: 'text' }}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="margin-bottom--md">
                    <label>Password</label>
                    <input
                      type="password"
                      className="button button--block button--outline button--secondary"
                      style={{ textAlign: 'left', cursor: 'text' }}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="button button--primary button--block">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
