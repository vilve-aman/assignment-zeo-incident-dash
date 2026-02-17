'use client';

// Main landing page - redirects to incidents list
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to incidents list page
    router.push('/incidents');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <p className="text-zinc-600">Redirecting...</p>
    </div>
  );
}
