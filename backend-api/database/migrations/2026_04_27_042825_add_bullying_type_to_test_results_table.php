<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
    {
        Schema::table('test_results', function (Blueprint $table) {
            // Cukup tambahkan dua kolom ini saja
            $table->string('bullying_type')->after('total_score')->nullable(); 
            $table->string('severity_level')->after('bullying_type')->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_results', function (Blueprint $table) {
            // Untuk menghapus kolom jika kita melakukan rollback
            $table->dropColumn(['bullying_type', 'severity_level']);
        });
    }
};