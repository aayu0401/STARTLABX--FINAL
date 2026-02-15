'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Lock, Palette, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { userSettingsService, type NotificationSettings, type PrivacySettings } from '@/services/user-settings';
import { NotificationsCard } from './components/notifications-card';
import { PrivacyCard } from './components/privacy-card';

export default function SettingsPage() {
  const { user, userProfile } = useAuth(); // Assuming context provides this
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // Profile
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    title: '',

    // Preferences
    theme: 'system',
    language: 'en',
    timezone: 'America/Los_Angeles'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    matches: true,
    messages: true,
    updates: true
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: true,
    showEmail: false,
    showActivity: true
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await userSettingsService.getSettings();
        setNotificationSettings(data.notifications);
        setPrivacySettings(data.privacy);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    if (userProfile) {
      setSettings(prev => ({
        ...prev,
        name: userProfile.name || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        title: userProfile.title || '',
      }));
      loadSettings();
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await authService.updateProfile({ // This calls PUT /api/auth/me/update
        name: settings.name,
        bio: settings.bio,
        location: settings.location,
        website: settings.website,
        title: settings.title
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Failed to update profile", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-left duration-700">
        <h1 className="text-3xl font-black tracking-tighter text-gradient-blue flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary animate-float" />
          Settings Console
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">
          Configure your <span className="text-foreground font-bold underline decoration-primary/30 underline-offset-4">identity</span> and system preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Lock className="w-4 h-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Palette className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                  className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Input
                    value={settings.location}
                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  />
                </div>
              </div>

              <Button onClick={handleSave} className="gradient-primary">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <NotificationsCard
            notifications={notificationSettings}
            onChange={async (key, value) => {
              const updates = { [key]: value };
              setNotificationSettings(prev => ({ ...prev, ...updates }));
              try {
                await userSettingsService.updateNotifications(updates);
                toast({ title: "Success", description: "Notification settings updated" });
              } catch (error) {
                toast({ title: "Error", description: "Failed to update notification settings", variant: "destructive" });
              }
            }}
          />
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <div className="space-y-6">
            <PrivacyCard
              privacy={privacySettings}
              onChange={async (key, value) => {
                const updates = { [key]: value };
                setPrivacySettings(prev => ({ ...prev, ...updates }));
                try {
                  await userSettingsService.updatePrivacy(updates);
                  toast({ title: "Success", description: "Privacy settings updated" });
                } catch (error) {
                  toast({ title: "Error", description: "Failed to update privacy settings", variant: "destructive" });
                }
              }}
            />

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security</h3>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>

              <Button onClick={handleSave} className="gradient-primary">
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}