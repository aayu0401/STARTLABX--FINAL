'use client';

import { useState } from 'react';
import { generateLegalDoc } from '@/ai/flows/legal-generator';
import { AiOrchestrator } from '@/lib/ai-orchestrator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scale, FileText, Stamp, Loader2, Download, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function LegalDroid() {
    const [docType, setDocType] = useState<any>('NDA');
    const [partyA, setPartyA] = useState('');
    const [partyB, setPartyB] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [docContent, setDocContent] = useState('');

    const handleGenerate = async () => {
        if (!partyA || !partyB) return;
        setIsGenerating(true);
        try {
            const result = await AiOrchestrator.run('Legal Document Generation', () =>
                generateLegalDoc({
                    docType,
                    partyA,
                    partyB,
                    jurisdiction: 'Delaware'
                })
            );
            setDocContent(result.content);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px] animate-in fade-in">
            {/* Input Panel */}
            <div className="lg:col-span-4 space-y-4">
                <Card className="p-6 border-slate-200/50 shadow-sm h-full flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                            <Scale className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Legal Droid</h3>
                            <p className="text-xs text-muted-foreground">AI Compliance Generator</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold mb-1 block">Document Type</label>
                            <Select value={docType} onValueChange={setDocType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NDA">Non-Disclosure Agreement</SelectItem>
                                    <SelectItem value="Founder Agreement">Co-Founder Agreement</SelectItem>
                                    <SelectItem value="Privacy Policy">Privacy Policy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold mb-1 block">Party A (You/Company)</label>
                            <Input placeholder="StartLabX Inc." value={partyA} onChange={e => setPartyA(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-xs font-semibold mb-1 block">Party B (Recipient)</label>
                            <Input placeholder="John Doe" value={partyB} onChange={e => setPartyB(e.target.value)} />
                        </div>

                        <Button onClick={handleGenerate} disabled={isGenerating || !partyA} className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2">
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Stamp className="h-4 w-4" />}
                            Generate Compliance Doc
                        </Button>
                    </div>

                    <div className="mt-auto bg-slate-50 p-4 rounded-lg text-xs text-muted-foreground">
                        <p className="flex gap-2 items-start">
                            <span className="font-bold text-slate-900">Disclaimer:</span>
                            This is AI-generated content. Consult a qualified attorney before signing.
                        </p>
                    </div>
                </Card>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-8">
                <Card className="h-full flex flex-col border-slate-200 shadow-md bg-white">
                    <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="font-mono text-sm font-bold text-slate-700">{docType}.pdf</span>
                            {docContent && <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100">Ready</Badge>}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" disabled={!docContent}>
                                <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" disabled={!docContent}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-50 p-8 overflow-hidden">
                        {docContent ? (
                            <ScrollArea className="h-full bg-white shadow-sm border p-8 md:px-12 mx-auto max-w-2xl font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">
                                {docContent}
                            </ScrollArea>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300">
                                <Scale className="h-16 w-16 mb-4 opacity-20" />
                                <p>Select parameters to draft a legal document.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
