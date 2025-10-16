"use client";

export default function PrivacyPage() {
  return (
    <main className="container-max py-14 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Overview</h2>
      <p>Insight Journal collects the minimum data necessary to provide a private journaling experience with AI‑powered insights. You own your content and can export or delete it at any time.</p>

      <h2>Data We Collect</h2>
      <ul>
        <li>Account via Clerk</li>
        <li>Journal entries and emotion metadata in Supabase</li>
        <li>Basic telemetry for reliability, no ad tracking</li>
      </ul>

      <h2>How We Use AI</h2>
      <p>We use OpenAI to analyze the emotional tone of your entries. We do not send personally identifying metadata. We do not use your data to train custom models.</p>

      <h2>Security & Storage</h2>
      <ul>
        <li>RLS so only your account can access entries</li>
        <li>HTTPS transport</li>
        <li>Restricted production access</li>
      </ul>

      <h2>Your Choices</h2>
      <ul>
        <li>Export JSON</li>
        <li>Import JSON</li>
        <li>Delete account and data</li>
      </ul>

      <h2>Contact</h2>
      <p>Questions? Contact support at support@example.com.</p>
    </main>
  );
}


