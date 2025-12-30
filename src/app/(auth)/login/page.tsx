
import { Suspense } from 'react';
import LoginClient from './loginpage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LoginClient />
    </Suspense>
  );
}
