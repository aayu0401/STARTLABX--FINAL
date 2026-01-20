'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, Lock, Palette, Globe, Mail, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Profile
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Founder & CEO at TechStartup',
    location: 'San Francisco, CA',
    website: 'https://techstartup.com',

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,

    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,

    // Preferences
    theme: 'system',
    language: 'en',
    timezone: 'America/Los_Angeles'
  });

  const handleSave = () => {
    // Save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Settings className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
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
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive push notifications in browser
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get a weekly summary of your activity
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyDigest}
                  onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive updates about new features and offers
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketingEmails}
                  onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                  className="rounded"
                />
              </div>

              <Button onClick={handleSave} className="gradient-primary">
                Save Preferences
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Visibility</label>
                <select
                  value={settings.profileVisibility}
                  onChange={(e) => setSettings({ ...settings, profileVisibility: e.target.value })}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Show Email Address</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Display email on your profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={(e) => setSettings({ ...settings, showEmail: e.target.checked })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Show Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Display location on your profile
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showLocation}
                  onChange={(e) => setSettings({ ...settings, showLocation: e.target.checked })}
                  className="rounded"
                />
              </div>

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

              <Button onClick={handleSave} className="gradient-primary">
                Save Privacy Settings
              </Button>
            </div>
          </Card>
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