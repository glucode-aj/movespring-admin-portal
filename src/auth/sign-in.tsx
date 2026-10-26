import React, { useState } from 'react';
import { ArrowIcon, AuthLayout, BrandMark, EyeIcon } from './authshared';

interface SignInScreenProps {
  onNavigateToSignUp?: () => void;
  onSuccessLogin?: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigateToSignUp,
  onSuccessLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccessLogin) {
      onSuccessLogin();
    } else {
      alert('Mock Login Submitted for: ' + (email || 'admin@glucode.com'));
    }
  };

  return (
    <AuthLayout>

      <div className="ms-left">
        <BrandMark />
      </div>

      <div className="ms-right">
        <div className="ms-narrow">
          <div className="ms-pill">
            <button type="button" className="ms-pill-btn ms-active">
              Sign in
            </button>
            <button type="button" className="ms-pill-btn" onClick={onNavigateToSignUp}>
              Create account
            </button>
          </div>
        </div>

        <div className="ms-narrow ms-formwrap">
          <div className="ms-eyebrow">01 / ACCESS</div>
          <h1 className="ms-title">Welcome back</h1>
          <p className="ms-sub">Let’s pick up where you left off.</p>

          <form onSubmit={handleSubmit}>
            <div className="ms-stack-lg">
              <div>
                <label htmlFor="email" className="ms-label">
                  Email (organization)
                </label>
                <div className="ms-field">
                  <input
                    id="email"
                    type="email"
                    className="ms-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mandlakazi@glucode.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="ms-label">
                  Password
                </label>
                <div className="ms-field">
                  <div className="ms-pwbox">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className="ms-input ms-pw"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      className="ms-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon off={showPassword} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="ms-row">
              <label className="ms-checklabel">
                <input
                  type="checkbox"
                  className="ms-check"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ms-muted">Remember me</span>
              </label>
              <button type="button" className="ms-link" onClick={() => alert('Forgot password clicked')}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="ms-cta">
              <span>Launch interface</span>
              <ArrowIcon />
            </button>
          </form>
        </div>

        <button
          type="button"
          className="ms-help"
          aria-label="Help"
          onClick={() => alert('Need assistance? Contact support@movespring.com')}
        >
          ?
        </button>
      </div>
    </AuthLayout>
  );
};

export default SignInScreen;