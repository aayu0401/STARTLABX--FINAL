"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DangerZoneCardProps {
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function DangerZoneCard({ onSignOut, onDeleteAccount }: DangerZoneCardProps) {
  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={onSignOut}>
          Sign Out
        </Button>
        <Button variant="destructive" size="sm" className="w-full justify-start" onClick={onDeleteAccount}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
        <p className="text-xs text-muted-foreground">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </CardContent>
    </Card>
  );
}
