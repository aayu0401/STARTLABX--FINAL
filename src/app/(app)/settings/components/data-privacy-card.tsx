"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Download } from 'lucide-react';

interface DataPrivacyCardProps {
  onExport: () => void;
}

export function DataPrivacyCard({ onExport }: DataPrivacyCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Data & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="outline" size="sm" className="w-full justify-start" onClick={onExport}>
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
  );
}
