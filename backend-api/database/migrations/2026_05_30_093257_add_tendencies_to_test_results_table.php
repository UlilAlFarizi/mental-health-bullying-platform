<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
    {
        Schema::table('test_results', function (Blueprint $table) {
            $table->text('detected_tendencies')->nullable()->after('recommendation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('test_results', function (Blueprint $table) {
            $table->dropColumn('detected_tendencies');
        });
    }
};
