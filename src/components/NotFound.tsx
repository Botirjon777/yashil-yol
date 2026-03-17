import React from "react";
import Link from "next/link";
import Button from "@/src/components/ui/Button";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-primary/10 leading-none">404</h1>
          <div className="absolute inset-x-0 bottom-8">
            <h2 className="text-3xl font-black text-dark-text">Oops! Lost your way?</h2>
          </div>
        </div>
        <p className="text-gray-500 text-lg mb-10 font-medium">
          The page you are looking for doesn&apos;t exist or has been moved to another region.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-2xl">
            Take me Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
