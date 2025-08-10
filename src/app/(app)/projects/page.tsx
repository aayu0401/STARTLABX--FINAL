import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const tasks = {
  todo: [
    { id: 'task-1', title: 'Design new landing page hero', priority: 'High', tags: ['UI/UX', 'Design'] },
    { id: 'task-2', title: 'Setup CI/CD pipeline', priority: 'Medium', tags: ['DevOps'] },
    { id: 'task-3', title: 'Draft Q3 marketing plan', priority: 'Low', tags: ['Marketing'] },
  ],
  inProgress: [
    { id: 'task-4', title: 'Develop user authentication flow', priority: 'High', tags: ['Frontend', 'Backend'] },
    { id: 'task-5', title: 'User testing for new feature', priority: 'Medium', tags: ['Research'] },
  ],
  done: [
    { id: 'task-6', title: 'Onboarding component V1', priority: 'High', tags: ['Frontend'] },
    { id: 'task-7', title: 'Migrate database to new server', priority: 'High', tags: ['DevOps', 'Backend'] },
  ],
};

const KanbanColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex-1 min-w-[300px] bg-secondary/50 rounded-lg p-4">
    <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
      {title}
      <Button variant="ghost" size="icon" className="rounded-full">
        <PlusCircle className="h-5 w-5 text-muted-foreground" />
      </Button>
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const TaskCard = ({ task }: { task: { id: string, title: string, priority: string, tags: string[] } }) => (
  <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing active:shadow-lg">
    <CardContent className="p-4">
      <p className="font-medium mb-2">{task.title}</p>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant={task.priority === 'High' ? 'destructive' : (task.priority === 'Medium' ? 'default' : 'secondary')} className="capitalize">{task.priority}</Badge>
          {task.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
        <Avatar className="h-6 w-6">
          <AvatarImage src="https://placehold.co/32x32" data-ai-hint="person face" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </CardContent>
  </Card>
);

export default function ProjectsPage() {
  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Dashboard</h2>
            <p className="text-muted-foreground mt-1">Organize tasks, track progress, and collaborate with your team.</p>
        </div>
        <Button>New Project</Button>
      </div>

      <Tabs defaultValue="board" className="flex-grow flex flex-col">
        <TabsList className="mb-4 self-start">
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="board" className="flex-grow">
          <div className="flex gap-6 overflow-x-auto pb-4 h-full">
            <KanbanColumn title="To Do">
              {tasks.todo.map(task => <TaskCard key={task.id} task={task} />)}
            </KanbanColumn>
            <KanbanColumn title="In Progress">
              {tasks.inProgress.map(task => <TaskCard key={task.id} task={task} />)}
            </KanbanColumn>
            <KanbanColumn title="Done">
              {tasks.done.map(task => <TaskCard key={task.id} task={task} />)}
            </KanbanColumn>
          </div>
        </TabsContent>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Tasks</CardTitle>
              <CardDescription>A list view of all tasks in the project.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>List view coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Task Calendar</CardTitle>
              <CardDescription>A calendar view of task deadlines.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Calendar view coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
