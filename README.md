# MarginRx

MarginRx is a chef-led restaurant profitability audit prototype for Indian F&B operators.

Open `index.html` in a browser to use it. The first version is static and runs entirely on the device.

## What It Does

- Calculates dish-level contribution margin by channel.
- Separates food cost, packaging, labor, wastage, GST assumptions, hidden input-tax burden, commission, discounts, marketing, and payment fees.
- Converts GST-inclusive menu prices into net sales before calculating contribution.
- Adds GST on platform commission invoices into leakage.
- Flags bleeding, watch, and healthy SKUs.
- Estimates the price needed to hit a target margin.
- Imports and exports simple CSV menu data.
- Generates an owner-ready leakage summary with recoverable profit, 90-day upside, direct-order upside, and priority fixes.
- Prints or copies the owner report for pilot calls.

## CSV Format

```csv
name,category,channel,price,foodCost,packaging,prepMinutes,orders,commission,discount,marketing,payment,waste
Butter Chicken Meal,North Indian,zomato,340,126,20,11,420,25,10,6,1.8,3
```

Valid channels are `dineIn`, `direct`, `zomato`, `swiggy`, and `catering`.

GST is configured globally in the audit assumptions:

- Menu price includes GST: on/off.
- Output GST rate: default 5%.
- GST on platform commission invoice: default 18%.
- Hidden input-tax burden: default 6% of food cost.

Templates:

- `templates/menu-intake-template.csv`
- `templates/vendor-bills-template.csv`
- `templates/platform-payout-template.csv`
- `sample-data/sample-menu.csv`

## Product Direction

The wedge is a 48-hour menu and platform leakage audit:

1. Owner uploads menu, recipes, purchase bills, and delivery platform statements.
2. MarginRx normalizes the data into dish and channel economics.
3. The output is a prioritized action list: reprice, portion-correct, move to direct order, renegotiate, or cut.

The next build should add document upload, recipe yield logic, vendor price variance, GST/TCS/TDS reconciliation, and statement reconciliation.

## Pilot Assets

- `PILOT_PLAYBOOK.md` - how to sell and deliver the 48-hour audit.
- `sales/outreach-scripts.md` - WhatsApp, call, follow-up, and objection scripts.
- `V1_BUILD_BRIEF.md` - next product build scope after paid pilots.
- `DEPLOYMENT.md` - GitHub and Vercel deployment settings.
- `SUPABASE_SCHEMA_DRAFT.md` - first database model for the V1 app.
