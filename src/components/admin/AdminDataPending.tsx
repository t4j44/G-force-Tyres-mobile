import { DatabaseZap } from 'lucide-react';
import AdminNav from '@/components/admin/AdminNav';
import MStripe from '@/components/ui/MStripe';

export default function AdminDataPending({ title }: { title: string }) {
  return (
    <div className="container-g section">
      <MStripe className="mb-6" />
      <AdminNav />
      <div className="card mx-auto max-w-2xl py-12 text-center">
        <DatabaseZap className="mx-auto mb-4 text-brand" size={36} aria-hidden="true" />
        <h1 className="display-2">{title}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-2">
          The authentication and role-checking structure is implemented. Operational
          data remains unavailable until the persistent admin workflows are implemented
          and verified in Phase 3.
        </p>
      </div>
    </div>
  );
}
