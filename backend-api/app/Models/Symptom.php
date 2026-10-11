<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'bullying_type_id',
        'code',
        'question_text'
    ];

    public function bullyingType()
    {
        return $this->belongsTo(BullyingType::class, 'bullying_type_id');
    }
}