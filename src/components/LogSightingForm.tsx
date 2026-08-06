"use client";

import { useRef, useState, useTransition } from "react";
import { logSighting } from "@/app/actions";

export function LogSightingForm() {
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

  return (
    <>
      <button className="btn" type="button" onClick={() => setOpen(true)}>
        + Log a sighting
      </button>

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

              <div className="field-row">
                <label className="field">
                  <span>Origin</span>
                  <input name="origin" placeholder="Frankfurt Hbf" />
                </label>
                <label className="field">
                  <span>Destination</span>
                  <input name="destination" placeholder="Wien Hbf" />
                </label>
              </div>

              <label className="field">
                <span>Note</span>
                <input name="note" placeholder="Livery, delay, anything worth remembering" />
              </label>

              <label className="field">
                <span>Miles travelled</span>
                <input type="number" name="miles" min="0" placeholder="0" />
              </label>

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
