import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { useHistory } from '@docusaurus/router';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'Basic',
    password: ''
  });
  const [error, setError] = useState('');
  const history = useHistory();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Signup failed');
      }

      // On success, redirect to login
      history.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout title="Sign Up" description="Create an account">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h2>Sign Up</h2>
              </div>
              <div className="card__body">
                {error && <div className="alert alert--danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="margin-bottom--sm">
                    <label>Name</label>
                    <input name="name" type="text" className="button button--block button--outline button--secondary" style={{ textAlign: 'left', cursor: 'text' }} required onChange={handleChange} />
                  </div>
                  <div className="margin-bottom--sm">
                    <label>Email</label>
                    <input name="email" type="email" className="button button--block button--outline button--secondary" style={{ textAlign: 'left', cursor: 'text' }} required onChange={handleChange} />
                  </div>
                  <div className="margin-bottom--sm">
                    <label>Phone</label>
                    <input name="phone" type="tel" className="button button--block button--outline button--secondary" style={{ textAlign: 'left', cursor: 'text' }} required onChange={handleChange} />
                  </div>
                  <div className="margin-bottom--sm">
                    <label>Programming Experience</label>
                    <select name="experience" className="button button--block button--outline button--secondary" style={{ textAlign: 'left' }} onChange={handleChange}>
                      <option value="Basic">Basic</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="margin-bottom--md">
                    <label>Password</label>
                    <input name="password" type="password" className="button button--block button--outline button--secondary" style={{ textAlign: 'left', cursor: 'text' }} required onChange={handleChange} />
                  </div>
                  <button type="submit" className="button button--primary button--block">
                    Sign Up
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
