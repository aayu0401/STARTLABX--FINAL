'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, Image as ImageIcon, Check, CheckCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn, formatDate } from '@/lib/utils';
import { chatService } from '@/services/chat.service';

interface Conversation {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string;
        title: string;
        online: boolean;
    };
    lastMessage: {
        content: string;
        timestamp: string;
        read: boolean;
        fromMe: boolean;
    };
    unreadCount: number;
}

interface Message {
    id: string;
    content: string;
    timestamp: string;
    fromMe: boolean;
    read: boolean;
    type: 'text' | 'image' | 'file';
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversations();
        // Connect to WebSocket
        // chatService.connect();

        return () => {
            // chatService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation);
        }
    }, [selectedConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = () => {
        // Mock data - replace with actual API call
        setConversations(generateMockConversations());
    };

    const loadMessages = (conversationId: string) => {
        // Mock data - replace with actual API call
        setMessages(generateMockMessages());
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedConversation) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: messageInput,
            timestamp: new Date().toISOString(),
            fromMe: true,
            read: false,
            type: 'text',
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');

        // Send via WebSocket
        // chatService.sendMessage(selectedConversation, messageInput);
    };

    const filteredConversations = conversations.filter(conv =>
        conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.user.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeConversation = conversations.find(c => c.id === selectedConversation);

    return (
        <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-6 h-full max-w-7xl">
                <div className="grid grid-cols-12 gap-6 h-full">
                    {/* Conversations List */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col h-full">
                        <Card glass className="flex-1 flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                                <h2 className="text-2xl font-bold text-gradient-primary mb-4">Messages</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search conversations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Conversations */}
                            <div className="flex-1 overflow-y-auto scrollbar-thin">
                                {filteredConversations.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>No conversations found</p>
                                    </div>
                                ) : (
                                    filteredConversations.map((conversation) => (
                                        <div
                                            key={conversation.id}
                                            onClick={() => setSelectedConversation(conversation.id)}
                                            className={cn(
                                                'p-4 border-b cursor-pointer transition-all hover:bg-muted/50',
                                                selectedConversation === conversation.id && 'bg-primary/10 border-l-4 border-l-primary'
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="relative">
                                                    <Avatar size="md">
                                                        <AvatarImage src={conversation.user.avatar} />
                                                        <AvatarFallback name={conversation.user.name} />
                                                    </Avatar>
                                                    {conversation.user.online && (
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-semibold text-sm truncate">
                                                            {conversation.user.name}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatDate(conversation.lastMessage.timestamp, true)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate mb-1">
                                                        {conversation.user.title}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <p className={cn(
                                                            'text-sm truncate flex-1',
                                                            !conversation.lastMessage.read && !conversation.lastMessage.fromMe
                                                                ? 'font-semibold text-foreground'
                                                                : 'text-muted-foreground'
                                                        )}>
                                                            {conversation.lastMessage.fromMe && 'You: '}
                                                            {conversation.lastMessage.content}
                                                        </p>
                                                        {conversation.unreadCount > 0 && (
                                                            <Badge variant="gradient" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                                                {conversation.unreadCount}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Chat Area */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
                        {selectedConversation && activeConversation ? (
                            <Card glass className="flex-1 flex flex-col overflow-hidden">
                                {/* Chat Header */}
                                <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar size="md">
                                                    <AvatarImage src={activeConversation.user.avatar} />
                                                    <AvatarFallback name={activeConversation.user.name} />
                                                </Avatar>
                                                {activeConversation.user.online && (
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{activeConversation.user.name}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {activeConversation.user.online ? 'Active now' : 'Offline'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Phone className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Video className="h-5 w-5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                                                    <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                                    {messages.map((message, index) => {
                                        const showAvatar = index === 0 || messages[index - 1].fromMe !== message.fromMe;
                                        const showTimestamp = index === messages.length - 1 ||
                                            messages[index + 1].fromMe !== message.fromMe;

                                        return (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    'flex gap-3 fade-in',
                                                    message.fromMe && 'flex-row-reverse'
                                                )}
                                            >
                                                {showAvatar ? (
                                                    <Avatar size="sm" className={cn(!message.fromMe && 'order-first')}>
                                                        {!message.fromMe && (
                                                            <>
                                                                <AvatarImage src={activeConversation.user.avatar} />
                                                                <AvatarFallback name={activeConversation.user.name} />
                                                            </>
                                                        )}
                                                        {message.fromMe && <AvatarFallback name="You" />}
                                                    </Avatar>
                                                ) : (
                                                    <div className="w-8" />
                                                )}
                                                <div className={cn('flex flex-col gap-1 max-w-[70%]', message.fromMe && 'items-end')}>
                                                    <div
                                                        className={cn(
                                                            'rounded-2xl px-4 py-2 break-words',
                                                            message.fromMe
                                                                ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground'
                                                                : 'bg-muted'
                                                        )}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                    </div>
                                                    {showTimestamp && (
                                                        <div className={cn(
                                                            'flex items-center gap-1 text-xs text-muted-foreground px-2',
                                                            message.fromMe && 'flex-row-reverse'
                                                        )}>
                                                            <span>{formatDate(message.timestamp, true)}</span>
                                                            {message.fromMe && (
                                                                message.read ? (
                                                                    <CheckCheck className="h-3 w-3 text-primary" />
                                                                ) : (
                                                                    <Check className="h-3 w-3" />
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-4 border-t bg-muted/30">
                                    <div className="flex items-end gap-2">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                                <Paperclip className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                                <ImageIcon className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <div className="flex-1 relative">
                                            <Textarea
                                                placeholder="Type a message..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                className="min-h-[44px] max-h-32 resize-none pr-10"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 bottom-2 h-8 w-8"
                                            >
                                                <Smile className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="gradient"
                                            size="icon"
                                            className="h-10 w-10"
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card glass className="flex-1 flex items-center justify-center">
                                <div className="text-center text-muted-foreground p-8">
                                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <Send className="h-12 w-12 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                                    <p className="text-sm">Choose a conversation from the list to start messaging</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mock data generators
function generateMockConversations(): Conversation[] {
    return [
        {
            id: '1',
            user: {
                id: '1',
                name: 'Sarah Chen',
                avatar: '',
                title: 'Product Designer @ TechCorp',
                online: true,
            },
            lastMessage: {
                content: 'That sounds great! When can we schedule a call?',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
                read: false,
                fromMe: false,
            },
            unreadCount: 2,
        },
        {
            id: '2',
            user: {
                id: '2',
                name: 'Alex Kumar',
                avatar: '',
                title: 'Full Stack Developer',
                online: true,
            },
            lastMessage: {
                content: 'Thanks for the opportunity!',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                read: true,
                fromMe: true,
            },
            unreadCount: 0,
        },
        {
            id: '3',
            user: {
                id: '3',
                name: 'Emma Wilson',
                avatar: '',
                title: 'Marketing Lead @ StartupX',
                online: false,
            },
            lastMessage: {
                content: 'I\'d love to collaborate on this project',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                read: false,
                fromMe: false,
            },
            unreadCount: 1,
        },
    ];
}

function generateMockMessages(): Message[] {
    return [
        {
            id: '1',
            content: 'Hey! I saw your post about looking for a co-founder',
            timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            fromMe: false,
            read: true,
            type: 'text',
        },
        {
            id: '2',
            content: 'Hi! Yes, we\'re actively looking for someone with your background',
            timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
            fromMe: true,
            read: true,
            type: 'text',
        },
        {
            id: '3',
            content: 'I have 5 years of experience in ML/AI and I\'m really passionate about sustainable tech',
            timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
            fromMe: false,
            read: true,
            type: 'text',
        },
        {
            id: '4',
            content: 'That\'s perfect! Would you be interested in a call to discuss the opportunity?',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            fromMe: true,
            read: true,
            type: 'text',
        },
        {
            id: '5',
            content: 'That sounds great! When can we schedule a call?',
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            fromMe: false,
            read: false,
            type: 'text',
        },
    ];
}
