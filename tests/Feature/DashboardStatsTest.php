<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Entry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_streak_calculation_ignores_time_component()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Seed 6 consecutive days
        // Note: Seeder might use Carbon::now() which has time.
        // We simulate entries created at different times of day to ensure we only care about DATE.
        $baseDate = Carbon::now()->subDays(6)->startOfDay();

        for ($i = 0; $i < 6; $i++) {
            Entry::forceCreate([
                'user_id' => $user->id,
                'title' => 'Day ' . $i,
                'content' => 'content',
                'word_count' => 1000,
                'daily_goal_met' => true,
                'created_at' => $baseDate->copy()->addDays($i)->addHours(rand(1, 20)),
            ]);
        }

        // Add a gap day
        // Add another streak of 2 days

        $this->get(route('dashboard'))
            ->assertStatus(200)
            ->assertInertia(
                fn(Assert $page) => $page
                    ->component('dashboard')
                    ->where('stats.longest_streak', 6)
            );
    }
}
