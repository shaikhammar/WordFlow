
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Entry {
    id: number;
    title: string;
    content: string;
    word_count: number;
    daily_goal_met: boolean;
    created_at: string;
}

interface Props {
    entry: Entry;
}

export default function EntriesShow({ entry }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        destroy(`/entries/${entry.id}`);
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Entries', href: '/entries' },
            { title: entry.title || 'Entry', href: `/entries/${entry.id}` },
        ]}>
            <Head title={entry.title} />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="mb-6 flex items-center justify-between">
                        <Button variant="ghost" asChild>
                            <Link href="/entries" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to entries
                            </Link>
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" asChild>
                                <Link href={`/entries/${entry.id}/edit`} className="flex items-center gap-2">
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            entry.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-bold">{entry.title}</CardTitle>
                                    <CardDescription>
                                        {format(parseISO(entry.created_at), 'MMMM d, yyyy h:mm a')}
                                    </CardDescription>
                                </div>
                                {entry.daily_goal_met && (
                                    <Badge variant="secondary" className="text-md py-1 px-3">
                                        Goal Met
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="max-w-none">
                            <div className="prose prose-slate dark:prose-invert text-lg leading-relaxed max-w-full break-words">
                                <ReactMarkdown>
                                    {entry.content}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground border-t pt-6">
                            Word count: {entry.word_count}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
