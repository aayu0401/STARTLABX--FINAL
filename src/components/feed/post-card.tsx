'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate, formatNumber, cn } from '@/lib/utils';
import type { Post } from '@/services/post.service';

interface PostCardProps {
    post: Post;
    onLike?: (postId: string) => void;
    onComment?: (postId: string, content: string) => void;
    onShare?: (postId: string) => void;
    onSave?: (postId: string) => void;
}

const POST_TYPE_CONFIG = {
    UPDATE: { icon: '📢', label: 'Update', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    OPPORTUNITY: { icon: '💼', label: 'Opportunity', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    INSIGHT: { icon: '💡', label: 'Insight', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    QUESTION: { icon: '❓', label: 'Question', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
    ACHIEVEMENT: { icon: '🎉', label: 'Achievement', color: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
};

export function PostCard({ post, onLike, onComment, onShare, onSave }: PostCardProps) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isLiked, setIsLiked] = useState(post.isLiked || false);
    const [isSaved, setIsSaved] = useState(post.isSaved || false);
    const [likesCount, setLikesCount] = useState(post.likesCount);

    const typeConfig = POST_TYPE_CONFIG[post.type];

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        onLike?.(post.id);
    };

    const handleComment = () => {
        if (commentText.trim()) {
            onComment?.(post.id, commentText);
            setCommentText('');
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
        onSave?.(post.id);
    };

    return (
        <Card hover className="overflow-hidden fade-in">
            {/* Header */}
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar size="md" className="cursor-pointer hover:ring-4 hover:ring-primary/20">
                            <AvatarImage src={post.user?.avatar} />
                            <AvatarFallback name={post.user?.name || 'User'} />
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors">
                                    {post.user?.name}
                                </h4>
                                <Badge variant="outline" className={cn('text-xs', typeConfig.color)}>
                                    {typeConfig.icon} {typeConfig.label}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {post.user?.title} • {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save post</DropdownMenuItem>
                            <DropdownMenuItem>Copy link</DropdownMenuItem>
                            <DropdownMenuItem>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="space-y-4 pb-3">
                {post.title && (
                    <h3 className="text-lg font-semibold leading-tight">{post.title}</h3>
                )}

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </p>

                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.hashtags.map((tag, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Media */}
                {post.media && post.media.length > 0 && (
                    <div className={cn(
                        'grid gap-2 rounded-xl overflow-hidden',
                        post.media.length === 1 && 'grid-cols-1',
                        post.media.length === 2 && 'grid-cols-2',
                        post.media.length >= 3 && 'grid-cols-2'
                    )}>
                        {post.media.slice(0, 4).map((media, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group',
                                    post.media.length === 3 && index === 0 && 'col-span-2'
                                )}
                            >
                                {media.type === 'IMAGE' ? (
                                    <img
                                        src={media.url}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : media.type === 'VIDEO' ? (
                                    <div className="w-full h-full flex items-center justify-center bg-black/5">
                                        <Video className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="h-12 w-12 text-muted-foreground" />
                                    </div>
                                )}
                                {index === 3 && post.media.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">+{post.media.length - 4}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="hover:text-primary cursor-pointer transition-colors">
                        {formatNumber(likesCount)} likes
                    </span>
                    <span className="hover:text-primary cursor-pointer transition-colors">
                        {formatNumber(post.commentsCount)} comments
                    </span>
                    <span className="hover:text-primary cursor-pointer transition-colors">
                        {formatNumber(post.sharesCount)} shares
                    </span>
                    <span className="ml-auto">{formatNumber(post.viewsCount)} views</span>
                </div>
            </CardContent>

            {/* Actions */}
            <CardFooter className="flex items-center gap-2 pt-3 border-t">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'flex-1 gap-2 transition-all',
                        isLiked && 'text-red-500 hover:text-red-600'
                    )}
                    onClick={handleLike}
                >
                    <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                    Like
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle className="h-4 w-4" />
                    Comment
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => onShare?.(post.id)}
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn('transition-all', isSaved && 'text-primary')}
                    onClick={handleSave}
                >
                    <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                </Button>
            </CardFooter>

            {/* Comments Section */}
            {showComments && (
                <div className="border-t bg-muted/30 p-4 space-y-4 slide-in-from-top-2">
                    {/* Comment Input */}
                    <div className="flex gap-3">
                        <Avatar size="sm">
                            <AvatarFallback name="You" />
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                            <Textarea
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="min-h-[60px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleComment();
                                    }
                                }}
                            />
                            <Button
                                size="icon"
                                variant="gradient"
                                onClick={handleComment}
                                disabled={!commentText.trim()}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Sample Comments */}
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-3 fade-in">
                                <Avatar size="sm">
                                    <AvatarFallback name={`User ${i}`} />
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="bg-background rounded-lg p-3">
                                        <p className="text-sm font-semibold">User {i}</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            This is a sample comment. Great post!
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground px-3">
                                        <button className="hover:text-primary transition-colors">Like</button>
                                        <button className="hover:text-primary transition-colors">Reply</button>
                                        <span>{formatDate(new Date().toISOString())}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
}
