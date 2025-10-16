export function useI18n() {
  const strings: Record<string, string> = {
    settingsTitle: "Settings",
    signInToManage: "Sign in to manage your settings.",
    btnSignIn: "Sign in",
    dataExport: "Export your data",
    dataExportDesc: "Download your journal entries as JSON.",
    dataImport: "Import your data",
    dataImportDesc: "Upload a JSON file of entries to import.",
    deleteAccount: "Delete account",
    deleteAccountDesc: "This will permanently remove your data. (Not yet implemented)",
  };

  function t(key: string): string {
    return strings[key] ?? key;
  }

  return { t };
}
