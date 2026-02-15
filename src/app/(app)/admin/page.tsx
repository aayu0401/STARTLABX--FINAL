'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { Users, Rocket, Activity, BarChart3, ShieldCheck, UserPlus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple role check
        if (userProfile && userProfile.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        const fetchAdminData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/admin/users')
                ]);

                if (statsRes.ok && usersRes.ok) {
                    const statsData = await statsRes.json();
                    const usersData = await usersRes.json();
                    setStats(statsData.stats);
                    setUsers(usersData);
                }
            } catch (error) {
                console.error('Fetch admin data error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [userProfile, router]);

    const handlePromote = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            }
        } catch (error) {
            console.error('Update role error:', error);
        }
    };

    if (loading) return <div>Loading Admin Terminal...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        Admin Command Center
                    </h1>
                    <p className="text-muted-foreground">Manage users, startups, and platform health.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Activity className="w-4 h-4" /> System Logs
                    </Button>
                    <Button variant="gradient" size="sm" className="gap-2">
                        <Settings className="w-4 h-4" /> Platform Settings
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card glass hover>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 font-medium">
                            <Users className="w-4 h-4 text-blue-500" /> Total Users
                        </CardDescription>
                        <CardTitle className="text-3xl">{stats?.totalUsers || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-500 font-medium">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card glass hover>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 font-medium">
                            <Rocket className="w-4 h-4 text-purple-500" /> Startups
                        </CardDescription>
                        <CardTitle className="text-3xl">{stats?.totalStartups || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-500 font-medium">+5 new this week</p>
                    </CardContent>
                </Card>
                <Card glass hover>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 font-medium">
                            <BarChart3 className="w-4 h-4 text-orange-500" /> Communities
                        </CardDescription>
                        <CardTitle className="text-3xl">{stats?.totalCommunities || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">Active engagement metrics</p>
                    </CardContent>
                </Card>
                <Card glass hover>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2 font-medium">
                            <Activity className="w-4 h-4 text-red-500" /> Platform Growth
                        </CardDescription>
                        <CardTitle className="text-3xl">{stats?.growth || 0}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-blue-500 font-medium">Target: 20%</p>
                    </CardContent>
                </Card>
            </div>

            {/* User Management Table */}
            <Card glass className="border-muted/40 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        User Directory
                    </CardTitle>
                    <CardDescription>Review and manage user account privileges.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-y border-muted/20">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Joined</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-muted/20">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                            <div>
                                                <p className="font-semibold">{u.name}</p>
                                                <p className="text-xs text-muted-foreground">{u.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="capitalize">
                                                {u.accountType}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={u.role === 'admin' ? 'gradient' : 'secondary'}
                                                className="capitalize"
                                            >
                                                {u.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary"
                                                onClick={() => handlePromote(u.id, u.role)}
                                            >
                                                {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
