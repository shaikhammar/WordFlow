<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    private function calculateStreaks($user)
    {
        $dates = $user->entries()
            ->where('daily_goal_met', true)
            ->orderBy('created_at')
            ->get()
            ->groupBy(function ($entry) {
                return $entry->created_at->format('Y-m-d');
            })
            ->keys()
            ->sort()
            ->values();


        $streaks = [];
        $currentStreak = 0;
        $tempStreak = 0;
        $lastDate = null;

        foreach ($dates as $dateString) {
            $date = Carbon::parse($dateString)->startOfDay();

            if ($lastDate && $date->copy()->subDay()->isSameDay($lastDate)) {
                $tempStreak++;
            } else {
                if ($tempStreak > 0) {
                    $streaks[] = $tempStreak;
                }
                $tempStreak = 1;
            }
            $lastDate = $date;
        }
        if ($tempStreak > 0) {
            $streaks[] = $tempStreak;
        }

        $longestStreak = empty($streaks) ? 0 : max($streaks);

        // Check if current streak is active
        if ($lastDate) {
            $daysSinceLast = Carbon::now()->startOfDay()->diffInDays($lastDate);
            if ($daysSinceLast <= 1) {
                $currentStreak = $tempStreak;
            }
        }

        return [$currentStreak, $longestStreak];
    }

    public function index()
    {
        $user = auth()->user();

        list($currentStreak, $longestStreak) = $this->calculateStreaks($user);
        $stats = [
            'words_week' => $user->entries()->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->sum('word_count'),
            'words_month' => $user->entries()->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->sum('word_count'),
            'words_year' => $user->entries()->whereBetween('created_at', [now()->startOfYear(), now()->endOfYear()])->sum('word_count'),
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
        ];
        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
}
