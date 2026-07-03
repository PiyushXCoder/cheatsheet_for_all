import { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";

export function AuthWidget() {
  const { isLoggedIn, user, authLoading, renderSignIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const menuRef = useRef(null);
  const gsiRef = useRef(null);

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

  // Close the modal once signed in.
  useEffect(() => {
    if (isLoggedIn) setSignInOpen(false);
  }, [isLoggedIn]);

  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!signInOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSignInOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [signInOpen]);

  // Mount Google's button inside the modal when it opens.
  useEffect(() => {
    if (signInOpen && !authLoading && gsiRef.current) {
      renderSignIn(gsiRef.current);
    }
  }, [signInOpen, authLoading, renderSignIn]);

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
                {authLoading ? (
                  <span className="auth-btn" aria-busy="true">
                    <span className="auth-spinner" aria-hidden="true" />
                    Signing in…
                  </span>
                ) : (
                  <div className="gsi-host" ref={gsiRef} />
                )}
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
