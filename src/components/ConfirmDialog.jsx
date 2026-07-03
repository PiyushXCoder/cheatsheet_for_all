import { useCallback, useEffect, useState } from "react";

// Promise-based replacement for window.confirm / window.alert, rendered as an
// in-app modal. Usage:
//   const { dialog, confirm, alert } = useDialog();
//   if (await confirm({ message, confirmLabel, danger })) { ... }
//   await alert({ message });
//   return (<>...{dialog}</>);
export function useDialog() {
  const [state, setState] = useState(null);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        const o = typeof opts === "string" ? { message: opts } : opts;
        setState({
          confirmLabel: "Confirm",
          cancelLabel: "Cancel",
          alertOnly: false,
          ...o,
          resolve,
        });
      }),
    [],
  );

  const alert = useCallback(
    (opts) =>
      new Promise((resolve) => {
        const o = typeof opts === "string" ? { message: opts } : opts;
        setState({ confirmLabel: "OK", alertOnly: true, ...o, resolve });
      }),
    [],
  );

  const finish = useCallback(
    (result) => {
      setState((s) => {
        s?.resolve(result);
        return null;
      });
    },
    [],
  );

  const dialog = state ? (
    <Modal state={state} onConfirm={() => finish(true)} onCancel={() => finish(false)} />
  ) : null;

  return { dialog, confirm, alert };
}

function Modal({ state, onConfirm, onCancel }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
      else if (e.key === "Enter") onConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onConfirm, onCancel]);

  return (
    <div className="modal-backdrop" onMouseDown={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {state.title && <h2 className="modal-title">{state.title}</h2>}
        <p className="modal-message">{state.message}</p>
        <div className="modal-actions">
          {!state.alertOnly && (
            <button className="modal-btn" onClick={onCancel}>
              {state.cancelLabel}
            </button>
          )}
          <button
            className={"modal-btn modal-btn-primary" + (state.danger ? " danger" : "")}
            onClick={onConfirm}
            autoFocus
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
