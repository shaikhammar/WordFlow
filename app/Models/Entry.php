<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Entry extends Model
{
    use Searchable;
    protected $fillable = [
        'title',
        'content',
        'word_count',
        'daily_goal_met',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
