import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";

export function AuthWidget() {
  const { isLoggedIn, user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (isLoggedIn) setSignInOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    if (!signInOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSignInOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [signInOpen]);

  if (!isLoggedIn) {
    return (
      <>
        <button className="auth-btn" onClick={() => setSignInOpen(true)}>
          Sign in
        </button>
        {signInOpen && (
          <div className="modal-backdrop" onMouseDown={() => setSignInOpen(false)}>
            <div
              className="modal auth-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Sign in"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <h2 className="modal-title">Sign in</h2>
              <p className="modal-message">
                Sync your practice progress across your devices.
              </p>
              <div className="auth-modal-body">
                <button className="google-btn" onClick={login}>
                  <GoogleMark />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const avatarUrl = user?.picture;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="auth-menu-container" ref={menuRef}>
      <button className="auth-avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
        {avatarUrl ? (
          <img className="auth-avatar" src={avatarUrl} alt={user?.name || ""} />
        ) : (
          <span className="auth-initials">{initials}</span>
        )}
      </button>
      {menuOpen && (
        <div className="auth-menu">
          <div className="auth-menu-item auth-email">{user?.email}</div>
          <button className="auth-menu-item" onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="google-mark" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}
