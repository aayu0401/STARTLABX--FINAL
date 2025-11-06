"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Smartphone, CheckCircle, Shield } from 'lucide-react';

export function SecurityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Mail className="h-4 w-4 mr-2" />
          Change Email
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          Change Password
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Smartphone className="h-4 w-4 mr-2" />
          Two-Factor Auth
        </Button>
        <div className="pt-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-muted-foreground">Account Verified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
