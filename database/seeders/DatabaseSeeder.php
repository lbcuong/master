<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        User::factory(10)->create();

        // DB::table('users')->insert([
        //     'name' => 'admin',
        //     'email' => 'admin@weather.com',
        //     'password' => Hash::make('weather'),
        // ]);
    }
}
