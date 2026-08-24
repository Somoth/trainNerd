"use client";

import { type CSSProperties, useState, useTransition } from "react";
import { markRideDone } from "@/app/rides/actions";
import { trainTypeColor, trainTypeLabel } from "@/lib/trainType";
import { formatPlannedDate } from "@/lib/format";
import type { PlannedRide } from "@/db/rides";

const STARS = [1, 2, 3, 4, 5];

export function RideCard({ ride }: { ride: PlannedRide }) {
  const [rating, setRating] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const tabColor = ride.trainNumber ? trainTypeColor(ride.trainNumber) : "var(--steel-blue)";

  function handleMarkDone() {
    if (rating < 1) {
      setError("Rate it first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await markRideDone(ride.id, rating);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <article className="ticket" style={{ "--tab-color": tabColor } as CSSProperties}>
      <div className="ticket-tab" />
      <div className="ticket-body">
        <div className="ticket-main">
          {ride.trainNumber && (
            <span className="ticket-category">{trainTypeLabel(ride.trainNumber)}</span>
          )}
          <span className="ticket-class">{ride.route}</span>
          {ride.trainNumber && <span className="ticket-route">{ride.trainNumber}</span>}
          {ride.operator && <span className="ticket-operator">{ride.operator}</span>}
          {ride.note && <span className="ticket-note">{ride.note}</span>}

          {ride.isDone ? (
            <div className="ride-rating" aria-label={`Rated ${ride.rating} out of 5`}>
              {STARS.map((n) => (
                <span key={n} className={n <= (ride.rating ?? 0) ? "star star-on" : "star"}>
                  ★
                </span>
              ))}
            </div>
          ) : (
            <div className="ride-rate-row">
              <div className="ride-rating" role="radiogroup" aria-label="Rate this ride">
                {STARS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={n === rating}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className={n <= rating ? "star star-on" : "star"}
                    onClick={() => setRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button
                className="btn-ghost ride-done-btn"
                type="button"
                onClick={handleMarkDone}
                disabled={pending}
              >
                {pending ? "Saving…" : "Mark as ridden"}
              </button>
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="ticket-meta">{formatPlannedDate(ride.plannedDate)}</div>
      </div>
      <span className="stamp">{ride.isDone ? "RIDDEN" : "PLANNED"}</span>
    </article>
  );
}
