"use client";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { Button, Card } from "@/components/ui";

export default function SettingsPage() {
  const [downloading, setDownloading] = useState(false);
  const { isLoaded, userId } = useAuth();

  async function onExport() {
    setDownloading(true);
    try {
      const res = await fetch("/api/entries?limit=1000", { headers: { 'Cache-Control': 'no-store' } });
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'insight-journal-export.json'; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function onImport(file: File) {
    const text = await file.text();
    let json: unknown;
    try { json = JSON.parse(text); } catch { alert('Invalid JSON'); return; }
    const res = await fetch('/api/entries/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) });
    if (!res.ok) { alert('Import failed'); return; }
    alert('Import completed');
  }

  async function onDeleteAccount() {
    alert("Account delete is not implemented yet. Contact support.");
  }

  return (
    <main className="container-max py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <SignedOut>
        <Card className="p-6 text-center">
          <p className="mb-2">Sign in to manage your settings.</p>
          <SignInButton>
            <Button>Sign in</Button>
          </SignInButton>
        </Card>
      </SignedOut>
      <SignedIn>
        <Card className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Export your data</div>
            <div className="text-sm">Download your journal entries as JSON.</div>
            <div className="mt-2"><Button onClick={onExport} disabled={!isLoaded || !userId || downloading}>Export JSON</Button></div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Import your data</div>
            <div className="text-sm">Upload a JSON file of entries to import.</div>
            <div className="mt-2">
              <input type="file" accept="application/json" onChange={(e) => e.target.files && e.target.files[0] && onImport(e.target.files[0])} />
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Delete account</div>
            <div className="text-sm">This will permanently remove your data. (Not yet implemented)</div>
            <div className="mt-2"><Button variant="outline" onClick={onDeleteAccount}>Delete account</Button></div>
          </div>
        </Card>
      </SignedIn>
    </main>
  );
}


