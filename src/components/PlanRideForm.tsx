"use client";

import { useRef, useState, useTransition } from "react";
import { addPlannedRide } from "@/app/rides/actions";

export function PlanRideForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addPlannedRide(formData);
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
        + Plan a ride
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 className="modal-title">Plan a ride</h2>
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
              <label className="field">
                <span>Route</span>
                <input name="route" placeholder="Vienna–Budapest" required />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Date</span>
                  <input type="date" name="plannedDate" required />
                </label>
                <label className="field">
                  <span>Train number</span>
                  <input name="trainNumber" placeholder="RJ 63" />
                </label>
              </div>

              <label className="field">
                <span>Operator</span>
                <input name="operator" placeholder="ÖBB" />
              </label>

              <label className="field">
                <span>Note</span>
                <input name="note" placeholder="Why this one's on the list" />
              </label>

              {error && <p className="form-error">{error}</p>}

              <button className="btn btn-submit" type="submit" disabled={pending}>
                {pending ? "Saving…" : "Add to plan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
