'use client';

import React, { useState } from 'react';
import { FileSignature, Loader2, Download, Send, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import contractService, { Contract, AIContractRequest } from '@/services/contract.service';

const contractTypes = [
    { value: 'equity_agreement', label: 'Equity Agreement', description: 'For equity-based compensation' },
    { value: 'employment', label: 'Employment Contract', description: 'Full-time employment' },
    { value: 'freelance', label: 'Freelance Agreement', description: 'Project-based work' },
    { value: 'nda', label: 'Non-Disclosure Agreement', description: 'Protect confidential information' },
    { value: 'advisor_agreement', label: 'Advisor Agreement', description: 'For advisors and mentors' },
    { value: 'co_founder', label: 'Co-Founder Agreement', description: 'Founding team agreements' }
];

const compensationTypes = [
    { value: 'equity', label: 'Equity Only' },
    { value: 'salary', label: 'Salary Only' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'hybrid', label: 'Hybrid (Equity + Cash)' }
];

export function ContractGenerator() {
    const [contract, setContract] = useState<Contract | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState<AIContractRequest>({
        type: 'equity_agreement',
        role: '',
        compensation: {
            type: 'equity',
            amount: 0,
            equity: 0,
            currency: 'USD'
        },
        duration: '',
        responsibilities: [''],
        additionalTerms: []
    });

    const handleAddResponsibility = () => {
        setFormData({
            ...formData,
            responsibilities: [...formData.responsibilities, '']
        });
    };

    const handleResponsibilityChange = (index: number, value: string) => {
        const newResponsibilities = [...formData.responsibilities];
        newResponsibilities[index] = value;
        setFormData({ ...formData, responsibilities: newResponsibilities });
    };

    const handleGenerate = async () => {
        if (!formData.role) return;

        setIsGenerating(true);
        try {
            const generated = await contractService.generateContract({
                ...formData,
                responsibilities: formData.responsibilities.filter(r => r.trim())
            });
            setContract(generated);
        } catch (error) {
            console.error('Failed to generate contract:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendForSignature = async () => {
        if (!contract) return;

        try {
            await contractService.sendForSignature(contract.id, contract.parties.map(p => p.id));
            alert('Contract sent for signature!');
        } catch (error) {
            console.error('Failed to send contract:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Generation Form */}
            {!contract && (
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileSignature className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">AI Contract Generator</h3>
                            <p className="text-sm text-gray-600">Generate professional contracts in seconds</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Contract Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Contract Type *</label>
                            <div className="grid grid-cols-2 gap-2">
                                {contractTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFormData({ ...formData, type: type.value as any })}
                                        className={`p-3 border rounded-lg text-left transition-colors ${formData.type === type.value
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{type.label}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{type.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Role/Position */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Role/Position *</label>
                            <Input
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                placeholder="e.g., Senior Full-Stack Developer, CTO, Advisor"
                            />
                        </div>

                        {/* Compensation Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Compensation Type *</label>
                            <div className="grid grid-cols-4 gap-2">
                                {compensationTypes.map((type) => (
                                    <Button
                                        key={type.value}
                                        variant={formData.compensation.type === type.value ? 'gradient' : 'outline'}
                                        size="sm"
                                        onClick={() => setFormData({
                                            ...formData,
                                            compensation: { ...formData.compensation, type: type.value as any }
                                        })}
                                    >
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Compensation Details */}
                        <div className="grid grid-cols-2 gap-4">
                            {(formData.compensation.type === 'equity' || formData.compensation.type === 'hybrid') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Equity Percentage (%)</label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        value={formData.compensation.equity}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            compensation: { ...formData.compensation, equity: parseFloat(e.target.value) }
                                        })}
                                    />
                                </div>
                            )}

                            {(formData.compensation.type === 'salary' || formData.compensation.type === 'hybrid') && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Annual Salary (USD)</label>
                                    <Input
                                        type="number"
                                        value={formData.compensation.amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            compensation: { ...formData.compensation, amount: parseInt(e.target.value) }
                                        })}
                                    />
                                </div>
                            )}

                            {formData.compensation.type === 'hourly' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Hourly Rate (USD)</label>
                                    <Input
                                        type="number"
                                        value={formData.compensation.amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            compensation: { ...formData.compensation, amount: parseInt(e.target.value) }
                                        })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Duration (Optional)</label>
                            <Input
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g., 1 year, 6 months, Indefinite"
                            />
                        </div>

                        {/* Responsibilities */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Key Responsibilities</label>
                            {formData.responsibilities.map((resp, index) => (
                                <Input
                                    key={index}
                                    value={resp}
                                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                                    placeholder={`Responsibility ${index + 1}`}
                                    className="mb-2"
                                />
                            ))}
                            <Button variant="outline" size="sm" onClick={handleAddResponsibility}>
                                + Add Responsibility
                            </Button>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={!formData.role || isGenerating}
                            className="w-full gradient-primary"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Contract...
                                </>
                            ) : (
                                <>
                                    <FileSignature className="w-4 h-4 mr-2" />
                                    Generate Contract
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Contract Display */}
            {contract && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">{contract.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="glass">{contract.type.replace('_', ' ')}</Badge>
                                <Badge variant={contract.status === 'signed' ? 'default' : 'glass'}>
                                    {contract.status.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                            {contract.status === 'draft' && (
                                <Button className="gradient-primary" onClick={handleSendForSignature}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send for Signature
                                </Button>
                            )}
                            <Button variant="outline" onClick={() => setContract(null)}>
                                New Contract
                            </Button>
                        </div>
                    </div>

                    {/* Contract Content */}
                    <Card className="p-8 bg-white dark:bg-gray-900">
                        <div className="prose dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                                {contract.content}
                            </pre>
                        </div>
                    </Card>

                    {/* Parties */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Contract Parties</h4>
                        <div className="space-y-3">
                            {contract.parties.map((party) => (
                                <div
                                    key={party.id}
                                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                    <div>
                                        <div className="font-medium">{party.name}</div>
                                        <div className="text-sm text-gray-600">{party.email}</div>
                                        <Badge variant="glass" className="text-xs mt-1">{party.role}</Badge>
                                    </div>
                                    <div>
                                        {party.signed ? (
                                            <Badge variant="default" className="bg-green-500">
                                                ✓ Signed
                                            </Badge>
                                        ) : (
                                            <Badge variant="glass">
                                                Pending
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
