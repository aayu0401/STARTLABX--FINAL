"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye } from 'lucide-react';
import type { PrivacySettings } from '@/services/user-settings';

export function PrivacyCard({
  privacy,
  onChange,
}: {
  privacy: PrivacySettings;
  onChange: (key: keyof PrivacySettings, value: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Privacy
        </CardTitle>
        <CardDescription>Control who can see your information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
            </div>
            <Switch checked={privacy.profileVisibility} onCheckedChange={(c) => onChange('profileVisibility', c)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Email</Label>
              <p className="text-sm text-muted-foreground">Display your email on your public profile</p>
            </div>
            <Switch checked={privacy.showEmail} onCheckedChange={(c) => onChange('showEmail', c)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Activity</Label>
              <p className="text-sm text-muted-foreground">Show your activity status to other users</p>
            </div>
            <Switch checked={privacy.showActivity} onCheckedChange={(c) => onChange('showActivity', c)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
