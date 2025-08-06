import { TalentMatchForm } from '@/components/ai/talent-match-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Describe your startup and needs, and let our AI suggest the perfect talent for your team.
          </p>
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>AI-Powered Talent Matching</CardTitle>
                <CardDescription>Fill out the details below to get personalized talent suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
                <TalentMatchForm />
            </CardContent>
        </Card>
    </div>
  );
}
