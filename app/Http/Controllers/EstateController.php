<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EstateController extends Controller
{
    public function index()
    {
        $estates = Estate::withCount('tenants')->latest()->get();

        return Inertia::render('Estates/Index', [
            'estates' => $estates,
        ]);
    }

    public function create()
    {
        return Inertia::render('Estates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'units_count' => 'required|integer|min:1',
            'monthly_dues_amount' => 'required|numeric|min:0',
            'chairman_name' => 'required|string|max:255',
            'chairman_phone' => 'required|string|max:20',
            'chairman_email' => 'nullable|email|max:255',
        ]);

        $estate = Auth::user()->estate()->create([
            ...$validated,
            'subscription_status' => 'trial',
            'subscription_trial_ends_at' => now()->addDays(30),
        ]);

        return redirect()->route('estates.show', $estate)
            ->with('success', 'Estate created successfully. Your 30-day free trial has started!');
    }

    public function show(Estate $estate)
    {
        $this->authorizeEstate($estate);

        $estate->load(['tenants' => function ($query) {
            $query->with('currentPayment')->orderBy('apartment_number');
        }]);

        $period = now()->format('Y-m');
        $paidCount = $estate->payments()
            ->where('period', $period)
            ->where('status', 'paid')
            ->distinct('tenant_id')
            ->count('tenant_id');
        $totalTenants = $estate->tenants()->where('status', 'active')->count();

        return Inertia::render('Estates/Show', [
            'estate' => $estate,
            'paidCount' => $paidCount,
            'totalTenants' => $totalTenants,
        ]);
    }

    public function edit(Estate $estate)
    {
        $this->authorizeEstate($estate);

        return Inertia::render('Estates/Edit', [
            'estate' => $estate,
        ]);
    }

    public function update(Request $request, Estate $estate)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'units_count' => 'required|integer|min:1',
            'monthly_dues_amount' => 'required|numeric|min:0',
            'chairman_name' => 'required|string|max:255',
            'chairman_phone' => 'required|string|max:20',
            'chairman_email' => 'nullable|email|max:255',
        ]);

        $estate->update($validated);

        return redirect()->route('estates.show', $estate)
            ->with('success', 'Estate updated successfully.');
    }

    public function destroy(Estate $estate)
    {
        $this->authorizeEstate($estate);

        $estate->delete();

        return redirect()->route('estates.index')
            ->with('success', 'Estate deleted successfully.');
    }

    private function authorizeEstate(Estate $estate): void
    {
        if ($estate->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
