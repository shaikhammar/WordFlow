<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Entry;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DashboardSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $this->command->error("No user found! Please register a user first.");
            return;
        }

        // Streak: 5 days ending yesterday
        for ($i = 5; $i > 0; $i--) {
            Entry::forceCreate([
                'user_id' => $user->id,
                'title' => 'Streak Entry ' . $i,
                'content' => str_repeat('word ', 501),
                'word_count' => 501,
                'daily_goal_met' => true,
                'created_at' => Carbon::now()->subDays($i),
                'updated_at' => Carbon::now()->subDays($i),
            ]);
        }

        // Today's entry (met goal)
        Entry::create([
            'user_id' => $user->id,
            'title' => 'Today Entry',
            'content' => str_repeat('word ', 600),
            'word_count' => 600,
            'daily_goal_met' => true,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Last Month Entry
        Entry::create([
            'user_id' => $user->id,
            'title' => 'Last Month Entry',
            'content' => str_repeat('word ', 800),
            'word_count' => 800,
            'daily_goal_met' => true,
            'created_at' => Carbon::now()->subMonth(),
            'updated_at' => Carbon::now()->subMonth(),
        ]);

        // Random entries in the year
        Entry::create([
            'user_id' => $user->id,
            'title' => 'Year Entry',
            'content' => str_repeat('word ', 300),
            'word_count' => 300,
            'daily_goal_met' => false,
            'created_at' => Carbon::now()->subMonths(3),
            'updated_at' => Carbon::now()->subMonths(3),
        ]);

        $this->command->info("Dashboard stats seeded for user: " . $user->email);
    }
}
