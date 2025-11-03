import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 font-sans text-center bg-white sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="mt-6 text-6xl font-extrabold tracking-tighter text-primary sm:text-8xl">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800 sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mt-3 text-sm lg:text-base text-gray-600">
          Oops! The page you a looking for does not exist. It might have been
          moved or deleted.
        </p>
        
        <div className='mt-4'>
           <Button>
            <Link className='flex items-center gap-2' href={"/"}>
            <ChevronLeft />
            Back Home
            </Link>
        </Button>
        </div>
      </div>
    </div>
  );
}
