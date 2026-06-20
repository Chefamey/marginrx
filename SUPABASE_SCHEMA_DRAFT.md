# Supabase Schema Draft

This is for MarginRx V1. The current pilot app is static and does not need Supabase yet.

## Tables

### restaurants

- id uuid primary key
- name text
- owner_name text
- city text
- created_at timestamptz

### outlets

- id uuid primary key
- restaurant_id uuid references restaurants
- name text
- address text
- created_at timestamptz

### menu_items

- id uuid primary key
- outlet_id uuid references outlets
- name text
- category text
- channel text
- selling_price numeric
- food_cost numeric
- packaging_cost numeric
- prep_minutes numeric
- monthly_orders numeric
- commission_pct numeric
- discount_pct numeric
- marketing_pct numeric
- payment_pct numeric
- waste_pct numeric
- created_at timestamptz

### audit_runs

- id uuid primary key
- outlet_id uuid references outlets
- target_margin_pct numeric
- labor_rate_per_hour numeric
- input_tax_burden_pct numeric
- price_includes_gst boolean
- output_gst_pct numeric
- commission_gst_pct numeric
- created_at timestamptz

### audit_recommendations

- id uuid primary key
- audit_run_id uuid references audit_runs
- menu_item_id uuid references menu_items
- recommendation_type text
- title text
- body text
- monthly_value numeric
- created_at timestamptz

### vendor_bill_lines

- id uuid primary key
- outlet_id uuid references outlets
- invoice_date date
- vendor text
- ingredient text
- unit text
- quantity numeric
- total_cost numeric
- gst_pct numeric
- linked_menu_items text
- created_at timestamptz

### platform_payout_lines

- id uuid primary key
- outlet_id uuid references outlets
- period text
- platform text
- dish_name text
- orders numeric
- gross_sales numeric
- output_gst numeric
- commission numeric
- commission_gst numeric
- discount numeric
- ads numeric
- packaging_charge numeric
- payment_fee numeric
- net_payout numeric
- created_at timestamptz
