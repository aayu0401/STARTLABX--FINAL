"use client";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface TaskData { id: string; title: string; priority: string; tags: string[] }

function priorityVariant(priority: string) {
  if (priority === 'High') return 'destructive';
  if (priority === 'Medium') return 'default';
  return 'secondary';
}

export function TaskCard({ task }: { task: TaskData }) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing active:shadow-lg">
      <CardContent className="p-4">
        <p className="font-medium mb-2">{task.title}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={priorityVariant(task.priority)} className="capitalize">{task.priority}</Badge>
            {task.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://placehold.co/32x32" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
