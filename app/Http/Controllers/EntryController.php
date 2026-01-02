<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Requests\UpdateEntryRequest;
use Inertia\Inertia;

class EntryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $query = $request->input('search');

        $entriesQuery = auth()->user()->entries();

        if ($query) {
            // For simple Database Driver usage without complex indexing:
            $entriesQuery->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('content', 'like', "%{$query}%");
            });
        }

        $entries = $entriesQuery
            ->select('id', 'title', 'created_at', 'daily_goal_met', 'word_count')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'title' => $entry->title,
                    'date' => $entry->created_at->format('Y-m-d'),
                    'created_at' => $entry->created_at,
                    'daily_goal_met' => $entry->daily_goal_met,
                    'word_count' => $entry->word_count,
                ];
            });

        return Inertia::render('entries/index', [
            'entries' => $entries,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("entries/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEntryRequest $request)
    {
        $request->user()->entries()->create($request->validated());
        return redirect()->route("entries.index");
    }

    /**
     * Display the specified resource.
     */
    public function show(Entry $entry)
    {
        return Inertia::render("entries/show", [
            "entry" => $entry,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Entry $entry)
    {
        return Inertia::render("entries/edit", [
            "entry" => $entry,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEntryRequest $request, Entry $entry)
    {
        $entry->update($request->validated());
        return redirect()->route("entries.index");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Entry $entry)
    {
        $entry->delete();
        return redirect()->route("entries.index");
    }
}
