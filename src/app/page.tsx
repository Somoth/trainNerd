import type { CSSProperties } from "react";
import { FlapBoard } from "@/components/FlapBoard";
import { LogSightingForm } from "@/components/LogSightingForm";
import { getSightings, getStats } from "@/db/queries";
import { trainTypeColor, trainTypeLabel } from "@/lib/trainType";
import { formatSpottedAt } from "@/lib/format";

export default async function Home() {
  const [sightings, stats] = await Promise.all([getSightings(), getStats()]);

  return (
    <div className="page">
      <section className="hero">
        <FlapBoard word="TRAINNERD" />
        <p className="hero-sub">
          a life-list for trackside obsessives — every class, every platform, logged.
        </p>
        <div className="glow-rule" />
        <LogSightingForm />
      </section>

      <section className="log-section">
        <div className="section-head">
          <span className="eyebrow">the log</span>
          <h2 className="section-title">Recent sightings</h2>
          <p className="section-desc">Logged trackside, newest first.</p>
        </div>

        {sightings.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No sightings yet.</p>
            <p className="empty-desc">Be the first to log one.</p>
          </div>
        ) : (
          <div className="ledger">
            {sightings.map((s) => (
              <article
                key={s.id}
                className="ticket"
                style={{ "--tab-color": trainTypeColor(s.trainNumber) } as CSSProperties}
              >
                <div className="ticket-tab" />
                <div className="ticket-body">
                  <div className="ticket-main">
                    <span className="ticket-category">{trainTypeLabel(s.trainNumber)}</span>
                    <span className="ticket-class">{s.trainNumber}</span>
                    {(s.origin || s.destination) && (
                      <span className="ticket-route">
                        {s.origin ?? "?"} → {s.destination ?? "?"}
                      </span>
                    )}
                    {s.operator && <span className="ticket-operator">{s.operator}</span>}
                    {s.note && <span className="ticket-note">{s.note}</span>}
                  </div>
                  <div className="ticket-meta">
                    {s.station}
                    {s.country ? `, ${s.country}` : ""}
                    <br />
                    {formatSpottedAt(s.spottedAt)}
                  </div>
                </div>
                <span className="stamp">SPOTTED</span>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="stats">
        <div className="stat">
          <span className="stat-num">{stats.trainsSpotted}</span>
          <span className="stat-label">Trains spotted</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.stationsVisited}</span>
          <span className="stat-label">Stations visited</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.milesLogged.toLocaleString("en-GB")}</span>
          <span className="stat-label">Miles logged</span>
        </div>
      </section>

      <footer className="footer">
        <span className="footer-line">trainNerd — a running list, updated trackside.</span>
      </footer>
    </div>
  );
}
