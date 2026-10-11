<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_score',
        'bullying_type',
        'severity_level',
        'recommendation',
        'detected_tendencies',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}