<?php

namespace Modules\Compounds\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Compounds\Models\Compound;
use Modules\Leads\Models\Lead;

/**
 * طلب بروشور مشروع.
 *
 * الرابط مش معروض في الصفحة: الزائر بيسيب اسمه ورقمه الأول، والرد
 * بيرجّع رابط الملف. الطلب بيتسجّل كـ lead بمصدر `brochure` فحتى لو
 * الزائر ما كمّلش تحميل، فريق المبيعات يعرف إنه مهتم بالمشروع ده.
 */
class BrochureController extends Controller
{
    public function __invoke(Request $request, string $locale, int $compound): JsonResponse
    {
        $project = Compound::where('is_active', true)->findOrFail($compound);

        // مصيدة البوتس — نفس اللي في فورم اتصل بنا
        if (filled($request->input('website'))) {
            return response()->json(['url' => null]);
        }

        abort_if(blank($project->brochure_path), 404);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:40'],
            'email' => ['nullable', 'email', 'max:190'],
        ]);

        $user = $request->user();

        Lead::create($data + [
            'source' => 'brochure',
            'status' => 'new',
            'compound_id' => $project->id,
            'owner_id' => $project->owner_id,
            'user_id' => $user && ! $user->ownsListings() ? $user->id : null,
            'message' => $locale === 'en'
                ? "Brochure request — {$project->name}"
                : "طلب بروشور — {$project->name}",
        ]);

        return response()->json([
            'url' => $project->brochure_path,
            'message' => $locale === 'en' ? 'Your brochure is ready ✅' : 'بروشورك جاهز ✅',
        ]);
    }
}
