export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <main className="container-max py-14">
      <h1 className="text-3xl font-semibold mb-6">Pricing</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-lg p-6">
          <div className="text-sm text-muted-foreground">Starter</div>
          <div className="text-3xl font-semibold my-2">Free</div>
          <ul className="text-sm space-y-1">
            <li>· 7-day history</li>
            <li>· Mood analysis</li>
          </ul>
        </div>
        <div className="glass rounded-lg p-6 border-2 border-blue-600">
          <div className="text-sm text-muted-foreground">Pro</div>
          <div className="text-3xl font-semibold my-2">$8<span className="text-base">/mo</span></div>
          <ul className="text-sm space-y-1">
            <li>· Unlimited history</li>
            <li>· Weekly PDF reports</li>
            <li>· AI insights</li>
          </ul>
        </div>
        <div className="glass rounded-lg p-6">
          <div className="text-sm text-muted-foreground">Team</div>
          <div className="text-3xl font-semibold my-2">Custom</div>
          <ul className="text-sm space-y-1">
            <li>· SSO</li>
            <li>· Priority support</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


