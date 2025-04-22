<?php

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('permission CRUD flow works', function () {
    $this->withoutExceptionHandling();

    // Authenticate user
    $user = User::factory()->create();
    $this->actingAs($user);

    // Create permission
    $this->post('/permissions', ['name' => 'test-permission'])
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseHas('permissions', ['name' => 'test-permission']);

    // Update permission
    $permission = Permission::first();

    $this->put("/permissions/{$permission->id}", ['name' => 'updated-permission'])
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseHas('permissions', ['name' => 'updated-permission']);

    // Delete permission
    $this->delete("/permissions/{$permission->id}/delete")
        ->assertRedirect(route('permissions.index'));

    $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
});
