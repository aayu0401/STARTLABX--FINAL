'use client';

import React, { useState } from 'react';
import { X, Image as ImageIcon, Video, FileText, Smile, Hash, AtSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const POST_TYPES = [
    { value: 'UPDATE', label: 'Update', icon: '📢', description: 'Share news or updates' },
    { value: 'OPPORTUNITY', label: 'Opportunity', icon: '💼', description: 'Post a job or equity offer' },
    { value: 'INSIGHT', label: 'Insight', icon: '💡', description: 'Share knowledge or tips' },
    { value: 'QUESTION', label: 'Question', icon: '❓', description: 'Ask the community' },
    { value: 'ACHIEVEMENT', label: 'Achievement', icon: '🎉', description: 'Celebrate a milestone' },
];

export function CreatePostModal({ open, onClose, onSubmit }: CreatePostModalProps) {
    const [postType, setPostType] = useState('UPDATE');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [hashtagInput, setHashtagInput] = useState('');
    const [visibility, setVisibility] = useState('PUBLIC');

    const handleSubmit = () => {
        onSubmit({
            type: postType,
            title,
            content,
            hashtags,
            visibility,
        });
        handleClose();
    };

    const handleClose = () => {
        setPostType('UPDATE');
        setTitle('');
        setContent('');
        setHashtags([]);
        setHashtagInput('');
        setVisibility('PUBLIC');
        onClose();
    };

    const addHashtag = () => {
        if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
            setHashtags([...hashtags, hashtagInput.trim()]);
            setHashtagInput('');
        }
    };

    const removeHashtag = (tag: string) => {
        setHashtags(hashtags.filter(t => t !== tag));
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create Post</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Post Type Selection */}
                    <div>
                        <label className="text-sm font-medium mb-3 block">Post Type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {POST_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setPostType(type.value)}
                                    className={cn(
                                        'p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 hover:shadow-md',
                                        postType === type.value
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-border bg-background'
                                    )}
                                >
                                    <div className="text-2xl mb-2">{type.icon}</div>
                                    <div className="font-semibold text-sm">{type.label}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title (Optional) */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Title <span className="text-muted-foreground">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Give your post a title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg border border-input bg-background text-base focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Content *</label>
                        <Textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[150px] text-base resize-none"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ImageIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Video className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Smile className="h-4 w-4" />
                                </Button>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {content.length} / 5000
                            </span>
                        </div>
                    </div>

                    {/* Hashtags */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Hashtags</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Add hashtag..."
                                    value={hashtagInput}
                                    onChange={(e) => setHashtagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addHashtag();
                                        }
                                    }}
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>
                            <Button onClick={addHashtag} variant="outline">
                                Add
                            </Button>
                        </div>
                        {hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {hashtags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="gradient"
                                        removable
                                        onRemove={() => removeHashtag(tag)}
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Visibility</label>
                        <Tabs value={visibility} onValueChange={setVisibility}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="PUBLIC">🌍 Public</TabsTrigger>
                                <TabsTrigger value="CONNECTIONS">👥 Connections</TabsTrigger>
                                <TabsTrigger value="PRIVATE">🔒 Private</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="gradient"
                        onClick={handleSubmit}
                        disabled={!content.trim()}
                    >
                        Publish Post
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
