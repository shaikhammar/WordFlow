<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Entry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EntryDeletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_entry()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $entry = Entry::create([
            'user_id' => $user->id,
            'title' => 'To Delete',
            'content' => 'content',
            'word_count' => 100,
            'daily_goal_met' => false,
        ]);

        $this->assertDatabaseCount('entries', 1);

        $response = $this->delete(route('entries.destroy', $entry));

        $response->assertRedirect(route('entries.index'));
        $this->assertDatabaseCount('entries', 0);
    }
}
