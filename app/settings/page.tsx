export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="font-medium">Integrations</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-700">
          <li>Google OAuth via NextAuth</li>
          <li>Google Sheets sync enabled for spreadsheet ID: 1f11p1H19o4ey7O6t-18H1AXKYJP6YSJav9pk_JTFw8o</li>
          <li>Resend outreach with 15/day account limit</li>
        </ul>
      </div>
    </section>
  );
}
