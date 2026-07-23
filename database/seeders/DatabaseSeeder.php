<?php

namespace Database\Seeders;

use App\Models\Estate;
use App\Models\Payment;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed permissions
        $permissions = [
            ['name' => 'Manage Users', 'slug' => 'manage-users', 'description' => 'Create, edit, and delete users'],
            ['name' => 'Manage Roles', 'slug' => 'manage-roles', 'description' => 'Create, edit, and delete roles'],
            ['name' => 'Manage Estates', 'slug' => 'manage-estates', 'description' => 'Create, edit, and delete estates'],
            ['name' => 'Manage Tenants', 'slug' => 'manage-tenants', 'description' => 'Create, edit, and delete tenants'],
            ['name' => 'Manage Payments', 'slug' => 'manage-payments', 'description' => 'Create, edit, and delete payments'],
            ['name' => 'View Reports', 'slug' => 'view-reports', 'description' => 'View analytics and reports'],
            ['name' => 'Manage Settings', 'slug' => 'manage-settings', 'description' => 'Manage platform settings'],
        ];

        foreach ($permissions as $perm) {
            Permission::create($perm);
        }

        // Seed roles
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'slug' => 'super-admin',
            'description' => 'Full access to all platform features',
        ]);
        $superAdmin->permissions()->sync(Permission::all());

        $admin = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'description' => 'Can manage most platform features',
        ]);
        $admin->permissions()->sync(
            Permission::whereIn('slug', ['manage-estates', 'manage-tenants', 'manage-payments', 'view-reports'])->pluck('id')
        );

        $manager = Role::create([
            'name' => 'Manager',
            'slug' => 'manager',
            'description' => 'Limited access to estate management',
        ]);
        $manager->permissions()->sync(
            Permission::whereIn('slug', ['manage-tenants', 'manage-payments', 'view-reports'])->pluck('id')
        );

        // Create super admin user
        $adminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@estatepay.ng',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);
        $adminUser->roles()->attach($superAdmin);

        // Create demo estate manager
        $demoUser = User::factory()->create([
            'name' => 'Demo User',
            'email' => 'demo@estatepay.ng',
            'password' => 'password',
        ]);

        // Create an admin user
        $adminManager = User::create([
            'name' => 'Admin Manager',
            'email' => 'manager@estatepay.ng',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);
        $adminManager->roles()->attach($admin);

        // Seed demo estate data
        $estate = Estate::create([
            'user_id' => $demoUser->id,
            'name' => 'Royalty Estate',
            'address' => 'Alagbole, Ogun State',
            'units_count' => 15,
            'monthly_dues_amount' => 15000,
            'chairman_name' => 'Chief Adekunle',
            'chairman_phone' => '08012345678',
            'chairman_email' => null,
            'subscription_status' => 'trial',
            'subscription_trial_ends_at' => now()->addDays(30),
        ]);

        $tenants = [
            ['name' => 'Adebayo Johnson', 'phone' => '08023456789', 'apartment_number' => 'A1', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Chioma Okwu', 'phone' => '08034567890', 'apartment_number' => 'A2', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Tunde Williams', 'phone' => '08045678901', 'apartment_number' => 'A3', 'rent_amount' => 12000, 'status' => 'active'],
            ['name' => 'Fatima Abubakar', 'phone' => '08056789012', 'apartment_number' => 'B1', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Emeka Nwosu', 'phone' => '08067890123', 'apartment_number' => 'B2', 'rent_amount' => 12000, 'status' => 'active'],
            ['name' => 'Aisha Bello', 'phone' => '08078901234', 'apartment_number' => 'B3', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Oluwaseun Adeyemi', 'phone' => '08089012345', 'apartment_number' => 'C1', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Ngozi Okafor', 'phone' => '08090123456', 'apartment_number' => 'C2', 'rent_amount' => 12000, 'status' => 'active'],
            ['name' => 'Ibrahim Yusuf', 'phone' => '08101234567', 'apartment_number' => 'C3', 'rent_amount' => 15000, 'status' => 'active'],
            ['name' => 'Blessing Eze', 'phone' => '08112345678', 'apartment_number' => 'D1', 'rent_amount' => 15000, 'status' => 'inactive'],
            ['name' => 'Kola Daramola', 'phone' => '08123456789', 'apartment_number' => 'D2', 'rent_amount' => 12000, 'status' => 'active'],
            ['name' => 'Yetunde Balogun', 'phone' => '08134567890', 'apartment_number' => 'D3', 'rent_amount' => 15000, 'status' => 'active'],
        ];

        $period = now()->format('Y-m');

        foreach ($tenants as $tenantData) {
            $tenant = $estate->tenants()->create($tenantData);

            if ($tenant->status === 'active' && rand(1, 10) > 3) {
                Payment::create([
                    'tenant_id' => $tenant->id,
                    'estate_id' => $estate->id,
                    'amount' => $tenant->rent_amount,
                    'period' => $period,
                    'status' => 'paid',
                    'payment_method' => ['bank_transfer', 'paystack', 'cash', 'pos'][rand(0, 3)],
                    'transaction_reference' => 'TXN-' . strtoupper(bin2hex(random_bytes(4))),
                    'paid_at' => now()->subDays(rand(0, 5)),
                ]);
            }
        }
    }
}
