<?php

namespace App\Http\Controllers;

use App\Models\Estate;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function index(Estate $estate)
    {
        $this->authorizeEstate($estate);

        $tenants = $estate->tenants()
            ->with('currentPayment')
            ->orderBy('apartment_number')
            ->get();

        return Inertia::render('Tenants/Index', [
            'estate' => $estate,
            'tenants' => $tenants,
        ]);
    }

    public function create(Estate $estate)
    {
        $this->authorizeEstate($estate);

        return Inertia::render('Tenants/Create', [
            'estate' => $estate,
        ]);
    }

    public function store(Request $request, Estate $estate)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'apartment_number' => 'required|string|max:50',
            'rent_amount' => 'required|numeric|min:0',
        ]);

        $tenant = $estate->tenants()->create($validated);

        return redirect()->route('estates.tenants.show', [$estate, $tenant])
            ->with('success', 'Tenant added successfully.');
    }

    public function show(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $tenant->load(['payments' => function ($query) {
            $query->latest('period')->limit(12);
        }]);

        return Inertia::render('Tenants/Show', [
            'estate' => $estate,
            'tenant' => $tenant,
        ]);
    }

    public function edit(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        return Inertia::render('Tenants/Edit', [
            'estate' => $estate,
            'tenant' => $tenant,
        ]);
    }

    public function update(Request $request, Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
            'apartment_number' => 'required|string|max:50',
            'rent_amount' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,moved_out',
        ]);

        $tenant->update($validated);

        return redirect()->route('estates.tenants.show', [$estate, $tenant])
            ->with('success', 'Tenant updated successfully.');
    }

    public function destroy(Estate $estate, Tenant $tenant)
    {
        $this->authorizeEstate($estate);

        $tenant->delete();

        return redirect()->route('estates.tenants.index', $estate)
            ->with('success', 'Tenant removed successfully.');
    }

    private function authorizeEstate(Estate $estate): void
    {
        if ($estate->user_id !== Auth::id()) {
            abort(403);
        }
    }
}
