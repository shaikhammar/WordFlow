
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function EntriesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        word_count: 0,
        daily_goal_met: false,
    });

    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        const words = data.content.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;
        setWordCount(count);
        setData(prev => ({
            ...prev,
            word_count: count,
            daily_goal_met: count >= 500
        }));
    }, [data.content]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/entries');
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Entries', href: '/entries' },
            { title: 'Create Entry', href: '/entries/create' },
        ]}>
            <Head title="Create Entry" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle>New Entry</CardTitle>
                        <CardDescription>
                            Write your thoughts. Goal: 500 words.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Entry Title"
                                />
                                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder="Start writing..."
                                    className="min-h-[400px] text-lg leading-relaxed resize-none p-6"
                                />
                                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className={cn(
                                    "text-sm font-medium transition-colors duration-300",
                                    wordCount >= 500 ? "text-green-600" : "text-black"
                                )}>
                                    Word Count: {wordCount} / 500
                                </div>
                                <Button type="submit" disabled={processing}>
                                    Save Entry
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
