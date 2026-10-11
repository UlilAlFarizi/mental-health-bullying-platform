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
        Schema::create('symptoms', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel bullying_types
            $table->foreignId('bullying_type_id')->constrained('bullying_types')->onDelete('cascade');
            $table->string('code')->unique(); // Contoh: "G01"
            $table->text('question_text');    // Contoh: "Menerima panggilan nama..."
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('symptoms');
    }
};
