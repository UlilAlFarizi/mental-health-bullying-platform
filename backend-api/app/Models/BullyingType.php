<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BullyingType extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function symptoms()
    {
        return $this->hasMany(Symptom::class, 'bullying_type_id');
    }
}