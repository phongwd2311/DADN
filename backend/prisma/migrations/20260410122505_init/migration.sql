-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) DEFAULT 'USER',
    "join_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "calculation_sessions" (
    "session_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "session_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_synced" BOOLEAN DEFAULT false,

    CONSTRAINT "calculation_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "design_inputs" (
    "input_id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "force_f" DOUBLE PRECISION,
    "velocity_v" DOUBLE PRECISION,
    "diameter_d" DOUBLE PRECISION,
    "lifespan_l" DOUBLE PRECISION,
    "t1_percent" DOUBLE PRECISION,
    "t1_torque" DOUBLE PRECISION,
    "t2_percent" DOUBLE PRECISION,
    "t2_torque" DOUBLE PRECISION,

    CONSTRAINT "design_inputs_pkey" PRIMARY KEY ("input_id")
);

-- CreateTable
CREATE TABLE "design_results" (
    "result_id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "equivalent_power" DOUBLE PRECISION,
    "total_efficiency" DOUBLE PRECISION,
    "required_power_pct" DOUBLE PRECISION,
    "total_ratio_ut" DOUBLE PRECISION,
    "u1_ratio" DOUBLE PRECISION,
    "u2_ratio" DOUBLE PRECISION,

    CONSTRAINT "design_results_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "shafts" (
    "shaft_id" SERIAL NOT NULL,
    "result_id" INTEGER,
    "shaft_order" INTEGER,
    "power_p" DOUBLE PRECISION,
    "speed_n" DOUBLE PRECISION,
    "torque_t" DOUBLE PRECISION,
    "material" VARCHAR(100),
    "diameter_d" DOUBLE PRECISION,

    CONSTRAINT "shafts_pkey" PRIMARY KEY ("shaft_id")
);

-- CreateTable
CREATE TABLE "bearings" (
    "bearing_id" SERIAL NOT NULL,
    "result_id" INTEGER,
    "position" VARCHAR(100),
    "bearing_model" VARCHAR(50),
    "inner_diameter_d" DOUBLE PRECISION,
    "dynamic_capacity_c" DOUBLE PRECISION,
    "calculated_life_lh" DOUBLE PRECISION,

    CONSTRAINT "bearings_pkey" PRIMARY KEY ("bearing_id")
);

-- CreateTable
CREATE TABLE "gear_drives" (
    "gear_id" SERIAL NOT NULL,
    "result_id" INTEGER,
    "gear_type" VARCHAR(50),
    "module" DOUBLE PRECISION,
    "teeth_number" INTEGER,
    "center_distance" DOUBLE PRECISION,

    CONSTRAINT "gear_drives_pkey" PRIMARY KEY ("gear_id")
);

-- CreateTable
CREATE TABLE "housings" (
    "housing_id" SERIAL NOT NULL,
    "result_id" INTEGER,
    "material" VARCHAR(100),
    "wall_thickness" DOUBLE PRECISION,
    "distance_center" DOUBLE PRECISION,

    CONSTRAINT "housings_pkey" PRIMARY KEY ("housing_id")
);

-- CreateTable
CREATE TABLE "motor_library" (
    "motor_id" SERIAL NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "rated_power" DOUBLE PRECISION,
    "rated_speed" DOUBLE PRECISION,
    "efficiency" DOUBLE PRECISION,

    CONSTRAINT "motor_library_pkey" PRIMARY KEY ("motor_id")
);

-- CreateTable
CREATE TABLE "ai_suggestions" (
    "suggestion_id" SERIAL NOT NULL,
    "session_id" INTEGER,
    "motor_id" INTEGER,
    "suitability_score" DOUBLE PRECISION,
    "ai_reason" TEXT,
    "strategy_used" VARCHAR(50),

    CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("suggestion_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "calculation_sessions" ADD CONSTRAINT "calculation_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_inputs" ADD CONSTRAINT "design_inputs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "calculation_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "design_results" ADD CONSTRAINT "design_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "calculation_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shafts" ADD CONSTRAINT "shafts_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "design_results"("result_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bearings" ADD CONSTRAINT "bearings_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "design_results"("result_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gear_drives" ADD CONSTRAINT "gear_drives_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "design_results"("result_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "housings" ADD CONSTRAINT "housings_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "design_results"("result_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "calculation_sessions"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_suggestions" ADD CONSTRAINT "ai_suggestions_motor_id_fkey" FOREIGN KEY ("motor_id") REFERENCES "motor_library"("motor_id") ON DELETE SET NULL ON UPDATE CASCADE;
