<?php

namespace Modules\Compounds\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Compounds\Models\Compound;

/**
 * «احفظ المشروع» — نفس سلوك مفضّلة الوحدات بالظبط:
 * زرار واحد بيقلب الحالة والصفحة بترجع مكانها.
 */
class CompoundFavoriteController extends Controller
{
    public function toggle(Request $request, string $locale, int $compound): RedirectResponse
    {
        $project = Compound::where('is_active', true)->findOrFail($compound);

        $result = $request->user()->favoriteCompounds()->toggle([$project->id]);
        $added = $result['attached'] !== [];

        return back()->with('success', $added
            ? ($locale === 'en' ? 'Project saved ✅' : 'تم حفظ المشروع ✅')
            : ($locale === 'en' ? 'Removed from your saved projects' : 'أُزيل من مشاريعك المحفوظة'));
    }
}
