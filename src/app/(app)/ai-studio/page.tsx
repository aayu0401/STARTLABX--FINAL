import { StartupDescriptionGenerator } from '@/components/ai/startup-description-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiStudioPage() {
  return (
    <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Studio</h2>
          <p className="text-muted-foreground mt-1">
            Your AI co-pilot for validating, building, and pitching your next big idea.
          </p>
        </div>
        
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Startup Description Generator</CardTitle>
                <CardDescription>Craft a compelling description for your startup with the help of AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <StartupDescriptionGenerator />
            </CardContent>
        </Card>
    </div>
  );
}
