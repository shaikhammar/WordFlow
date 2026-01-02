
import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { format, isSameDay, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

interface Entry {
    id: number;
    title: string;
    date: string;
    created_at: string;
    daily_goal_met: boolean;
    word_count: number;
}

interface Props {
    entries: Entry[];
    filters?: {
        search?: string;
    };
}

export default function EntriesIndex({ entries, filters }: Props) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [search, setSearch] = useState(filters?.search || '');
    const [debouncedSearch] = useDebounce(search, 300);

    // Initial search effect
    useEffect(() => {
        if (debouncedSearch !== (filters?.search || '')) {
            router.get(
                '/entries',
                { search: debouncedSearch },
                { preserveState: true, replace: true }
            );
        }
    }, [debouncedSearch]);

    // Create a set of dates that have entries for efficient lookup
    const entryDates = entries.map(entry => parseISO(entry.created_at));

    // Filter entries for the selected date (only if NOT searching)
    // If searching, we show ALL matching entries regardless of date
    const displayEntries = search
        ? entries
        : (date
            ? entries.filter(entry => isSameDay(parseISO(entry.created_at), date))
            : []);

    return (
        <AppLayout breadcrumbs={[
            { title: 'Entries', href: '/entries' },
        ]}>
            <Head title="Entries" />

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-3 h-fit">
                        <CardHeader>
                            <CardTitle>Calendar</CardTitle>
                            <CardDescription>
                                Select a date or search to find entries.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search entries..."
                                    className="pl-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(d) => {
                                        setDate(d);
                                        setSearch(''); // Clear search when picking a date
                                    }}
                                    className="rounded-md border"
                                    modifiers={{
                                        hasEntry: entryDates
                                    }}
                                    modifiersStyles={{
                                        hasEntry: {
                                            fontWeight: 'bold',
                                            textDecoration: 'underline',
                                            color: 'var(--primary)'
                                        }
                                    }}
                                />
                            </div>
                            <Button asChild className="w-full">
                                <Link href="/entries/create">New Entry</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>
                                {search
                                    ? `Search Results for "${search}"`
                                    : `Entries for ${date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}`
                                }
                            </CardTitle>
                            <CardDescription>
                                {displayEntries.length} {displayEntries.length === 1 ? 'entry' : 'entries'} found.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {displayEntries.length > 0 ? (
                                    displayEntries.map((entry) => (
                                        <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <Link href={`/entries/${entry.id}`} className="font-medium hover:underline block">
                                                    {entry.title || 'Untitled Entry'}
                                                </Link>
                                                <div className="text-sm text-muted-foreground">
                                                    {format(parseISO(entry.created_at), 'MMM d, yyyy')} • {entry.word_count} words
                                                </div>
                                            </div>
                                            {entry.daily_goal_met && (
                                                <Badge variant="secondary">Goal Met</Badge>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        {search
                                            ? 'No entries match your search.'
                                            : 'No entries found for this date.'}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
