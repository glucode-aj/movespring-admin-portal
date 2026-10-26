import React, { useState } from 'react';
import { ArrowIcon, AuthLayout, BrandMark, EyeIcon } from './authshared';

interface SignUpScreenProps {
  onNavigateToSignIn?: () => void;
  onSuccessRegister?: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigateToSignIn,
  onSuccessRegister,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSuccessRegister) {
      onSuccessRegister();
    } else {
      alert(`Mock Registration Submitted for ${firstName || 'Mandlakazi'} at ${companyName || 'Glucode'}`);
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
            <button type="button" className="ms-pill-btn" onClick={onNavigateToSignIn}>
              Sign in
            </button>
            <button type="button" className="ms-pill-btn ms-active">
              Create account
            </button>
          </div>
        </div>

        <div className="ms-narrow ms-formwrap">
          <div className="ms-eyebrow">01 / ACCESS</div>
          <h1 className="ms-title">Welcome</h1>
          <p className="ms-sub ms-tight">Let’s get you all set up.</p>

          <form onSubmit={handleSubmit}>
            <div className="ms-stack-sm">
              <div className="ms-grid-names">
                <div>
                  <label htmlFor="firstName" className="ms-label">
                    First name
                  </label>
                  <div className="ms-field ms-field-name">
                    <input
                      id="firstName"
                      type="text"
                      className="ms-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Mandlakazi"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="ms-label">
                    Last name
                  </label>
                  <div className="ms-field ms-field-name">
                    <input
                      id="lastName"
                      type="text"
                      className="ms-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Zulu"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="ms-label">
                  Company name
                </label>
                <div className="ms-field">
                  <input
                    id="companyName"
                    type="text"
                    className="ms-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Glucode"
                  />
                </div>
              </div>

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

            <label className="ms-checklabel ms-terms" style={{ fontSize: 11 }}>
              <input
                type="checkbox"
                className="ms-check"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="ms-muted">
                I agree to the <span className="ms-strong">Terms</span> and{' '}
                <span className="ms-strong">Privacy Policy</span>
              </span>
            </label>

            <button type="submit" className="ms-cta ms-cta-tight">
              <span>Join interface</span>
              <ArrowIcon />
            </button>
          </form>
        </div>

        <button
          type="button"
          className="ms-help"
          aria-label="Help"
          onClick={() => alert('Need assistance onboarding? Contact support@movespring.com')}
        >
          ?
        </button>
      </div>
    </AuthLayout>
  );
};

export default SignUpScreen;