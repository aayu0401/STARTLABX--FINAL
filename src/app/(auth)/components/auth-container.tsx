"use client";
import React from 'react';

export function AuthContainer({ children, widthClass = 'sm:w-[350px]' }: { children: React.ReactNode; widthClass?: string }) {
  return (
    <div className={`mx-auto flex w-full flex-col justify-center space-y-6 ${widthClass}`}>
      {children}
    </div>
  );
}
