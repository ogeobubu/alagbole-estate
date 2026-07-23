<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Estate;
use App\Models\Payment;
use App\Models\Tenant;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::count(),
                'total_estates' => Estate::count(),
                'total_tenants' => Tenant::count(),
                'total_payments' => Payment::where('status', 'paid')->count(),
                'total_revenue' => Payment::where('status', 'paid')->sum('amount'),
                'active_estates' => Estate::where('subscription_status', 'active')->count(),
                'trial_estates' => Estate::where('subscription_status', 'trial')->count(),
            ],
            'recent_users' => User::latest()
                ->with('roles')
                ->take(10)
                ->get()
                ->map(fn ($user) => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin,
                    'roles' => $user->roles->pluck('name'),
                    'created_at' => $user->created_at,
                ]),
            'recent_payments' => Payment::with(['tenant', 'estate'])
                ->latest()
                ->take(10)
                ->get()
                ->map(fn ($payment) => [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'period' => $payment->period,
                    'tenant_name' => $payment->tenant?->name,
                    'estate_name' => $payment->estate?->name,
                    'paid_at' => $payment->paid_at,
                ]),
        ]);
    }
}
