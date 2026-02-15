
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Copy, Eye, Code as CodeIcon, Monitor } from 'lucide-react';
import { LandingPagePreview } from './previews/landing-page-preview';
import InteractivePreview from './interactive-preview';
import { GeneratedAsset } from '@/services/incubator.service';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ArtifactViewerProps {
    isOpen: boolean;
    onClose: () => void;
    asset: GeneratedAsset | null;
    project: { name: string; description: string };
}

export function ArtifactViewer({ isOpen, onClose, asset, project }: ArtifactViewerProps) {
    const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');

    if (!asset) return null;

    const isCode = asset.type === 'code';
    const isImage = asset.type === 'image';
    const canPreview = asset.title.includes('LandingPage') || asset.type === 'image';
    const isReactComponent = asset.format === 'tsx' || asset.format === 'jsx';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b shrink-0 flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-2">
                        {asset.type === 'code' ? <CodeIcon className="h-5 w-5 text-primary" /> : <Monitor className="h-5 w-5 text-primary" />}
                        {asset.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 pr-8">
                        {canPreview && (
                            <div className="flex bg-muted rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'code' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setViewMode('code')}
                                >
                                    <CodeIcon className="h-3 w-3 mr-1" />
                                    Code
                                </Button>
                                <Button
                                    variant={viewMode === 'preview' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => setViewMode('preview')}
                                >
                                    <Eye className="h-3 w-3 mr-1" />
                                    Preview
                                </Button>
                            </div>
                        )}
                        <Button variant="outline" size="sm" className="h-8">
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden bg-muted/10 relative">
                    {viewMode === 'code' ? (
                        <ScrollArea className="h-full w-full p-4">
                            <pre className="text-sm font-mono whitespace-pre-wrap bg-slate-950 text-slate-50 p-6 rounded-lg overflow-x-auto">
                                <code>{asset.content}</code>
                            </pre>
                        </ScrollArea>
                    ) : (
                        <div className="h-full w-full overflow-hidden flex flex-col">
                            {asset.title.includes('LandingPage') || isReactComponent ? (
                                <InteractivePreview code={asset.content} />
                            ) : isImage ? (
                                <div className="h-full w-full flex items-center justify-center bg-black/5">
                                    <div className="text-center">
                                        <img src={asset.content} alt={asset.title} className="max-w-full max-h-[60vh] object-contain shadow-lg rounded-lg" />
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                    <p>Preview not available for this file type.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
