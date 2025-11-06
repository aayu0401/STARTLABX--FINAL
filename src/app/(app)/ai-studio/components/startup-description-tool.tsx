import { StartupDescriptionGenerator } from './startup-description-generator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function StartupDescriptionTool() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Startup Description Generator</CardTitle>
        <CardDescription>
          Craft a compelling description for your startup with the help of AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StartupDescriptionGenerator />
      </CardContent>
    </Card>
  );
}
