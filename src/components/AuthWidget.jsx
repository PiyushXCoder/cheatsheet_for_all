import { useState, useRef, useEffect } from "react";
import { useGoogleDrive } from "../hooks/GoogleDriveContext";

export function AuthWidget() {
  const { isLoggedIn, user, authLoading, login, logout } = useGoogleDrive();
  const [menuOpen, setMenuOpen] = useState(false);
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

  if (!isLoggedIn) {
    return (
      <button
        className="auth-btn"
        onClick={login}
        disabled={authLoading}
        aria-busy={authLoading}
      >
        {authLoading ? (
          <>
            <span className="auth-spinner" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </button>
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
