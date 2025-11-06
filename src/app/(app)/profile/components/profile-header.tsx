"use client";
import { Button } from '@/components/ui/button';
import { Edit, Settings } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your profile information and preferences.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
}
