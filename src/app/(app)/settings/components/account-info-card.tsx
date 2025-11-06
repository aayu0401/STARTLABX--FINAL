"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AccountInfoProps {
  fullName: string;
  email: string;
  accountType: string;
  createdAt?: Date | number | string;
}

export function AccountInfoCard({ fullName, email, accountType, createdAt }: AccountInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Information
        </CardTitle>
        <CardDescription>Basic information about your account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Full Name</Label>
            <p className="mt-1 text-sm">{fullName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Email</Label>
            <p className="mt-1 text-sm">{email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Account Type</Label>
            <div className="mt-1">
              <Badge variant={accountType === 'startup' ? 'default' : 'secondary'}>
                {accountType === 'startup' ? 'Founder' : 'Professional'}
              </Badge>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Member Since</Label>
            <p className="mt-1 text-sm">{new Date(createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
        <Separator />
        <Button variant="outline" size="sm">Edit Profile Information</Button>
      </CardContent>
    </Card>
  );
}
