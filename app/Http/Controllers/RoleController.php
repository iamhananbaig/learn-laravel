<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions:id,name')
            ->orderBy('name', 'ASC')
            ->paginate(10);

        return Inertia::render('rbac/roles/list', [
            'roles' => $roles,
        ]);
    }
    public function create()
    {
        $permissions = Permission::orderBy('name', 'ASC')->get();
        return Inertia::render('rbac/roles/create', [
            'permissions' => $permissions
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:roles|min:3',
        ]);

        if ($validator->passes()) {
            $role = Role::create(['name' => $request->name]);
            if (!empty($request->permissions)) {
                foreach ($request->permissions as $value) {
                    $role->givePermissionTo($value);
                }
            }
            return redirect()->route('roles.index')->with('success', 'Role created successfully');
        } else {
            return redirect()->route('roles.create')->withInput()->withErrors($validator);
        }
    }

    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $haspermissions = $role->permissions->pluck('id');
        $permissions = Permission::orderBy('name', 'ASC')->get();
        return Inertia::render('rbac/roles/edit', [
            'role' => $role,
            'haspermissions' => $haspermissions,
            'permissions' => $permissions,
        ]);
    }

    public function update($id, Request $request)
    {
        $role = Role::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'name' => 'min:3|required|unique:roles,name,' . $id . ',id',
        ]);

        if ($validator->passes()) {

            $role->name = $request->name;
            $role->save();

            if (!empty($request->permissions)) {
                $role->syncPermissions($request->permissions);
            } else {
                $role->syncPermissions([]);
            }
            return redirect()->route('roles.index')->with('success', 'Role updated successfully');
        } else {
            return redirect()->route('roles.edit', $id)->withInput()->withErrors($validator);
        }
    }

    public function destroy($id)
    {
        $role = Role::find($id);
        if ($role == null) {
            return redirect()->route('roles.index')->with('error', 'Role not found');
        }
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully');
    }
}
