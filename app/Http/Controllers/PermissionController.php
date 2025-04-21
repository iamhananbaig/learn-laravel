<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index() {
        $permissions = Permission::orderBy('created_at', 'DESC')->paginate(10);

    return Inertia::render('rbac/permissions/list', [
        'permissions' => $permissions,
        'success' => session('success'),
    ]);
    }

    public function create() {
        return Inertia::render('rbac/permissions/create');
    }

    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:permissions|min:3'
        ]);

        if($validator->passes()) {
            Permission::create(['name' => $request->name]);
            return redirect()->route('permissions.index')->with('success', 'Permission created successfully');
        } else {
            
            return redirect()->route('permissions.create')->withInput()->withErrors($validator);
        }

    }

    public function edit() {

    }
    public function update() {

    }

    public function destroy() {

    }
}
