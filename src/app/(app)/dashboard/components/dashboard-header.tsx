"use client";
import React from 'react';

export function DashboardHeader() {
  return (
    <div className="w-full max-w-full">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mt-1 text-sm sm:text-base">
        Welcome back! Here's a snapshot of your startup ecosystem.
      </p>
    </div>
  );
}
