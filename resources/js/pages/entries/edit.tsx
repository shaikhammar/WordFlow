
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Entry {
    id: number;
    title: string;
    content: string;
    word_count: number;
    daily_goal_met: boolean;
}

interface Props {
    entry: Entry;
}

export default function EntriesEdit({ entry }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: entry.title,
        content: entry.content,
        word_count: entry.word_count,
        daily_goal_met: entry.daily_goal_met,
    });

    const [wordCount, setWordCount] = useState(entry.word_count);

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
        put(`/entries/${entry.id}`);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Entries', href: '/entries' },
            { title: entry.title || 'Untitled', href: `/entries/${entry.id}` },
            { title: 'Edit', href: `/entries/${entry.id}/edit` },
        ]}>
            <Head title={`Edit - ${entry.title}`} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle>Edit Entry</CardTitle>
                        <CardDescription>
                            Update your writing. Goal: 500 words.
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
                                    Update Entry
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
