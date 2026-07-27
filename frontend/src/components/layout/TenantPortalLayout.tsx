import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useTenantAuth } from '@/hooks/useTenantAuth';

export function TenantPortalLayout() {
  const { tenant, logout } = useTenantAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper texture-grid">
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link to="/tenant-portal" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 text-white">
              <Building2 className="size-4" />
            </span>
            <span className="font-display text-base font-semibold text-ink">Tenant Portal</span>
          </Link>
          <div className="flex items-center gap-3">
            {tenant && <span className="hidden text-sm text-ink-soft sm:block">{tenant.fullName}</span>}
            <button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-ink-soft transition hover:bg-paper-dim hover:text-crimson-600"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => { logout(); setConfirmOpen(false); }}
        title="Sign out?"
        description="You'll need to log in again to access your tenant portal."
        confirmLabel="Sign out"
      />
    </div>
  );
}
