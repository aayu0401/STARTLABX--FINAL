import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, GitBranch, Database, PieChart, Activity, HardDrive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

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

const chartData = [
    { date: '2023-01-01', users: 120 },
    { date: '2023-01-02', users: 150 },
    { date: '2023-01-03', users: 130 },
    { date: '2023-01-04', users: 180 },
    { date: '2023-01-05', users: 210 },
    { date: '2023-01-06', users: 200 },
    { date: '2023-01-07', users: 240 },
];
  
const chartConfig = {
    users: {
        label: "Users",
        color: "hsl(var(--chart-1))",
    },
};

const pipelineStages = [
    { name: 'Build', status: 'success' },
    { name: 'Test', status: 'success' },
    { name: 'Deploy to Staging', status: 'in-progress' },
    { name: 'Manual Approval', status: 'pending' },
    { name: 'Deploy to Production', status: 'pending' },
];

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
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="devops">DevOps</TabsTrigger>
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
        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PieChart /> Project Analytics</CardTitle>
                    <CardDescription>Key metrics for your project's performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[350px] w-full">
                        <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Area dataKey="users" type="monotone" fill="var(--color-users)" fillOpacity={0.4} stroke="var(--color-users)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Database /> Database Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-green-500" />
                             <p className="text-muted-foreground">All systems operational.</p>
                        </div>
                        <p className="text-2xl font-bold mt-2">99.98% <span className="text-sm font-normal text-muted-foreground">Uptime</span></p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><Activity /> API Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Average response time.</p>
                        <p className="text-2xl font-bold mt-2">48ms</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2"><HardDrive /> Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Total storage used.</p>
                        <p className="text-2xl font-bold mt-2">12.5 GB / 50 GB</p>
                    </CardContent>
                 </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="devops">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><GitBranch /> CI/CD Pipeline</CardTitle>
                    <CardDescription>Live status of your deployment pipeline.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                        {pipelineStages.map((stage, index) => (
                            <React.Fragment key={stage.name}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        stage.status === 'success' ? 'bg-green-500 text-white' : 
                                        stage.status === 'in-progress' ? 'bg-blue-500 text-white animate-pulse' : 
                                        'bg-muted text-muted-foreground'
                                    }`}>
                                        {index + 1}
                                    </div>
                                    <p className="text-sm font-medium">{stage.name}</p>
                                    <Badge variant={
                                        stage.status === 'success' ? 'default' : 
                                        stage.status === 'in-progress' ? 'secondary' : 'outline'
                                    } className={stage.status === 'success' ? 'bg-green-500/20 text-green-700' : ''}>
                                        {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                                    </Badge>
                                </div>
                                {index < pipelineStages.length - 1 && <Separator className="flex-1" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                        <h4 className="font-semibold">Recent Deployments</h4>
                        <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                            <p className="font-mono text-sm">#a3f5d8e - feat: Add user profile page</p>
                            <p className="text-sm text-muted-foreground">3 hours ago - <span className="text-green-600 font-semibold">Success</span></p>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                             <p className="font-mono text-sm">#c1b9e2f - fix: Resolve login issue</p>
                            <p className="text-sm text-muted-foreground">1 day ago - <span className="text-green-600 font-semibold">Success</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
