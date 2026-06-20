# MarginRx V1 Build Brief

## Objective

Turn the static prototype into a pilot-ready web app that can accept real restaurant files, produce an owner report, and support monthly SaaS conversion.

## Product Modules

1. Menu economics
   - Dish price, recipe cost, packaging, prep labor, waste, channel assumptions.
   - Contribution margin by dish and channel.
   - Target price recommendation.

2. Recipe yield logic
   - Ingredient purchase unit.
   - Edible yield percentage.
   - Batch recipe conversion.
   - Portion cost and trim loss.

3. Vendor bill import
   - CSV upload first.
   - Ingredient price trend by vendor.
   - Alert when purchase cost changes enough to damage margin.

4. Platform payout import
   - Zomato and Swiggy payout CSV/manual import first.
   - Reconcile gross sales, output GST, commission, GST on commission invoices, discounts, ads, packaging, payment fees, TCS/TDS where applicable, and net payout.

5. Owner report
   - Monthly recoverable profit.
   - Top leaking dishes.
   - Target price changes.
   - Direct-order upside.
   - GST-adjusted contribution.
   - PDF or print export.

6. Pilot CRM
   - Restaurant profile.
   - Outlet count.
   - Audit status.
   - Files collected.
   - Call notes and next action.

## Data Model Draft

- Restaurant
- Outlet
- MenuItem
- Channel
- Recipe
- Ingredient
- VendorBillLine
- PlatformPayoutLine
- AuditRun
- AuditRecommendation

## Technical Path

Phase 1:
- Keep static app.
- Improve report and import templates.
- Use local browser print for PDF.

Phase 2:
- Move to React or Next.js.
- Store audits in local JSON or SQLite.
- Add file upload parsing.

Phase 3:
- Add authentication, multi-restaurant workspace, and monthly reporting.

## Success Metrics

- 3 paid pilots closed.
- Each pilot identifies at least Rs. 25,000 monthly visible recovery opportunity or a strong operational reason why not.
- At least 1 pilot agrees to monthly tracking.
- Owners understand the report in under 10 minutes.
