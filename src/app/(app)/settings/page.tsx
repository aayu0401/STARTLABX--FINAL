'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Shield, 
  User, 
  Mail, 
  Eye,
  Smartphone,
  Globe,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { useToast } from '@/hooks/use-toast';
import { 
  getUserSettings, 
  updateNotificationSettings, 
  updatePrivacySettings,
  type UserSettings,
  type NotificationSettings,
  type PrivacySettings 
} from '@/services/user-settings';

export default function SettingsPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const { toast } = useToast();
  const [userSettings, setUserSettings] = React.useState<UserSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = React.useState(true);

  // Load user settings when component mounts
  React.useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        try {
          const settings = await getUserSettings(user.uid);
          setUserSettings(settings);
        } catch (error) {
          console.error('Error loading settings:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your settings. Please try again.",
          });
        } finally {
          setSettingsLoading(false);
        }
      }
    };

    loadSettings();
  }, [user, toast]);

  if (loading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to access settings.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile || !userSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading your settings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await updateNotificationSettings(user!.uid, { [key]: value });
      setUserSettings(prev => prev ? {
        ...prev,
        notifications: { ...prev.notifications, [key]: value }
      } : null);
      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
      });
    }
  };

  const handlePrivacyChange = async (key: keyof PrivacySettings, value: boolean) => {
    try {
      await updatePrivacySettings(user!.uid, { [key]: value });
      setUserSettings(prev => prev ? {
        ...prev,
        privacy: { ...prev.privacy, [key]: value }
      } : null);
      toast({
        title: "Privacy Updated",
        description: "Your privacy settings have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be emailed to you within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Account Deletion",
      description: "This feature will be available soon. Contact support for assistance.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Basic information about your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="mt-1 text-sm">{userProfile.fullName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="mt-1 text-sm">{userProfile.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Type</Label>
                  <div className="mt-1">
                    <Badge variant={userProfile.accountType === 'startup' ? "default" : "secondary"}>
                      {userProfile.accountType === 'startup' ? 'Founder' : 'Professional'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="mt-1 text-sm">
                    {new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Separator />
              <Button variant="outline" size="sm">
                Edit Profile Information
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Match Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you have new matches
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.matches}
                    onCheckedChange={(checked) => handleNotificationChange('matches', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Message Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.messages}
                    onCheckedChange={(checked) => handleNotificationChange('messages', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Stay informed about new features and updates
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.notifications.updates}
                    onCheckedChange={(checked) => handleNotificationChange('updates', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>
                Control who can see your information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.privacy.profileVisibility}
                    onCheckedChange={(checked) => handlePrivacyChange('profileVisibility', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email on your public profile
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Show your activity status to other users
                    </p>
                  </div>
                  <Switch
                    checked={userSettings.privacy.showActivity}
                    onCheckedChange={(checked) => handlePrivacyChange('showActivity', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Security */}
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

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Terms of Service
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={logout}>
                Sign Out
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}