'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Rocket, BrainCircuit, Users, Hammer, ScrollText, PlayCircle, Loader2, FileCode, FileText, Image as ImageIcon, Megaphone, Gavel } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { incubatorService, StartupProject, GeneratedAsset } from '@/services/incubator.service';
import { useToast } from '@/hooks/use-toast';
import { ArtifactViewer } from '@/components/incubator/artifact-viewer';
import { downloadProjectAsZip } from '@/lib/project-export';
import { Download, Share2 } from 'lucide-react';
import { postService } from '@/services/post.service';

export default function IncubatorPage() {
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const sub = await import('@/services/subscription.service').then(m => m.default.getCurrentSubscription());
        setHasAccess(sub.plan === 'founder' || sub.plan === 'unicorn');
      } catch (e) {
        console.error("Failed to check subscription", e);
        setHasAccess(false);
      } finally {
        setSubscriptionLoading(false);
      }
    };
    checkAccess();
  }, []);
  const [projects, setProjects] = useState<StartupProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<StartupProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingArtifact, setViewingArtifact] = useState<GeneratedAsset | null>(null);

  // New Project Form
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectIdea, setNewProjectIdea] = useState('');

  useEffect(() => {
    if (hasAccess) loadProjects();
  }, [hasAccess]);

  const loadProjects = async () => {
    try {
      const res = await incubatorService.getProjects();
      setProjects(res);
      if (res.length > 0 && !selectedProject) {
        loadProjectDetails(res[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (id: string) => {
    setLoading(true);
    try {
      const project = await incubatorService.getProject(id);
      setSelectedProject(project);
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load project details', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const triggerAgent = async (projectId: string, role: string, action: string, input: any) => {
    try {
      toast({ title: `Activating ${role}...`, description: 'Agent is processing your request.' });
      await incubatorService.triggerAction(projectId, role, action, input);
      toast({ title: 'Task Completed', description: 'New artifacts generated.' });
      loadProjectDetails(projectId);
    } catch (e) {
      toast({ title: 'Agent Failed', description: 'The agent encountered an error.', variant: 'destructive' });
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectIdea) return;
    setIsCreating(true);
    try {
      const project = await incubatorService.createProject(newProjectIdea, newProjectName);
      toast({ title: 'Project Created', description: 'AI Squad has been assigned.' });
      setNewProjectName('');
      setNewProjectIdea('');
      loadProjects();

      // Auto-trigger CEO
      await triggerAgent(project.id, 'CEO', 'analyze_idea', { idea: newProjectIdea });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to create project', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLaunchToFeed = async () => {
    if (!selectedProject) return;
    try {
      toast({ title: 'Launching...', description: 'Sharing your startup with the world!' });
      await postService.create({
        content: selectedProject.description,
        title: `🚀 Launched: ${selectedProject.name}`,
        type: 'LAUNCH',
        visibility: 'PUBLIC'
      });
      toast({ title: 'Success', description: 'Your startup is now live on the feed.', variant: 'success' });
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to launch project', variant: 'destructive' });
    }
  };

  if (subscriptionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="mt-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <BrainCircuit className="h-24 w-24 text-muted-foreground mb-6 opacity-20" />
        <h2 className="text-3xl font-bold mb-4">StartLabX AI Incubator</h2>
        <p className="text-muted-foreground max-w-lg mb-8">
          Unlock the power of our autonomous agent squad to build your startup from scratch.
          Ideation, validation, architecture, and code generation - all on autopilot.
        </p>
        <Button className="btn-premium text-lg px-8 py-6" onClick={() => window.location.href = '/subscription'}>
          Upgrade to Founder Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl animate-in fade-in h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            AI Startup Incubator
          </h1>
          <p className="text-muted-foreground mt-1">
            Your autonomous co-founder squad is ready to build.
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Rocket className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initialize New Startup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Startup Name</label>
                <Input placeholder="e.g. HealthAI" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">The Big Idea</label>
                <Textarea placeholder="Describe your vision..." value={newProjectIdea} onChange={e => setNewProjectIdea(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject} disabled={isCreating}>
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                Launch Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sidebar Project List */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Projects</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => loadProjectDetails(p.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${selectedProject?.id === p.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-muted'}`}
                >
                  <h4 className="font-bold truncate">{p.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{p.status}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Workspace */}
        <div className="col-span-9 flex flex-col gap-6 overflow-hidden">
          {selectedProject ? (
            <>
              {/* Agent Squad Status */}
              <div className="grid grid-cols-6 gap-4 shrink-0">
                <AgentStatusCard
                  role="CEO"
                  name="Strategy"
                  status={loading ? 'thinking' : 'active'}
                  task="Monitoring Roadmap"
                  icon={BrainCircuit}
                  onClick={() => triggerAgent(selectedProject.id, 'CEO', 'analyze_idea', { idea: selectedProject.description })}
                />
                <AgentStatusCard
                  role="PM"
                  name="Product Manager"
                  status="idle"
                  task="Waiting for Strategy"
                  icon={Users}
                  onClick={() => triggerAgent(selectedProject.id, 'PM', 'create_prd', { strategy: {} })}
                />
                <AgentStatusCard
                  role="CTO"
                  name="Tech Architect"
                  status="idle"
                  task="Waiting for Spec"
                  icon={Hammer}
                  onClick={() => triggerAgent(selectedProject.id, 'CTO', 'design_architecture', { strategy: {} })}
                />
                <AgentStatusCard
                  role="Frontend"
                  name="UI Builder"
                  status="idle"
                  task="Ready to Code"
                  icon={FileCode}
                  onClick={() => triggerAgent(selectedProject.id, 'frontend_dev', 'generate_landing_page', {})}
                />
                <AgentStatusCard
                  role="CMO"
                  name="Marketing"
                  status="idle"
                  task="Waiting for Launch"
                  icon={Megaphone}
                  onClick={() => triggerAgent(selectedProject.id, 'growth_hacker', 'generate_marketing_plan', { strategy: {} })}
                />
                <AgentStatusCard
                  role="Legal"
                  name="General Counsel"
                  status="idle"
                  task="Ready to Draft"
                  icon={Gavel}
                  onClick={() => triggerAgent(selectedProject.id, 'legal_bot', 'draft_documents', {})}
                />
              </div>

              {/* Artifacts & Output */}
              <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
                <Card className="col-span-2 flex flex-col overflow-hidden">
                  <CardHeader className="py-4 border-b bg-muted/20 flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-2">
                      <CardTitle>Project Artifacts</CardTitle>
                      <Badge variant="outline">{selectedProject.assets.length} Files</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => downloadProjectAsZip(selectedProject)}
                      disabled={selectedProject.assets.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      Download ZIP
                    </Button>
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 border-none shadow-md shadow-orange-500/20"
                      onClick={handleLaunchToFeed}
                      disabled={selectedProject.assets.length === 0}
                    >
                      <Share2 className="h-4 w-4" />
                      Launch to Feed
                    </Button>
                  </CardHeader>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedProject.assets.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                        <PlayCircle className="h-10 w-10 mb-2 opacity-20" />
                        <p>No artifacts generated yet. Trigger an agent to start building.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProject.assets.map(asset => (
                          <Card key={asset.id} className="p-4 hover:border-primary cursor-pointer group transition-all" onClick={() => setViewingArtifact(asset)}>
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded bg-muted group-hover:bg-primary/10 transition-colors">
                                {asset.type === 'code' ? <FileCode className="h-5 w-5" /> :
                                  asset.type === 'image' ? <ImageIcon className="h-5 w-5" /> :
                                    <FileText className="h-5 w-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{asset.title}</p>
                                <p className="text-xs text-muted-foreground">{new Date(asset.createdAt).toLocaleTimeString()}</p>
                              </div>
                            </div>
                            <div className="mt-3 text-xs bg-muted p-2 rounded max-h-20 overflow-hidden font-mono text-muted-foreground">
                              {asset.content.substring(0, 100)}...
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Task Log */}
                <Card className="flex flex-col overflow-hidden">
                  <CardHeader className="py-4 border-b">
                    <CardTitle className="text-sm">Agent Activity Log</CardTitle>
                  </CardHeader>
                  <div className="flex-1 overflow-y-auto p-0">
                    <div className="divide-y text-sm">
                      {selectedProject.tasks.map(task => (
                        <div key={task.id} className="p-3">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold">{task.agentRole}</span>
                            <span className={`text-[10px] uppercase ${task.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>{task.status}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{task.action}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select or create a project to begin
            </div>
          )}
        </div>
      </div>

      <ArtifactViewer
        isOpen={!!viewingArtifact}
        onClose={() => setViewingArtifact(null)}
        asset={viewingArtifact}
        project={selectedProject ? { name: selectedProject.name, description: selectedProject.description } : { name: '', description: '' }}
      />
    </div>
  );
}

function AgentStatusCard({ role, name, status, task, icon: Icon, onClick }: any) {
  return (
    <Card onClick={onClick} className="hover:border-primary/50 transition-colors cursor-pointer group active:scale-95">
      <CardContent className="p-4 flex items-start gap-4">
        <div className={`p-2 rounded-lg ${status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className="font-bold text-sm">{role}</p>
            <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-5">
              {status}
            </Badge>
          </div>
          <p className="text-xs font-medium truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate mt-1 group-hover:text-primary transition-colors">
            {task}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
