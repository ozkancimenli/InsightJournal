export const dynamic = "force-dynamic";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
          <div className="absolute left-1/2 top-[-20%] h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        </div>
        <div className="container-max py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-4 glass">Minimal • Private • Insightful</div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Reflect better with emotional AI</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Insight Journal turns your daily notes into clear mood insights and gentle trends, so you can grow with calm.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/journal" className="px-5 py-3 rounded-md bg-blue-600 text-white">Start journaling</Link>
            <Link href="/dashboard" className="px-5 py-3 rounded-md border">View dashboard</Link>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-4 text-left">
            <div className="glass rounded-lg p-5">
              <div className="text-sm text-muted-foreground">AI Mood Analysis</div>
              <div className="mt-1 font-medium">Understand your tone in seconds</div>
              <p className="text-sm text-muted-foreground mt-2">Detect mood and emotions like calm, stressed, hopeful, bored, excited.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="text-sm text-muted-foreground">Trends that guide</div>
              <div className="mt-1 font-medium">Per-entry dots + daily averages</div>
              <p className="text-sm text-muted-foreground mt-2">See daily swings with a smooth line and min–max band.</p>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="text-sm text-muted-foreground">Own your data</div>
              <div className="mt-1 font-medium">Export and re‑import any time</div>
              <p className="text-sm text-muted-foreground mt-2">Your notes stay portable. Private by default.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-1">Write freely</h3>
            <p className="text-muted-foreground">No prompts needed. Your words → instant mood analysis.</p>
          </div>
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-1">Beautiful weekly reports</h3>
            <p className="text-muted-foreground">One‑click PDF with highlights and a motivational note.</p>
          </div>
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-1">Offline friendly</h3>
            <p className="text-muted-foreground">Add entries offline; sync when you’re back online.</p>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="container-max py-14 text-center">
        <div className="text-sm text-muted-foreground">Trusted for calmer weeks</div>
        <div className="text-2xl font-semibold mt-2">“I write more because it feels effortless.”</div>
        <p className="text-muted-foreground text-sm mt-2">Founder, solo‑dev</p>
      </section>

      {/* Final CTA */}
      <section className="container-max py-10 text-center">
        <div className="glass rounded-xl p-8">
          <h3 className="text-xl font-semibold">Start a calmer week today</h3>
          <p className="text-sm text-muted-foreground mt-1">Journal for 3 minutes, see your trend in seconds.</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link href="/journal" className="px-5 py-3 rounded-md bg-blue-600 text-white">New entry</Link>
            <Link href="/dashboard" className="px-5 py-3 rounded-md border">Open dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
}


