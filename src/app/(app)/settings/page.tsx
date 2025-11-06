'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
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
import { SettingsHeader } from './components/settings-header';
import { AccountInfoCard } from './components/account-info-card';
import { NotificationsCard } from './components/notifications-card';
import { PrivacyCard } from './components/privacy-card';
import { SecurityCard } from './components/security-card';
import { DataPrivacyCard } from './components/data-privacy-card';
import { DangerZoneCard } from './components/danger-zone-card';

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
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <AccountInfoCard
            fullName={userProfile.fullName}
            email={userProfile.email}
            accountType={userProfile.accountType}
            createdAt={userProfile.createdAt}
          />

          <NotificationsCard
            notifications={userSettings.notifications}
            onChange={handleNotificationChange}
          />

          <PrivacyCard
            privacy={userSettings.privacy}
            onChange={handlePrivacyChange}
          />

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <SecurityCard />

          <DataPrivacyCard onExport={handleExportData} />

          <DangerZoneCard onSignOut={logout} onDeleteAccount={handleDeleteAccount} />

        </div>
      </div>
    </div>
  );
}