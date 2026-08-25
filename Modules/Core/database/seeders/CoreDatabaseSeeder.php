<?php

namespace Modules\Core\Database\Seeders;

use Illuminate\Database\Seeder;

class CoreDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            RolePermissionSeeder::class,
            AdminUserSeeder::class,
            OwnerUserSeeder::class,
            DemoAccountsSeeder::class,
            MenuSeeder::class,
        ]);
    }
}
