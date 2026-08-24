import { auth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { PlanRideForm } from "@/components/PlanRideForm";
import { RideCard } from "@/components/RideCard";
import { getPlannedRides } from "@/db/rides";

export default async function RidesPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="page">
        <section className="auth-page">
          <div className="section-head" style={{ textAlign: "center", alignItems: "center" }}>
            <span className="eyebrow">your account</span>
            <h2 className="section-title">Planned rides</h2>
            <p className="section-desc">Sign in to keep your own trip list.</p>
          </div>
          <SignInButton mode="modal">
            <button className="btn">Sign in</button>
          </SignInButton>
        </section>
      </div>
    );
  }

  const rides = await getPlannedRides(userId);

  return (
    <div className="page">
      <section className="log-section">
        <div className="section-head">
          <span className="eyebrow">your account</span>
          <h2 className="section-title">Planned rides</h2>
          <p className="section-desc">Trips on the list, and the ones you&apos;ve already ridden.</p>
        </div>

        <PlanRideForm />

        {rides.length === 0 ? (
          <div className="empty-state">
            <p className="empty-title">No rides planned yet.</p>
            <p className="empty-desc">Add the next one you&apos;re hoping to catch.</p>
          </div>
        ) : (
          <div className="ledger">
            {rides.map((ride) => (
              <RideCard key={ride.id} ride={ride} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
