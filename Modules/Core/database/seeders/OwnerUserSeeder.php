<?php

namespace Modules\Core\Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * حساب مالك المنصّة — أعلى من السوبر أدمن.
 *
 * الفرق بينه وبين السوبر أدمن صلاحية واحدة: «manage platform». بيها بيشوف
 * حسابات المالكين ويعدّل عليها ويوزّع الدور، ومن غيرها الحساب ده مخفي
 * تمامًا — مش بيبان في قايمة المستخدمين ولا بيتفتح بالرابط المباشر.
 *
 * firstOrCreate زي AdminUserSeeder: كلمة المرور بتتحط عند الإنشاء بس،
 * فإعادة تشغيل السيدر مبترجّعش كلمة مرور اتغيّرت من اللوحة.
 */
class OwnerUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('OWNER_EMAIL', 'shalabybsn6@gmail.com');
        $exists = User::where('email', $email)->exists();

        $password = env('OWNER_PASSWORD') ?: Str::password(18, symbols: false);

        $owner = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('OWNER_NAME', 'مالك المنصّة'),
                'password' => $password,
                'is_active' => true,
            ],
        );

        if ($exists) {
            // الحساب موجود: بنضمن الدور بس من غير ما نلمس كلمة المرور
            if (! $owner->hasRole(RolePermissionSeeder::OWNER_ROLE)) {
                $owner->syncRoles([RolePermissionSeeder::OWNER_ROLE]);
                $this->command?->info("  {$email} — تمت ترقيته إلى مالك المنصّة");

                return;
            }

            $this->command?->info("  مالك المنصّة موجود ({$email}) — لم تتغيّر كلمة المرور.");

            return;
        }

        $owner->syncRoles([RolePermissionSeeder::OWNER_ROLE]);

        $this->command?->warn("  أُنشئ مالك المنصّة: {$email}");
        $this->command?->warn("  كلمة المرور: {$password}");
        $this->command?->warn('  احفظها الآن — لن تُعرض مرة أخرى.');
    }
}
