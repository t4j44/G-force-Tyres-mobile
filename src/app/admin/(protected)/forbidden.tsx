import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';

export default function AdminForbidden() {
  return (
    <div className="container-g section max-w-md text-center">
      <MStripe className="mb-6 mx-auto" />
      <ShieldX className="mx-auto mb-4 text-danger" size={40} aria-hidden="true" />
      <h1 className="display-2">ACCESS DENIED</h1>
      <p className="mt-3 text-sm text-ink-2">
        This account is not authorized for the G Force operations console.
      </p>
      <Link href="/admin/login" className="btn btn-secondary mt-6">
        Return to sign in
      </Link>
    </div>
  );
}
