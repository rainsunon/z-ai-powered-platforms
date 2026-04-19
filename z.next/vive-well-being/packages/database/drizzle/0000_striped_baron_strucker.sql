CREATE TYPE "public"."expense_category" AS ENUM('FOOD', 'TRANSPORT', 'HOUSING', 'UTILITIES', 'ENTERTAINMENT', 'HEALTHCARE', 'EDUCATION', 'SHOPPING', 'TRAVEL', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."asset_type" AS ENUM('STOCK', 'BOND', 'REAL_ESTATE', 'CRYPTO', 'MUTUAL_FUND', 'ETF', 'COMMODITY', 'CASH', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER');--> statement-breakpoint
CREATE TYPE "public"."health_metric_type" AS ENUM('HEART_RATE', 'BLOOD_PRESSURE', 'BLOOD_SUGAR', 'WEIGHT', 'HEIGHT', 'STEPS', 'SLEEP', 'CALORIES', 'WATER_INTAKE', 'EXERCISE', 'OTHER');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "client_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(50) NOT NULL,
	"subject" varchar(500),
	"notes" text,
	"importance" integer DEFAULT 0 NOT NULL,
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expense_budgets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category" "expense_category" NOT NULL,
	"monthly_limit" numeric(12, 2) NOT NULL,
	"current_spend" numeric(12, 2) DEFAULT '0' NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"category" "expense_category" NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"description" text,
	"merchant_name" varchar(255),
	"receipt_url" text,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"expense_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wealth_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"asset_type" "asset_type" NOT NULL,
	"symbol" varchar(50),
	"name" varchar(255) NOT NULL,
	"quantity" numeric(15, 4) NOT NULL,
	"average_cost" numeric(15, 2) NOT NULL,
	"current_price" numeric(15, 2),
	"metadata" jsonb,
	"acquired_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wealth_portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"total_value" numeric(15, 2) DEFAULT '0' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wealth_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"asset_id" uuid,
	"type" "transaction_type" NOT NULL,
	"quantity" numeric(15, 4) NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"fees" numeric(12, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"activity_type" varchar(100) NOT NULL,
	"duration_minutes" integer NOT NULL,
	"calories_burned" numeric(8, 2),
	"distance_km" numeric(8, 2),
	"notes" text,
	"metadata" jsonb,
	"performed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"metric_type" "health_metric_type" NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2) DEFAULT '0' NOT NULL,
	"unit" varchar(50) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"is_active" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"metric_type" "health_metric_type" NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"unit" varchar(50) NOT NULL,
	"notes" text,
	"metadata" jsonb,
	"recorded_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_token" ON "sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "idx_user_roles_user_id" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_roles_role_id" ON "user_roles" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_client_interactions_client_id" ON "client_interactions" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_client_interactions_user_id" ON "client_interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_clients_user_id" ON "clients" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_clients_email" ON "clients" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_expense_budgets_user_id" ON "expense_budgets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_user_id" ON "expenses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_expenses_category" ON "expenses" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_expenses_expense_date" ON "expenses" USING btree ("expense_date");--> statement-breakpoint
CREATE INDEX "idx_wealth_assets_portfolio_id" ON "wealth_assets" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "idx_wealth_portfolios_user_id" ON "wealth_portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wealth_transactions_portfolio_id" ON "wealth_transactions" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "idx_wealth_transactions_asset_id" ON "wealth_transactions" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_health_activities_user_id" ON "health_activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_health_activities_performed_at" ON "health_activities" USING btree ("performed_at");--> statement-breakpoint
CREATE INDEX "idx_health_goals_user_id" ON "health_goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_health_metrics_user_id" ON "health_metrics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_health_metrics_metric_type" ON "health_metrics" USING btree ("metric_type");--> statement-breakpoint
CREATE INDEX "idx_health_metrics_recorded_at" ON "health_metrics" USING btree ("recorded_at");