<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class VendorController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view vendors', only: ['index']),
            new Middleware('permission:create vendors', only: ['store', 'create']),
            new Middleware('permission:edit vendors', only: ['edit', 'update']),
            new Middleware('permission:delete vendors', only: ['delete']),
        ];
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vendors = Vendor::with(['createdBy:id,name', 'updatedBy:id,name'])->orderBy('created_at', 'DESC')->paginate(10);

        return Inertia::render('vendors/list', [
            'vendors' => $vendors,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('vendors/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'ntn' => 'required|min:3'
        ]);
        if ($validator->passes()) {
            Vendor::create(['name' => $request->name, 'ntn' => $request->ntn]);
            return redirect()->route('vendors.index')->with('success', 'Vendor created successfully');
        } else {
            return redirect()->route('vendors.create')->withInput()->withErrors($validator);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $vendor = Vendor::findOrFail($id);
        return Inertia::render('vendors/edit', [
            'vendor' => $vendor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $vendor = Vendor::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'ntn' => 'required|min:3',
            'status' => 'required',
        ]);
        if ($validator->passes()) {
            $vendor->name = $request->name;
            $vendor->ntn = $request->ntn;
            $vendor->status = $request->status;
            $vendor->save();
            return redirect()->route('vendors.index')->with('success', 'Vendor updated successfully');
        } else {
            return redirect()->route('vendors.create')->withInput()->withErrors($validator);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $vendor = Vendor::find($id);
        if ($vendor == null) {
            return redirect()->route('vendors.index')->with('error', 'Vendor not found');
        }
        $vendor->delete();
        return redirect()->route('vendors.index')->with('success', 'Vendor deleted successfully');
    }
}
