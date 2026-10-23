<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * An explicit company level override for a platform feature.
 *
 * A plan grants a set of features. When a company deviates from its plan the
 * override stored here wins.
 */
class CompanyFeaturePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'feature',
        'enabled',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
