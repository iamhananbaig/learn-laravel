<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Trackable;

class Vendor extends Model
{
    use Trackable;

    protected $guarded = ['created_by', 'updated_by'];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
