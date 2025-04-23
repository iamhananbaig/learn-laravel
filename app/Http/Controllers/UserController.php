<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('roles:name')->orderBy('created_at', 'DESC')->paginate(10);
        return Inertia::render('rbac/users/list', [
            'users' => $users,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::findOrFail($id);
        $roles = Role::orderBy('name', 'ASC')->get();
        $hasroles = $user->roles->pluck('id');
        return Inertia::render('rbac/users/edit', [
            'user' => $user,
            'roles' => $roles,
            'hasroles' => $hasroles,
        ]);
    }


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users,email,' . $id . ',id',
        ]);

        if ($validator->passes()) {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();
            $user->syncRoles($request->roles);
            return redirect()->route('users.index')->with('success', 'User updated successfully');
        } else {
            return redirect()->route('users.edit', $id)->withInput()->withErrors($validator);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
