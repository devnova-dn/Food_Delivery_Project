

import { Suspense } from 'react';
import CartClient from './CartClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <CartClient />
    </Suspense>
  );
}
