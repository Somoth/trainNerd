"use client";

import { useRef, useState, useTransition } from "react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { logSighting } from "@/app/actions";

export function LogSightingForm() {
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await logSighting(formData);
        formRef.current?.reset();
        setOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {isSignedIn ? (
        <button className="btn" type="button" onClick={() => setOpen(true)}>
          + Log a sighting
        </button>
      ) : (
        <SignInButton mode="modal">
          <button className="btn" type="button">
            Sign in to log a sighting
          </button>
        </SignInButton>
      )}

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 className="modal-title">Log a sighting</h2>
              <button
                className="modal-close"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="modal-form">
              <div className="field-row">
                <label className="field">
                  <span>Date</span>
                  <input type="date" name="date" required />
                </label>
                <label className="field">
                  <span>Time</span>
                  <input type="time" name="time" required />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>Station</span>
                  <input name="station" placeholder="Frankfurt Hbf" required />
                </label>
                <label className="field">
                  <span>Country</span>
                  <input name="country" placeholder="Germany" />
                </label>
              </div>

              <div className="field-row">
                <label className="field">
                  <span>Train number</span>
                  <input name="trainNumber" placeholder="ICE 73" required />
                </label>
                <label className="field">
                  <span>Operator</span>
                  <input name="operator" placeholder="DB" />
                </label>
              </div>

              <label className="field">
                <span>Route</span>
                <input name="route" placeholder="Frankfurt–Vienna" />
              </label>

              <label className="field">
                <span>Note</span>
                <input name="note" placeholder="Livery, delay, anything worth remembering" />
              </label>

              <div className="checkbox-group">
                <label className="checkbox">
                  <input type="checkbox" name="favourite" />
                  <span>Favourite</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" name="firstTime" />
                  <span>First time seen</span>
                </label>
                <label className="checkbox">
                  <input type="checkbox" name="rare" />
                  <span>Rare sighting</span>
                </label>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button className="btn btn-submit" type="submit" disabled={pending}>
                {pending ? "Logging…" : "Log sighting"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
