'use client';

import dynamic from 'next/dynamic';

/**
 * Client boundary for the 3D scene.
 *
 * Next 15 forbids `ssr: false` inside a Server Component, so the dynamic
 * import has to live behind a 'use client' file. This also guarantees
 * three.js never enters the server bundle.
 */
const TyreScene = dynamic(() => import('./TyreScene'), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden="true" />,
});

export default function TyreSceneClient({ className }: { className?: string }) {
  return <TyreScene className={className} />;
}
