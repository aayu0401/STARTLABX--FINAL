'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Rocket, Users, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface OnboardingStep {
    id: number;
    title: string;
    description: string;
    icon: any;
    completed: boolean;
}

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        userType: '',
        companyName: '',
        role: '',
        industry: '',
        goals: [] as string[]
    });

    const [steps, setSteps] = useState<OnboardingStep[]>([
        {
            id: 0,
            title: 'Welcome to STARTLABX',
            description: 'Let\'s get you set up in just a few steps',
            icon: Sparkles,
            completed: false
        },
        {
            id: 1,
            title: 'Choose Your Path',
            description: 'Are you a startup founder or a professional?',
            icon: Users,
            completed: false
        },
        {
            id: 2,
            title: 'Tell Us About You',
            description: 'Help us personalize your experience',
            icon: FileText,
            completed: false
        },
        {
            id: 3,
            title: 'Set Your Goals',
            description: 'What do you want to achieve?',
            icon: Rocket,
            completed: false
        }
    ]);

    const goals = [
        'Validate my startup idea',
        'Create a pitch deck',
        'Plan my MVP',
        'Find co-founders',
        'Hire team members',
        'Raise funding',
        'Find equity opportunities',
        'Build my network'
    ];

    const handleNext = () => {
        const newSteps = [...steps];
        newSteps[currentStep].completed = true;
        setSteps(newSteps);

        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handleGoalToggle = (goal: string) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: return true;
            case 1: return formData.userType !== '';
            case 2: return formData.companyName !== '' && formData.industry !== '';
            case 3: return formData.goals.length > 0;
            default: return false;
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full p-8 relative">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
                        <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Content */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            {React.createElement(steps[currentStep].icon, { className: 'w-6 h-6 text-white' })}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
                            <p className="text-gray-600">{steps[currentStep].description}</p>
                        </div>
                    </div>

                    {/* Step 0: Welcome */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <p className="text-lg">
                                Welcome! We're excited to help you build your startup or advance your career.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10">
                                    <h3 className="font-semibold mb-2">For Startups</h3>
                                    <ul className="text-sm space-y-1 text-gray-600">
                                        <li>• Validate ideas with AI</li>
                                        <li>• Generate pitch decks</li>
                                        <li>• Plan your MVP</li>
                                        <li>• Hire team members</li>
                                    </ul>
                                </Card>
                                <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10">
                                    <h3 className="font-semibold mb-2">For Professionals</h3>
                                    <ul className="text-sm space-y-1 text-gray-600">
                                        <li>• Find equity opportunities</li>
                                        <li>• Showcase your skills</li>
                                        <li>• Build your network</li>
                                        <li>• Get AI career guidance</li>
                                    </ul>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Step 1: User Type */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, userType: 'startup' })}
                                    className={`p-6 border-2 rounded-lg transition-all ${formData.userType === 'startup'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-300 hover:border-primary'
                                        }`}
                                >
                                    <Rocket className="w-12 h-12 mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold mb-1">Startup Founder</h3>
                                    <p className="text-sm text-gray-600">Building a company</p>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, userType: 'professional' })}
                                    className={`p-6 border-2 rounded-lg transition-all ${formData.userType === 'professional'
                                            ? 'border-primary bg-primary/10'
                                            : 'border-gray-300 hover:border-primary'
                                        }`}
                                >
                                    <Users className="w-12 h-12 mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold mb-1">Professional</h3>
                                    <p className="text-sm text-gray-600">Seeking opportunities</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: About You */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {formData.userType === 'startup' ? 'Company Name' : 'Your Name'}
                                </label>
                                <Input
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder={formData.userType === 'startup' ? 'Enter company name' : 'Enter your name'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {formData.userType === 'startup' ? 'Industry' : 'Your Role'}
                                </label>
                                <Input
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    placeholder={formData.userType === 'startup' ? 'e.g., FinTech, HealthTech' : 'e.g., Full-Stack Developer'}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goals */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Select all that apply:</p>
                            <div className="grid grid-cols-2 gap-3">
                                {goals.map((goal) => (
                                    <button
                                        key={goal}
                                        onClick={() => handleGoalToggle(goal)}
                                        className={`p-3 border-2 rounded-lg text-left transition-all ${formData.goals.includes(goal)
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.goals.includes(goal) ? 'border-primary bg-primary' : 'border-gray-300'
                                                }`}>
                                                {formData.goals.includes(goal) && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <span className="text-sm">{goal}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between">
                    {currentStep > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Back
                        </Button>
                    )}
                    <div className="flex-1" />
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="gradient-primary"
                    >
                        {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </Card>
        </div>
    );
}
