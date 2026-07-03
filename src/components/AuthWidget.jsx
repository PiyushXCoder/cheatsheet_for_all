import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";

export function AuthWidget() {
  const { isLoggedIn, user, authLoading, renderSignIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const signInRef = useRef(null);

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

  // Mount Google's official sign-in button while signed out (and not mid-auth).
  useEffect(() => {
    if (!isLoggedIn && !authLoading && signInRef.current) {
      renderSignIn(signInRef.current);
    }
  }, [isLoggedIn, authLoading, renderSignIn]);

  if (!isLoggedIn) {
    if (authLoading) {
      return (
        <button className="auth-btn" disabled aria-busy="true">
          <span className="auth-spinner" aria-hidden="true" />
          Signing in…
        </button>
      );
    }
    return <div className="gsi-host" ref={signInRef} />;
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
