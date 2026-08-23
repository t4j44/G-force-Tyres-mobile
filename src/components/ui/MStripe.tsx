import { cn } from '@/lib/utils';

/** The brand signature element. Use above section headings. */
export default function MStripe({ className }: { className?: string }) {
  return (
    <div className={cn('m-stripe', className)} aria-hidden="true">
      <span /><span /><span />
    </div>
  );
}
