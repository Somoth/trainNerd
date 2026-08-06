"use client";

import { useRef, useState, useTransition } from "react";
import { logSighting } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";

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
                  <span>Class</span>
                  <input name="locoClass" placeholder="Class 47" required />
                </label>
                <label className="field">
                  <span>Number</span>
                  <input name="locoNumber" placeholder="47.812" />
                </label>
              </div>

              <label className="field">
                <span>Category</span>
                <select name="category" defaultValue={CATEGORIES[0]} required>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Location</span>
                <input name="location" placeholder="Doncaster Works" required />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Spotted at</span>
                  <input type="datetime-local" name="spottedAt" />
                </label>
                <label className="field">
                  <span>Miles travelled</span>
                  <input type="number" name="miles" min="0" placeholder="0" />
                </label>
              </div>

              <label className="field">
                <span>Note</span>
                <input name="note" placeholder="Livery, condition, anything worth remembering" />
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
