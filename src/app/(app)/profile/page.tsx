'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Building, 
  Briefcase, 
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  MapPin,
  Edit,
  Settings
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-screen';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
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
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isStartup = userProfile.accountType === 'startup';
  const isProfessional = userProfile.accountType === 'professional';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your profile information and preferences.
          </p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://placehold.co/200x200" alt={userProfile.fullName} />
                  <AvatarFallback className="text-lg">
                    {userProfile.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl">{userProfile.fullName}</CardTitle>
                    <Badge variant={isStartup ? "default" : "secondary"}>
                      {isStartup ? "Founder" : "Professional"}
                    </Badge>
                  </div>
                  {isProfessional && userProfile.title && (
                    <p className="text-muted-foreground font-medium">{userProfile.title}</p>
                  )}
                  {isStartup && userProfile.companyName && (
                    <p className="text-muted-foreground font-medium">{userProfile.companyName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {userProfile.email}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {/* Description/Bio Section */}
            {isStartup && userProfile.description && (
              <CardContent className="pt-0">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground">{userProfile.description}</p>
              </CardContent>
            )}
          </Card>

          {/* Professional Skills */}
          {isProfessional && userProfile.skills && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.split(',').map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Information for Startups */}
          {isStartup && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.industry && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="mt-1">{userProfile.industry}</p>
                  </div>
                )}
                {userProfile.stage && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Stage</label>
                    <p className="mt-1 capitalize">{userProfile.stage.replace('_', ' ')}</p>
                  </div>
                )}
                {userProfile.fundingStatus && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Funding Status</label>
                    <p className="mt-1 capitalize">{userProfile.fundingStatus.replace('_', ' ')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Professional Info */}
          {isProfessional && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile.availability && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Availability</label>
                    <p className="mt-1 capitalize">{userProfile.availability}</p>
                  </div>
                )}
                {userProfile.experience && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                    <p className="mt-1 capitalize">{userProfile.experience}</p>
                  </div>
                )}
                {userProfile.preferredEquity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Equity</label>
                    <p className="mt-1">{userProfile.preferredEquity}%</p>
                  </div>
                )}
                {userProfile.hourlyRate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hourly Rate</label>
                    <p className="mt-1">${userProfile.hourlyRate}/hour</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isStartup && userProfile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={userProfile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Website
                  </a>
                </div>
              )}
              {isProfessional && userProfile.portfolio && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={userProfile.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    Portfolio
                  </a>
                </div>
              )}
              {isProfessional && userProfile.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={userProfile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {isProfessional && userProfile.github && (
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={userProfile.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    GitHub
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined</span>
                <span>{new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Account Type</span>
                <span className="capitalize">{userProfile.accountType}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}