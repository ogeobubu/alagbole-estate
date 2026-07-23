<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use App\Models\Tenant;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $estate = $user->estate;

        if (!$estate) {
            return Inertia::render('Dashboard', [
                'estate' => null,
                'stats' => null,
                'recentPayments' => [],
            ]);
        }

        $period = now()->format('Y-m');

        $stats = [
            'total_tenants' => $estate->tenants()->where('status', 'active')->count(),
            'paid_count' => $estate->payments()
                ->where('period', $period)
                ->where('status', 'paid')
                ->distinct('tenant_id')
                ->count('tenant_id'),
            'pending_count' => 0,
            'total_collected' => (float) $estate->payments()
                ->where('period', $period)
                ->where('status', 'paid')
                ->sum('amount'),
            'expected_total' => (float) $estate->tenants()
                ->where('status', 'active')
                ->sum('rent_amount'),
        ];
        $stats['pending_count'] = $stats['total_tenants'] - $stats['paid_count'];

        $recentPayments = Payment::where('estate_id', $estate->id)
            ->with('tenant')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Dashboard', [
            'estate' => $estate,
            'stats' => $stats,
            'recentPayments' => $recentPayments,
        ]);
    }
}
