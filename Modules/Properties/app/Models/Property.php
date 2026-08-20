<?php

namespace Modules\Properties\Models;

use App\Support\Bilingual;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\Compounds\Models\Compound;
use Modules\Locations\Models\Location;

class Property extends Model
{
    use Bilingual;

    protected $fillable = [
        'title', 'title_en', 'location_id', 'compound_id', 'purpose', 'type',
        'price', 'price_en', 'beds', 'baths', 'size', 'ref', 'image', 'sort', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'beds' => 'integer', 'baths' => 'integer', 'size' => 'integer', 'sort' => 'integer',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function compound(): BelongsTo
    {
        return $this->belongsTo(Compound::class);
    }

    public function toCard(string $locale): array
    {
        $ar = $locale !== 'en';

        return [
            'id' => $this->id,
            'title' => $this->t('title', $locale),
            'area' => $this->location?->t('name', $locale) ?? '',
            'purpose' => $this->purpose === 'rent' ? ($ar ? 'إيجار' : 'Rent') : ($ar ? 'بيع' : 'Sale'),
            'price' => $this->t('price', $locale) ?? '',
            'beds' => (int) $this->beds,
            'baths' => (int) $this->baths,
            'size' => (int) $this->size,
            'ref' => $this->ref ?? '',
            'image' => $this->image ?: '/images/demo/property-1.jpg',
        ];
    }
}
