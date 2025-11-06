"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import type { NotificationSettings } from '@/services/user-settings';

export function NotificationsCard({
  notifications,
  onChange,
}: {
  notifications: NotificationSettings;
  onChange: (key: keyof NotificationSettings, value: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Choose what notifications you want to receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch checked={notifications.email} onCheckedChange={(c) => onChange('email', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
            </div>
            <Switch checked={notifications.push} onCheckedChange={(c) => onChange('push', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Match Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when you have new matches</p>
            </div>
            <Switch checked={notifications.matches} onCheckedChange={(c) => onChange('matches', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Message Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about new messages</p>
            </div>
            <Switch checked={notifications.messages} onCheckedChange={(c) => onChange('messages', c)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-muted-foreground">Stay informed about new features and updates</p>
            </div>
            <Switch checked={notifications.updates} onCheckedChange={(c) => onChange('updates', c)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
