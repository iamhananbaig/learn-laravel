<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Schema\Blueprint;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Blueprint::macro('trackable', function () {
            /** @var Blueprint $this */
            $this->unsignedBigInteger('created_by');
            $this->unsignedBigInteger('updated_by')->nullable();

            $this->foreign('created_by')->references('id')->on('users')->onDelete('restrict');
            $this->foreign('updated_by')->references('id')->on('users')->onDelete('restrict');
        });
    }
}
