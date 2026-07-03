import { useEffect } from "react";
import { useAuth } from "../hooks/AuthContext";

// Bottom-right transient notification for sync/auth errors, so failures are
// visible in the UI and not only in the console.
export function Toast() {
  const { notice, dismissNotice } = useAuth();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(dismissNotice, 7000);
    return () => clearTimeout(t);
  }, [notice, dismissNotice]);

  if (!notice) return null;

  return (
    <div className={"toast toast-" + notice.type} role="alert">
      <span className="toast-msg">{notice.message}</span>
      <button className="toast-close" onClick={dismissNotice} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
