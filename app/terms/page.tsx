"use client";

export default function TermsPage() {
  return (
    <main className="container-max py-14 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h2>Acceptance of Terms</h2>
      <p>By accessing Insight Journal, you agree to these Terms. If you do not agree, do not use the Service.</p>

      <h2>Accounts</h2>
      <ul>
        <li>Keep your account secure</li>
        <li>We may suspend accounts that violate Terms</li>
      </ul>

      <h2>Content</h2>
      <ul>
        <li>You own your entries</li>
        <li>Limited license to process content solely to provide the Service</li>
        <li>No unlawful or abusive content</li>
      </ul>

      <h2>AI and Third‑Party Services</h2>
      <p>We use third‑party providers (e.g., OpenAI, Supabase, Clerk). Their terms may apply as relevant.</p>

      <h2>Disclaimers</h2>
      <p>The Service is provided “as is” without warranties. No medical advice.</p>

      <h2>Limitation of Liability</h2>
      <p>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.</p>

      <h2>Changes</h2>
      <p>We may update these Terms. Continued use indicates acceptance.</p>

      <h2>Contact</h2>
      <p>Questions about these Terms? Contact legal@example.com.</p>
    </main>
  );
}


