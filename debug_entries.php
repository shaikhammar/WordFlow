<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$entries = \App\Models\Entry::where('daily_goal_met', true)
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function ($e) {
        return $e->created_at->format('Y-m-d') . ' (' . $e->title . ')';
    });

$entries->each(function ($e) {
    echo $e . PHP_EOL;
});
