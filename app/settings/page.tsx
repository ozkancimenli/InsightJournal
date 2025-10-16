"use client";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, useAuth } from "@clerk/nextjs";
import { Button, Card } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function SettingsPage() {
  const { t } = useI18n() as any;
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
      <h1 className="text-2xl font-semibold">{t('settingsTitle')}</h1>
      <SignedOut>
        <Card className="p-6 text-center">
          <p className="mb-2">{t('signInToManage')}</p>
          <SignInButton>
            <Button>{t('btnSignIn')}</Button>
          </SignInButton>
        </Card>
      </SignedOut>
      <SignedIn>
        <Card className="p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">{t('dataExport')}</div>
            <div className="text-sm">{t('dataExportDesc')}</div>
            <div className="mt-2"><Button onClick={onExport} disabled={!isLoaded || !userId || downloading}>Export JSON</Button></div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{t('dataImport')}</div>
            <div className="text-sm">{t('dataImportDesc')}</div>
            <div className="mt-2">
              <input type="file" accept="application/json" onChange={(e) => e.target.files && e.target.files[0] && onImport(e.target.files[0])} />
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">{t('deleteAccount')}</div>
            <div className="text-sm">{t('deleteAccountDesc')}</div>
            <div className="mt-2"><Button variant="outline" onClick={onDeleteAccount}>{t('deleteAccount')}</Button></div>
          </div>
        </Card>
      </SignedIn>
    </main>
  );
}


