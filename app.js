const auditStorageKey = "marginrx.audit.v2";
const adminStorageKey = "marginrx.admin.v1";

const stageDefinitions = [
  { key: "lead", label: "Lead", tone: "" },
  { key: "qualified", label: "Qualified", tone: "" },
  { key: "demo", label: "Demo Booked", tone: "warning" },
  { key: "pilot", label: "Pilot Running", tone: "warning" },
  { key: "report", label: "Report Sent", tone: "warning" },
  { key: "paid", label: "Paid Client", tone: "" },
  { key: "retainer", label: "Retainer", tone: "" },
  { key: "lost", label: "Lost", tone: "danger" }
];

const defaultSettings = {
  targetMarginPct: 18,
  laborRatePerHour: 140,
  inputTaxBurdenPct: 6,
  priceIncludesGst: true,
  outputGstPct: 5,
  commissionGstPct: 18
};

const channelPresets = {
  dineIn: {
    label: "Dine-in",
    commissionPct: 0,
    discountPct: 0,
    marketingPct: 0,
    paymentPct: 1.2,
    packagingCost: 0
  },
  direct: {
    label: "Direct WhatsApp",
    commissionPct: 0,
    discountPct: 5,
    marketingPct: 1,
    paymentPct: 1.2,
    packagingCost: 12
  },
  zomato: {
    label: "Zomato",
    commissionPct: 25,
    discountPct: 8,
    marketingPct: 5,
    paymentPct: 1.8,
    packagingCost: 18
  },
  swiggy: {
    label: "Swiggy",
    commissionPct: 25,
    discountPct: 10,
    marketingPct: 6,
    paymentPct: 1.8,
    packagingCost: 18
  },
  catering: {
    label: "Catering",
    commissionPct: 0,
    discountPct: 3,
    marketingPct: 0,
    paymentPct: 1,
    packagingCost: 28
  }
};

const sampleItems = [
  {
    id: "item-1",
    name: "Butter Chicken Meal",
    category: "North Indian",
    channel: "zomato",
    sellingPrice: 340,
    foodCost: 126,
    packagingCost: 20,
    prepMinutes: 11,
    monthlyOrders: 420,
    commissionPct: 25,
    discountPct: 10,
    marketingPct: 6,
    paymentPct: 1.8,
    wastePct: 3
  },
  {
    id: "item-2",
    name: "Paneer Tikka Roll",
    category: "QSR",
    channel: "swiggy",
    sellingPrice: 210,
    foodCost: 74,
    packagingCost: 16,
    prepMinutes: 7,
    monthlyOrders: 560,
    commissionPct: 25,
    discountPct: 12,
    marketingPct: 5,
    paymentPct: 1.8,
    wastePct: 4
  },
  {
    id: "item-3",
    name: "Dal Khichdi Bowl",
    category: "Comfort",
    channel: "direct",
    sellingPrice: 190,
    foodCost: 52,
    packagingCost: 12,
    prepMinutes: 5,
    monthlyOrders: 240,
    commissionPct: 0,
    discountPct: 5,
    marketingPct: 1,
    paymentPct: 1.2,
    wastePct: 2
  },
  {
    id: "item-4",
    name: "Chef Tasting Thali",
    category: "Dine-in",
    channel: "dineIn",
    sellingPrice: 680,
    foodCost: 214,
    packagingCost: 0,
    prepMinutes: 18,
    monthlyOrders: 150,
    commissionPct: 0,
    discountPct: 0,
    marketingPct: 0,
    paymentPct: 1.2,
    wastePct: 5
  },
  {
    id: "item-5",
    name: "Office Biryani Box",
    category: "Corporate",
    channel: "catering",
    sellingPrice: 260,
    foodCost: 82,
    packagingCost: 28,
    prepMinutes: 8,
    monthlyOrders: 700,
    commissionPct: 0,
    discountPct: 3,
    marketingPct: 0,
    paymentPct: 1,
    wastePct: 2
  }
];

const savedAuditState = readStorage(auditStorageKey, {});

const state = {
  items: Array.isArray(savedAuditState.items) && savedAuditState.items.length ? savedAuditState.items : clone(sampleItems),
  filter: "all",
  view: initialView(),
  settings: { ...defaultSettings, ...(savedAuditState.settings || {}) },
  admin: normalizeAdminState(readStorage(adminStorageKey, null))
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    showToast("Browser storage is blocked in this session.");
  }
}

function todayIso(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function initialView() {
  const params = new URLSearchParams(window.location.search);
  if (window.location.pathname === "/admin" || window.location.hash === "#admin" || params.get("view") === "admin") {
    return "admin";
  }
  return "audit";
}

function normalizeAdminState(saved) {
  const seed = {
    selectedRestaurantId: "rest-1",
    restaurants: [
      {
        id: "rest-1",
        name: "Bombay Bowl Co.",
        city: "Mumbai",
        ownerName: "Chef founder",
        phone: "+91 90000 00000",
        segment: "Cloud kitchen",
        stage: "pilot",
        auditFee: 18000,
        retainerPotential: 35000,
        recoveryFound: 73638,
        lastTouch: todayIso(-1),
        nextFollowup: todayIso(1),
        nextStep: "Review GST-adjusted owner report and close paid pilot",
        notes: "Strong aggregator leakage. Owner wants dish-level reprice list before the weekend."
      },
      {
        id: "rest-2",
        name: "South Cafe Works",
        city: "Bengaluru",
        ownerName: "Operator",
        phone: "",
        segment: "Cafe",
        stage: "demo",
        auditFee: 12000,
        retainerPotential: 22000,
        recoveryFound: 0,
        lastTouch: todayIso(-3),
        nextFollowup: todayIso(0),
        nextStep: "Collect platform payout CSV and menu pricing sheet",
        notes: "Coffee, breakfast, and delivery snacks. Wants proof before monthly retainer."
      },
      {
        id: "rest-3",
        name: "Office Thali Kitchen",
        city: "Pune",
        ownerName: "Founder",
        phone: "",
        segment: "Catering",
        stage: "qualified",
        auditFee: 25000,
        retainerPotential: 45000,
        recoveryFound: 0,
        lastTouch: todayIso(-5),
        nextFollowup: todayIso(2),
        nextStep: "Send pilot scope for corporate menu margin audit",
        notes: "High order volume; needs vendor bill variance next."
      }
    ],
    reports: []
  };

  if (!saved || typeof saved !== "object") {
    return seed;
  }

  return {
    selectedRestaurantId: saved.selectedRestaurantId || seed.selectedRestaurantId,
    restaurants: Array.isArray(saved.restaurants) && saved.restaurants.length ? saved.restaurants : seed.restaurants,
    reports: Array.isArray(saved.reports) ? saved.reports : []
  };
}

function persistAuditState() {
  writeStorage(auditStorageKey, {
    items: state.items,
    settings: state.settings
  });
}

function persistAdminState() {
  writeStorage(adminStorageKey, state.admin);
}

const dom = {
  targetMarginInput: document.querySelector("#targetMarginInput"),
  targetMarginValue: document.querySelector("#targetMarginValue"),
  laborRateInput: document.querySelector("#laborRateInput"),
  laborRateValue: document.querySelector("#laborRateValue"),
  inputTaxInput: document.querySelector("#inputTaxInput"),
  inputTaxValue: document.querySelector("#inputTaxValue"),
  priceIncludesGstInput: document.querySelector("#priceIncludesGstInput"),
  outputGstInput: document.querySelector("#outputGstInput"),
  outputGstValue: document.querySelector("#outputGstValue"),
  commissionGstInput: document.querySelector("#commissionGstInput"),
  commissionGstValue: document.querySelector("#commissionGstValue"),
  resetDefaultsButton: document.querySelector("#resetDefaultsButton"),
  presetList: document.querySelector("#presetList"),
  channelInput: document.querySelector("#channelInput"),
  itemForm: document.querySelector("#itemForm"),
  formTitle: document.querySelector("#formTitle"),
  formStatus: document.querySelector("#formStatus"),
  itemId: document.querySelector("#itemId"),
  nameInput: document.querySelector("#nameInput"),
  categoryInput: document.querySelector("#categoryInput"),
  ordersInput: document.querySelector("#ordersInput"),
  priceInput: document.querySelector("#priceInput"),
  foodCostInput: document.querySelector("#foodCostInput"),
  packagingInput: document.querySelector("#packagingInput"),
  prepInput: document.querySelector("#prepInput"),
  commissionInput: document.querySelector("#commissionInput"),
  discountInput: document.querySelector("#discountInput"),
  marketingInput: document.querySelector("#marketingInput"),
  paymentInput: document.querySelector("#paymentInput"),
  wasteInput: document.querySelector("#wasteInput"),
  previewContribution: document.querySelector("#previewContribution"),
  previewMargin: document.querySelector("#previewMargin"),
  previewPrice: document.querySelector("#previewPrice"),
  saveItemButton: document.querySelector("#saveItemButton"),
  clearFormButton: document.querySelector("#clearFormButton"),
  addFreshButton: document.querySelector("#addFreshButton"),
  sampleButton: document.querySelector("#sampleButton"),
  copyReportButton: document.querySelector("#copyReportButton"),
  printReportButton: document.querySelector("#printReportButton"),
  importCsvButton: document.querySelector("#importCsvButton"),
  exportCsvButton: document.querySelector("#exportCsvButton"),
  csvInput: document.querySelector("#csvInput"),
  metricRevenue: document.querySelector("#metricRevenue"),
  metricOrders: document.querySelector("#metricOrders"),
  metricGstPayable: document.querySelector("#metricGstPayable"),
  metricContribution: document.querySelector("#metricContribution"),
  metricMargin: document.querySelector("#metricMargin"),
  metricLeakage: document.querySelector("#metricLeakage"),
  metricBleeding: document.querySelector("#metricBleeding"),
  menuTable: document.querySelector("#menuTable"),
  insightList: document.querySelector("#insightList"),
  alertCount: document.querySelector("#alertCount"),
  reportNarrative: document.querySelector("#reportNarrative"),
  reportRecovery: document.querySelector("#reportRecovery"),
  reportQuarterUpside: document.querySelector("#reportQuarterUpside"),
  reportDirectUpside: document.querySelector("#reportDirectUpside"),
  reportGstPayable: document.querySelector("#reportGstPayable"),
  reportPriceCorrections: document.querySelector("#reportPriceCorrections"),
  reportFixCount: document.querySelector("#reportFixCount"),
  recoveryList: document.querySelector("#recoveryList"),
  channelCount: document.querySelector("#channelCount"),
  channelBars: document.querySelector("#channelBars"),
  viewTabs: document.querySelectorAll("[data-view-target]"),
  viewPanes: document.querySelectorAll(".view-pane"),
  saveAuditSnapshotButton: document.querySelector("#saveAuditSnapshotButton"),
  exportAdminButton: document.querySelector("#exportAdminButton"),
  adminActivePilots: document.querySelector("#adminActivePilots"),
  adminPipeline: document.querySelector("#adminPipeline"),
  adminRecovery: document.querySelector("#adminRecovery"),
  adminFollowups: document.querySelector("#adminFollowups"),
  adminReports: document.querySelector("#adminReports"),
  restaurantForm: document.querySelector("#restaurantForm"),
  restaurantFormTitle: document.querySelector("#restaurantFormTitle"),
  restaurantFormStatus: document.querySelector("#restaurantFormStatus"),
  restaurantId: document.querySelector("#restaurantId"),
  restaurantNameInput: document.querySelector("#restaurantNameInput"),
  restaurantCityInput: document.querySelector("#restaurantCityInput"),
  restaurantOwnerInput: document.querySelector("#restaurantOwnerInput"),
  restaurantPhoneInput: document.querySelector("#restaurantPhoneInput"),
  restaurantSegmentInput: document.querySelector("#restaurantSegmentInput"),
  restaurantStageInput: document.querySelector("#restaurantStageInput"),
  restaurantAuditFeeInput: document.querySelector("#restaurantAuditFeeInput"),
  restaurantRetainerInput: document.querySelector("#restaurantRetainerInput"),
  restaurantRecoveryInput: document.querySelector("#restaurantRecoveryInput"),
  restaurantLastTouchInput: document.querySelector("#restaurantLastTouchInput"),
  restaurantNextFollowupInput: document.querySelector("#restaurantNextFollowupInput"),
  restaurantNextStepInput: document.querySelector("#restaurantNextStepInput"),
  restaurantNotesInput: document.querySelector("#restaurantNotesInput"),
  clearRestaurantButton: document.querySelector("#clearRestaurantButton"),
  pipelineCount: document.querySelector("#pipelineCount"),
  stageBoard: document.querySelector("#stageBoard"),
  selectedRestaurantLabel: document.querySelector("#selectedRestaurantLabel"),
  restaurantTable: document.querySelector("#restaurantTable"),
  auditArchiveCount: document.querySelector("#auditArchiveCount"),
  auditArchive: document.querySelector("#auditArchive"),
  toast: document.querySelector("#toast")
};

function currency(value) {
  const rounded = Math.round(Number(value) || 0);
  return `Rs. ${rounded.toLocaleString("en-IN")}`;
}

function pct(value) {
  const number = Number.isFinite(value) ? value : 0;
  return `${number.toFixed(number % 1 === 0 ? 0 : 1)}%`;
}

function numeric(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function uid(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function getFormItem() {
  return {
    id: dom.itemId.value || uid(),
    name: dom.nameInput.value.trim(),
    category: dom.categoryInput.value.trim() || "Uncategorised",
    channel: dom.channelInput.value,
    sellingPrice: numeric(dom.priceInput.value),
    foodCost: numeric(dom.foodCostInput.value),
    packagingCost: numeric(dom.packagingInput.value),
    prepMinutes: numeric(dom.prepInput.value),
    monthlyOrders: numeric(dom.ordersInput.value),
    commissionPct: numeric(dom.commissionInput.value),
    discountPct: numeric(dom.discountInput.value),
    marketingPct: numeric(dom.marketingInput.value),
    paymentPct: numeric(dom.paymentInput.value),
    wastePct: numeric(dom.wasteInput.value)
  };
}

function calculateItem(item) {
  const menuPrice = numeric(item.sellingPrice);
  const outputGstRate = state.settings.outputGstPct / 100;
  const gstMultiplier = 1 + outputGstRate;
  const netRevenue = state.settings.priceIncludesGst && gstMultiplier > 0
    ? menuPrice / gstMultiplier
    : menuPrice;
  const customerBillPrice = state.settings.priceIncludesGst ? menuPrice : menuPrice * gstMultiplier;
  const outputGst = Math.max(0, customerBillPrice - netRevenue);
  const foodCost = numeric(item.foodCost);
  const packagingCost = numeric(item.packagingCost);
  const laborCost = numeric(item.prepMinutes) / 60 * state.settings.laborRatePerHour;
  const wasteCost = foodCost * numeric(item.wastePct) / 100;
  const inputTaxCost = foodCost * state.settings.inputTaxBurdenPct / 100;
  const commission = netRevenue * numeric(item.commissionPct) / 100;
  const commissionGst = commission * state.settings.commissionGstPct / 100;
  const discount = netRevenue * numeric(item.discountPct) / 100;
  const marketing = netRevenue * numeric(item.marketingPct) / 100;
  const payment = customerBillPrice * numeric(item.paymentPct) / 100;
  const variableCost = foodCost + packagingCost + laborCost + wasteCost + inputTaxCost;
  const leakage = commission + commissionGst + discount + marketing + payment;
  const contribution = netRevenue - variableCost - leakage;
  const marginPct = netRevenue > 0 ? contribution / netRevenue * 100 : 0;
  const targetMargin = state.settings.targetMarginPct / 100;
  const percentDeductions = (
    numeric(item.commissionPct) +
    numeric(item.commissionPct) * state.settings.commissionGstPct / 100 +
    numeric(item.discountPct) +
    numeric(item.marketingPct) +
    numeric(item.paymentPct) * gstMultiplier
  ) / 100;
  const denominator = 1 - percentDeductions - targetMargin;
  const targetNetRevenue = denominator > 0 ? variableCost / denominator : 0;
  const targetPrice = state.settings.priceIncludesGst ? targetNetRevenue * gstMultiplier : targetNetRevenue;
  const monthlyProfit = contribution * numeric(item.monthlyOrders);
  const monthlyLeakage = leakage * numeric(item.monthlyOrders);
  const targetProfit = netRevenue * targetMargin * numeric(item.monthlyOrders);
  const gapToTarget = Math.max(0, targetProfit - monthlyProfit);

  return {
    price: menuPrice,
    menuPrice,
    netRevenue,
    customerBillPrice,
    outputGst,
    foodCost,
    packagingCost,
    laborCost,
    wasteCost,
    inputTaxCost,
    commission,
    commissionGst,
    discount,
    marketing,
    payment,
    variableCost,
    leakage,
    contribution,
    marginPct,
    targetPrice,
    monthlyProfit,
    monthlyLeakage,
    gapToTarget,
    revenue: netRevenue * numeric(item.monthlyOrders),
    grossRevenue: customerBillPrice * numeric(item.monthlyOrders),
    monthlyOutputGst: outputGst * numeric(item.monthlyOrders)
  };
}

function classify(metrics) {
  if (metrics.contribution < 0) {
    return { key: "bleeding", label: "Bleeding", className: "danger" };
  }
  if (metrics.marginPct < state.settings.targetMarginPct) {
    return { key: "watch", label: "Watch", className: "warning" };
  }
  return { key: "healthy", label: "Healthy", className: "" };
}

function fillForm(item) {
  dom.itemId.value = item.id || "";
  dom.nameInput.value = item.name || "";
  dom.categoryInput.value = item.category || "";
  dom.channelInput.value = item.channel || "zomato";
  dom.ordersInput.value = item.monthlyOrders ?? 120;
  dom.priceInput.value = item.sellingPrice ?? 280;
  dom.foodCostInput.value = item.foodCost ?? 92;
  dom.packagingInput.value = item.packagingCost ?? 16;
  dom.prepInput.value = item.prepMinutes ?? 8;
  dom.commissionInput.value = item.commissionPct ?? 25;
  dom.discountInput.value = item.discountPct ?? 8;
  dom.marketingInput.value = item.marketingPct ?? 5;
  dom.paymentInput.value = item.paymentPct ?? 1.8;
  dom.wasteInput.value = item.wastePct ?? 3;
  dom.formTitle.textContent = item.id ? "Edit Menu Item" : "Add Menu Item";
  updatePreview();
}

function clearForm() {
  const preset = channelPresets.zomato;
  fillForm({
    id: "",
    name: "",
    category: "",
    channel: "zomato",
    monthlyOrders: 120,
    sellingPrice: 280,
    foodCost: 92,
    packagingCost: preset.packagingCost,
    prepMinutes: 8,
    commissionPct: preset.commissionPct,
    discountPct: preset.discountPct,
    marketingPct: preset.marketingPct,
    paymentPct: preset.paymentPct,
    wastePct: 3
  });
}

function applyPreset(channelKey) {
  const preset = channelPresets[channelKey];
  dom.channelInput.value = channelKey;
  dom.commissionInput.value = preset.commissionPct;
  dom.discountInput.value = preset.discountPct;
  dom.marketingInput.value = preset.marketingPct;
  dom.paymentInput.value = preset.paymentPct;
  dom.packagingInput.value = preset.packagingCost;
  updatePreview();
}

function updatePreview() {
  const metrics = calculateItem(getFormItem());
  const status = classify(metrics);
  dom.previewContribution.textContent = currency(metrics.contribution);
  dom.previewMargin.textContent = pct(metrics.marginPct);
  dom.previewPrice.textContent = metrics.targetPrice ? currency(metrics.targetPrice) : "Not viable";
  dom.formStatus.textContent = status.label;
  dom.formStatus.className = `status-pill ${status.className}`;
}

function renderSettings() {
  dom.targetMarginInput.value = state.settings.targetMarginPct;
  dom.laborRateInput.value = state.settings.laborRatePerHour;
  dom.inputTaxInput.value = state.settings.inputTaxBurdenPct;
  dom.priceIncludesGstInput.checked = state.settings.priceIncludesGst;
  dom.outputGstInput.value = state.settings.outputGstPct;
  dom.commissionGstInput.value = state.settings.commissionGstPct;
  dom.targetMarginValue.textContent = pct(state.settings.targetMarginPct);
  dom.laborRateValue.textContent = currency(state.settings.laborRatePerHour);
  dom.inputTaxValue.textContent = pct(state.settings.inputTaxBurdenPct);
  dom.outputGstValue.textContent = pct(state.settings.outputGstPct);
  dom.commissionGstValue.textContent = pct(state.settings.commissionGstPct);
}

function renderPresets() {
  dom.presetList.innerHTML = Object.entries(channelPresets).map(([key, preset]) => `
    <button class="preset-button" data-preset="${key}" type="button">
      <strong>${preset.label}</strong>
      <span>${pct(preset.commissionPct)} commission</span>
    </button>
  `).join("");

  dom.channelInput.innerHTML = Object.entries(channelPresets).map(([key, preset]) => `
    <option value="${key}">${preset.label}</option>
  `).join("");
}

function aggregate(items) {
  return items.reduce((acc, item) => {
    const metrics = calculateItem(item);
    const status = classify(metrics);
    acc.revenue += metrics.revenue;
    acc.orders += numeric(item.monthlyOrders);
    acc.contribution += metrics.monthlyProfit;
    acc.leakage += metrics.monthlyLeakage;
    acc.gstPayable += metrics.monthlyOutputGst;
    if (status.key === "bleeding") acc.bleeding += 1;
    return acc;
  }, {
    revenue: 0,
    orders: 0,
    contribution: 0,
    leakage: 0,
    gstPayable: 0,
    bleeding: 0
  });
}

function auditEntries() {
  return state.items.map((item) => {
    const metrics = calculateItem(item);
    const status = classify(metrics);
    return { item, metrics, status };
  });
}

function reportStats() {
  const entries = auditEntries();
  const totals = aggregate(state.items);
  const aggregatorEntries = entries.filter(({ item }) => ["zomato", "swiggy"].includes(item.channel));
  const aggregatorLeakage = aggregatorEntries.reduce((sum, entry) => sum + entry.metrics.monthlyLeakage, 0);
  const directUpside = aggregatorLeakage * 0.15;
  const priceCorrections = entries.filter(({ metrics }) => metrics.targetPrice > metrics.price * 1.03);
  const targetGap = entries.reduce((sum, entry) => sum + entry.metrics.gapToTarget, 0);
  const recovery = targetGap + directUpside;
  const blendedMargin = totals.revenue > 0 ? totals.contribution / totals.revenue * 100 : 0;
  const leakageByChannel = entries.reduce((acc, entry) => {
    const channel = channelPresets[entry.item.channel]?.label || entry.item.channel;
    acc[channel] = (acc[channel] || 0) + entry.metrics.monthlyLeakage;
    return acc;
  }, {});

  return {
    entries,
    totals,
    blendedMargin,
    aggregatorLeakage,
    directUpside,
    gstPayable: totals.gstPayable,
    priceCorrections,
    targetGap,
    recovery,
    leakageByChannel
  };
}

function renderMetrics() {
  const totals = aggregate(state.items);
  const blendedMargin = totals.revenue > 0 ? totals.contribution / totals.revenue * 100 : 0;
  dom.metricRevenue.textContent = currency(totals.revenue);
  dom.metricOrders.textContent = `${Math.round(totals.orders).toLocaleString("en-IN")} orders audited`;
  dom.metricGstPayable.textContent = currency(totals.gstPayable);
  dom.metricContribution.textContent = currency(totals.contribution);
  dom.metricMargin.textContent = `${pct(blendedMargin)} blended margin`;
  dom.metricLeakage.textContent = currency(totals.leakage);
  dom.metricBleeding.textContent = totals.bleeding;
}

function filteredItems() {
  if (state.filter === "all") return state.items;
  return state.items.filter((item) => classify(calculateItem(item)).key === state.filter);
}

function renderTable() {
  const rows = filteredItems();

  if (!rows.length) {
    dom.menuTable.innerHTML = `
      <tr>
        <td colspan="11">No items match this filter.</td>
      </tr>
    `;
    return;
  }

  dom.menuTable.innerHTML = rows.map((item) => {
    const metrics = calculateItem(item);
    const status = classify(metrics);
    return `
      <tr>
        <td class="dish-cell">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.category)}</span>
        </td>
        <td>${channelPresets[item.channel]?.label || item.channel}</td>
        <td>${currency(metrics.price)}</td>
        <td>${currency(metrics.netRevenue)}</td>
        <td>${currency(metrics.outputGst)}</td>
        <td>${currency(metrics.foodCost)} <span class="muted">(${pct(metrics.foodCost / metrics.price * 100)})</span></td>
        <td>${currency(metrics.leakage)}</td>
        <td>${pct(metrics.marginPct)}</td>
        <td>${currency(metrics.monthlyProfit)}</td>
        <td><span class="status-pill ${status.className}">${status.label}</span></td>
        <td>
          <div class="table-actions">
            <button data-edit="${item.id}" type="button" class="secondary-button">Edit</button>
            <button data-delete="${item.id}" type="button" class="danger-button">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderInsights() {
  const ranked = [...state.items]
    .map((item) => ({ item, metrics: calculateItem(item), status: classify(calculateItem(item)) }))
    .sort((a, b) => b.metrics.gapToTarget - a.metrics.gapToTarget);

  const alerts = [];
  const worst = ranked.find((entry) => entry.status.key === "bleeding");
  const highestLeakage = [...ranked].sort((a, b) => b.metrics.monthlyLeakage - a.metrics.monthlyLeakage)[0];
  const underpriced = ranked.find((entry) => entry.metrics.targetPrice > entry.metrics.price * 1.08);

  if (worst) {
    alerts.push({
      tone: "danger",
      title: `${worst.item.name} is losing ${currency(Math.abs(worst.metrics.monthlyProfit))} monthly`,
      body: `Move price toward ${currency(worst.metrics.targetPrice)}, cut discounts, or rebuild the recipe cost before scaling this SKU.`
    });
  }

  if (highestLeakage && highestLeakage.metrics.monthlyLeakage > 0) {
    alerts.push({
      tone: "warning",
      title: `${highestLeakage.item.name} has the highest channel leakage`,
      body: `${currency(highestLeakage.metrics.monthlyLeakage)} is going to commission, ads, discounts, and payment fees every month.`
    });
  }

  if (underpriced) {
    alerts.push({
      tone: "warning",
      title: `${underpriced.item.name} needs a price correction`,
      body: `Current price is ${currency(underpriced.metrics.price)}; target-margin price is ${currency(underpriced.metrics.targetPrice)}.`
    });
  }

  const directOpportunity = state.items
    .filter((item) => ["zomato", "swiggy"].includes(item.channel))
    .reduce((acc, item) => acc + calculateItem(item).monthlyLeakage, 0);

  if (directOpportunity > 0) {
    alerts.push({
      tone: "",
      title: "Direct-order upside is visible",
      body: `Aggregator-linked SKUs show ${currency(directOpportunity)} monthly leakage. Even converting 15% of repeats can fund this system.`
    });
  }

  dom.alertCount.textContent = `${alerts.length} alerts`;
  dom.insightList.innerHTML = alerts.map((alert) => `
    <article class="insight-card ${alert.tone}">
      <strong>${escapeHtml(alert.title)}</strong>
      <span>${escapeHtml(alert.body)}</span>
    </article>
  `).join("");
}

function buildRecoveryActions(stats) {
  const actions = [];

  stats.entries.forEach(({ item, metrics, status }) => {
    if (metrics.targetPrice > metrics.price * 1.03) {
      actions.push({
        value: metrics.gapToTarget,
        title: `Reprice ${item.name} to ${currency(metrics.targetPrice)}`,
        body: `${channelPresets[item.channel]?.label || item.channel} margin is ${pct(metrics.marginPct)} against the ${pct(state.settings.targetMarginPct)} target. Current price is ${currency(metrics.price)}.`,
        tone: status.key
      });
    }

    if (metrics.monthlyLeakage > metrics.revenue * 0.18 && ["zomato", "swiggy"].includes(item.channel)) {
      actions.push({
        value: metrics.monthlyLeakage * 0.15,
        title: `Move repeat demand for ${item.name} to direct ordering`,
        body: `${currency(metrics.monthlyLeakage)} is leaking monthly on platform deductions. Start with regulars, corporates, and WhatsApp reorder nudges.`,
        tone: "watch"
      });
    }

    if (numeric(item.discountPct) >= 10) {
      actions.push({
        value: metrics.price * numeric(item.monthlyOrders) * 0.03,
        title: `Cut blanket discounting on ${item.name}`,
        body: `Discount is ${pct(numeric(item.discountPct))}. Replace it with channel-specific offers that protect contribution margin.`,
        tone: "watch"
      });
    }
  });

  return actions
    .filter((action) => action.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function renderOwnerReport() {
  const stats = reportStats();
  const actions = buildRecoveryActions(stats);
  const channelRows = Object.entries(stats.leakageByChannel)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);
  const maxLeakage = Math.max(...channelRows.map(([, value]) => value), 1);

  dom.reportRecovery.textContent = currency(stats.recovery);
  dom.reportQuarterUpside.textContent = currency(stats.recovery * 3);
  dom.reportDirectUpside.textContent = currency(stats.directUpside);
  dom.reportGstPayable.textContent = currency(stats.gstPayable);
  dom.reportPriceCorrections.textContent = stats.priceCorrections.length;
  dom.reportFixCount.textContent = `${actions.length} fixes`;
  dom.channelCount.textContent = `${channelRows.length} channels`;
  dom.reportNarrative.textContent = `This audit reviewed ${Math.round(stats.totals.orders).toLocaleString("en-IN")} monthly orders across ${state.items.length} menu items. Blended contribution margin is ${pct(stats.blendedMargin)} after estimated output GST, and visible monthly recovery opportunity is ${currency(stats.recovery)} before deeper vendor-bill and payout reconciliation.`;

  dom.recoveryList.innerHTML = actions.length ? actions.map((action) => `
    <article class="recovery-item">
      <div>
        <strong>${escapeHtml(action.title)}</strong>
        <p>${escapeHtml(action.body)}</p>
      </div>
      <span class="recovery-value">${currency(action.value)}</span>
    </article>
  `).join("") : `
    <article class="recovery-item">
      <div>
        <strong>No urgent leaks found</strong>
        <p>The current sample is above target. Add real menu and channel data to surface recovery actions.</p>
      </div>
      <span class="recovery-value">${currency(0)}</span>
    </article>
  `;

  dom.channelBars.innerHTML = channelRows.length ? channelRows.map(([channel, value]) => `
    <article class="channel-row">
      <div class="channel-row-top">
        <strong>${escapeHtml(channel)}</strong>
        <span>${currency(value)}</span>
      </div>
      <div class="bar-track" aria-hidden="true">
        <div class="bar-fill" style="width: ${Math.max(5, value / maxLeakage * 100).toFixed(1)}%"></div>
      </div>
    </article>
  `).join("") : `
    <article class="channel-row">
      <div class="channel-row-top">
        <strong>No channel leakage</strong>
        <span>${currency(0)}</span>
      </div>
      <div class="bar-track" aria-hidden="true">
        <div class="bar-fill" style="width: 0%"></div>
      </div>
    </article>
  `;
}

function plainTextReport() {
  const stats = reportStats();
  const actions = buildRecoveryActions(stats);
  const lines = [
    "MarginRx 48-Hour Profit Leakage Summary",
    `Net sales audited: ${currency(stats.totals.revenue)}`,
    `Estimated GST payable: ${currency(stats.gstPayable)}`,
    `Monthly orders audited: ${Math.round(stats.totals.orders).toLocaleString("en-IN")}`,
    `Blended contribution margin: ${pct(stats.blendedMargin)}`,
    `Visible monthly recovery opportunity: ${currency(stats.recovery)}`,
    `90-day upside: ${currency(stats.recovery * 3)}`,
    `Direct-order upside: ${currency(stats.directUpside)}`,
    `Price corrections needed: ${stats.priceCorrections.length}`,
    "",
    "Priority fixes:"
  ];

  actions.forEach((action, index) => {
    lines.push(`${index + 1}. ${action.title} - ${currency(action.value)}`);
    lines.push(`   ${action.body}`);
  });

  return lines.join("\n");
}

function stageInfo(stage) {
  return stageDefinitions.find((entry) => entry.key === stage) || stageDefinitions[0];
}

function isOpenPipelineStage(stage) {
  return !["paid", "retainer", "lost"].includes(stage);
}

function restaurantPipelineValue(restaurant) {
  if (!isOpenPipelineStage(restaurant.stage)) return 0;
  return numeric(restaurant.auditFee) + numeric(restaurant.retainerPotential) * 3;
}

function adminStats() {
  const today = todayIso();
  const openRestaurants = state.admin.restaurants.filter((restaurant) => restaurant.stage !== "lost");
  const activePilots = state.admin.restaurants.filter((restaurant) => ["demo", "pilot", "report"].includes(restaurant.stage)).length;
  const pipeline = openRestaurants.reduce((sum, restaurant) => sum + restaurantPipelineValue(restaurant), 0);
  const recovery = openRestaurants.reduce((sum, restaurant) => sum + numeric(restaurant.recoveryFound), 0);
  const followups = openRestaurants.filter((restaurant) => restaurant.nextFollowup && restaurant.nextFollowup <= today && !["paid", "retainer"].includes(restaurant.stage)).length;

  return {
    activePilots,
    pipeline,
    recovery,
    followups,
    reports: state.admin.reports.length
  };
}

function selectedRestaurant() {
  return state.admin.restaurants.find((restaurant) => restaurant.id === state.admin.selectedRestaurantId) || null;
}

function renderStageOptions() {
  dom.restaurantStageInput.innerHTML = stageDefinitions.map((stage) => `
    <option value="${stage.key}">${stage.label}</option>
  `).join("");
}

function fillRestaurantForm(restaurant) {
  const entry = restaurant || {
    id: "",
    name: "",
    city: "",
    ownerName: "",
    phone: "",
    segment: "Cloud kitchen",
    stage: "lead",
    auditFee: 15000,
    retainerPotential: 25000,
    recoveryFound: 0,
    lastTouch: todayIso(),
    nextFollowup: todayIso(2),
    nextStep: "Book discovery call",
    notes: ""
  };
  const stage = stageInfo(entry.stage);

  dom.restaurantId.value = entry.id || "";
  dom.restaurantNameInput.value = entry.name || "";
  dom.restaurantCityInput.value = entry.city || "";
  dom.restaurantOwnerInput.value = entry.ownerName || "";
  dom.restaurantPhoneInput.value = entry.phone || "";
  dom.restaurantSegmentInput.value = entry.segment || "Cloud kitchen";
  dom.restaurantStageInput.value = entry.stage || "lead";
  dom.restaurantAuditFeeInput.value = entry.auditFee ?? 15000;
  dom.restaurantRetainerInput.value = entry.retainerPotential ?? 25000;
  dom.restaurantRecoveryInput.value = entry.recoveryFound ?? 0;
  dom.restaurantLastTouchInput.value = entry.lastTouch || todayIso();
  dom.restaurantNextFollowupInput.value = entry.nextFollowup || todayIso(2);
  dom.restaurantNextStepInput.value = entry.nextStep || "";
  dom.restaurantNotesInput.value = entry.notes || "";
  dom.restaurantFormTitle.textContent = entry.id ? "Edit Restaurant Lead" : "Add Restaurant Lead";
  dom.restaurantFormStatus.textContent = stage.label;
  dom.restaurantFormStatus.className = `status-pill ${stage.tone}`;
}

function clearRestaurantForm() {
  fillRestaurantForm(null);
}

function getRestaurantForm() {
  return {
    id: dom.restaurantId.value || uid("rest"),
    name: dom.restaurantNameInput.value.trim(),
    city: dom.restaurantCityInput.value.trim(),
    ownerName: dom.restaurantOwnerInput.value.trim(),
    phone: dom.restaurantPhoneInput.value.trim(),
    segment: dom.restaurantSegmentInput.value,
    stage: dom.restaurantStageInput.value,
    auditFee: numeric(dom.restaurantAuditFeeInput.value),
    retainerPotential: numeric(dom.restaurantRetainerInput.value),
    recoveryFound: numeric(dom.restaurantRecoveryInput.value),
    lastTouch: dom.restaurantLastTouchInput.value,
    nextFollowup: dom.restaurantNextFollowupInput.value,
    nextStep: dom.restaurantNextStepInput.value.trim(),
    notes: dom.restaurantNotesInput.value.trim()
  };
}

function saveRestaurant(event) {
  event.preventDefault();
  const restaurant = getRestaurantForm();
  if (!restaurant.name) {
    showToast("Restaurant name is required.");
    return;
  }

  const existingIndex = state.admin.restaurants.findIndex((entry) => entry.id === restaurant.id);
  if (existingIndex >= 0) {
    state.admin.restaurants[existingIndex] = restaurant;
    showToast("Restaurant lead updated.");
  } else {
    state.admin.restaurants.unshift(restaurant);
    showToast("Restaurant lead added.");
  }
  state.admin.selectedRestaurantId = restaurant.id;
  persistAdminState();
  renderAdmin();
}

function renderAdminMetrics() {
  const stats = adminStats();
  dom.adminActivePilots.textContent = stats.activePilots;
  dom.adminPipeline.textContent = currency(stats.pipeline);
  dom.adminRecovery.textContent = currency(stats.recovery);
  dom.adminFollowups.textContent = stats.followups;
  dom.adminReports.textContent = stats.reports;
}

function renderStageBoard() {
  const restaurantsByStage = stageDefinitions.map((stage) => ({
    ...stage,
    restaurants: state.admin.restaurants.filter((restaurant) => restaurant.stage === stage.key)
  }));

  dom.pipelineCount.textContent = `${state.admin.restaurants.length} leads`;
  dom.stageBoard.innerHTML = restaurantsByStage.map((stage) => {
    const stageValue = stage.restaurants.reduce((sum, restaurant) => sum + restaurantPipelineValue(restaurant), 0);
    const cards = stage.restaurants.slice(0, 4).map((restaurant) => `
      <button class="stage-card" data-restaurant-edit="${restaurant.id}" type="button">
        <strong>${escapeHtml(restaurant.name)}</strong>
        <span>${escapeHtml([restaurant.city, restaurant.segment].filter(Boolean).join(" | "))}</span>
        <small>${escapeHtml(restaurant.nextStep || "No next action")}</small>
      </button>
    `).join("");

    return `
      <article class="stage-column">
        <div class="stage-head">
          <strong>${stage.label}</strong>
          <span>${stage.restaurants.length} | ${currency(stageValue)}</span>
        </div>
        <div class="stage-card-list">
          ${cards || `<div class="empty-state">No leads here yet.</div>`}
        </div>
      </article>
    `;
  }).join("");
}

function renderRestaurantTable() {
  const rows = [...state.admin.restaurants].sort((a, b) => {
    const dateA = a.nextFollowup || "9999-12-31";
    const dateB = b.nextFollowup || "9999-12-31";
    return dateA.localeCompare(dateB);
  });
  const selected = selectedRestaurant();
  dom.selectedRestaurantLabel.textContent = selected ? selected.name : "No lead selected";

  if (!rows.length) {
    dom.restaurantTable.innerHTML = `
      <tr>
        <td colspan="6">No restaurant leads yet.</td>
      </tr>
    `;
    return;
  }

  dom.restaurantTable.innerHTML = rows.map((restaurant) => {
    const stage = stageInfo(restaurant.stage);
    return `
      <tr class="${restaurant.id === state.admin.selectedRestaurantId ? "selected-row" : ""}">
        <td class="dish-cell">
          <strong>${escapeHtml(restaurant.name)}</strong>
          <span>${escapeHtml([restaurant.city, restaurant.ownerName].filter(Boolean).join(" | "))}</span>
        </td>
        <td><span class="status-pill ${stage.tone}">${stage.label}</span></td>
        <td>${currency(restaurantPipelineValue(restaurant))}</td>
        <td>${currency(restaurant.recoveryFound)}</td>
        <td class="next-action-cell">
          <strong>${escapeHtml(restaurant.nextFollowup || "No date")}</strong>
          <span>${escapeHtml(restaurant.nextStep || "No next action")}</span>
        </td>
        <td>
          <div class="table-actions admin-actions">
            <button data-restaurant-edit="${restaurant.id}" type="button" class="secondary-button">Edit</button>
            <button data-restaurant-snapshot="${restaurant.id}" type="button" class="secondary-button">Save audit</button>
            <button data-restaurant-paid="${restaurant.id}" type="button">Paid</button>
            <button data-restaurant-delete="${restaurant.id}" type="button" class="danger-button">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function reportSnapshotText(report) {
  const lines = [
    "MarginRx Saved Owner Report",
    `Restaurant: ${report.restaurantName}`,
    `Saved: ${new Date(report.createdAt).toLocaleString("en-IN")}`,
    `Net sales audited: ${currency(report.metrics.revenue)}`,
    `Estimated GST payable: ${currency(report.metrics.gstPayable)}`,
    `Monthly recovery opportunity: ${currency(report.metrics.recovery)}`,
    `90-day upside: ${currency(report.metrics.recovery * 3)}`,
    `Blended contribution margin: ${pct(report.metrics.blendedMargin)}`,
    "",
    "Priority fixes:"
  ];

  report.actions.forEach((action, index) => {
    lines.push(`${index + 1}. ${action.title} - ${currency(action.value)}`);
    lines.push(`   ${action.body}`);
  });

  return lines.join("\n");
}

function renderAuditArchive() {
  dom.auditArchiveCount.textContent = `${state.admin.reports.length} reports`;
  if (!state.admin.reports.length) {
    dom.auditArchive.innerHTML = `
      <article class="archive-card">
        <strong>No saved reports yet</strong>
        <span>Run an audit, select a restaurant lead, then save the current audit here.</span>
      </article>
    `;
    return;
  }

  dom.auditArchive.innerHTML = state.admin.reports.map((report) => `
    <article class="archive-card">
      <div>
        <strong>${escapeHtml(report.restaurantName)}</strong>
        <span>${new Date(report.createdAt).toLocaleString("en-IN")} | ${report.items.length} items | ${currency(report.metrics.recovery)} recovery</span>
      </div>
      <div class="archive-actions">
        <button data-report-load="${report.id}" type="button" class="secondary-button">Load</button>
        <button data-report-copy="${report.id}" type="button" class="secondary-button">Copy</button>
        <button data-report-delete="${report.id}" type="button" class="danger-button">Delete</button>
      </div>
    </article>
  `).join("");
}

function renderAdmin() {
  renderAdminMetrics();
  renderStageBoard();
  renderRestaurantTable();
  renderAuditArchive();
}

function setView(view, updateHistory = true) {
  state.view = view === "admin" ? "admin" : "audit";
  document.body.dataset.view = state.view;
  dom.viewTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.viewTarget === state.view);
  });
  dom.viewPanes.forEach((pane) => {
    pane.classList.toggle("active", pane.dataset.view === state.view);
  });

  if (updateHistory) {
    const nextPath = state.view === "admin" ? "/admin" : "/";
    window.history.pushState({ view: state.view }, "", nextPath);
  }
}

function saveAuditSnapshot(restaurantId = state.admin.selectedRestaurantId) {
  let restaurant = state.admin.restaurants.find((entry) => entry.id === restaurantId);
  if (!restaurant) {
    restaurant = {
      id: uid("rest"),
      name: "Current audit lead",
      city: "",
      ownerName: "",
      phone: "",
      segment: "Cloud kitchen",
      stage: "report",
      auditFee: 15000,
      retainerPotential: 25000,
      recoveryFound: 0,
      lastTouch: todayIso(),
      nextFollowup: todayIso(1),
      nextStep: "Review saved owner report",
      notes: "Created automatically from current audit."
    };
    state.admin.restaurants.unshift(restaurant);
  }

  const stats = reportStats();
  const actions = buildRecoveryActions(stats);
  const report = {
    id: uid("report"),
    restaurantId: restaurant.id,
    restaurantName: restaurant.name,
    createdAt: new Date().toISOString(),
    items: clone(state.items),
    settings: clone(state.settings),
    metrics: {
      revenue: stats.totals.revenue,
      orders: stats.totals.orders,
      contribution: stats.totals.contribution,
      leakage: stats.totals.leakage,
      gstPayable: stats.gstPayable,
      blendedMargin: stats.blendedMargin,
      recovery: stats.recovery,
      directUpside: stats.directUpside,
      priceCorrections: stats.priceCorrections.length
    },
    actions: actions.map((action) => ({
      title: action.title,
      body: action.body,
      value: action.value
    }))
  };

  restaurant.recoveryFound = Math.max(numeric(restaurant.recoveryFound), Math.round(stats.recovery));
  restaurant.lastTouch = todayIso();
  restaurant.nextFollowup = todayIso(1);
  restaurant.nextStep = "Close paid pilot from saved owner report";
  if (isOpenPipelineStage(restaurant.stage)) {
    restaurant.stage = "report";
  }
  state.admin.selectedRestaurantId = restaurant.id;
  state.admin.reports.unshift(report);
  persistAdminState();
  renderAdmin();
  showToast(`Audit saved for ${restaurant.name}.`);
}

function exportAdminData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    restaurants: state.admin.restaurants,
    reports: state.admin.reports,
    currentAudit: {
      items: state.items,
      settings: state.settings,
      stats: reportStats()
    }
  };
  downloadText(`marginrx-admin-export-${todayIso()}.json`, JSON.stringify(payload, null, 2), "application/json");
  showToast("Founder dashboard JSON exported.");
}

function downloadText(filename, text, type = "text/plain") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderAll() {
  persistAuditState();
  renderSettings();
  renderMetrics();
  renderTable();
  renderInsights();
  renderOwnerReport();
  renderAdmin();
  updatePreview();
}

function saveItem(event) {
  event.preventDefault();
  const item = getFormItem();
  if (!item.name) {
    showToast("Dish name is required.");
    return;
  }

  const existingIndex = state.items.findIndex((entry) => entry.id === item.id);
  if (existingIndex >= 0) {
    state.items[existingIndex] = item;
    showToast("Item updated.");
  } else {
    state.items.unshift(item);
    showToast("Item added.");
  }
  clearForm();
  renderAll();
}

function parseCsv(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(",").map((cell) => cell.trim()))
    .filter((cells) => cells[0]?.toLowerCase() !== "name")
    .filter((cells) => cells.length >= 5)
    .map((cells) => {
      const [
        name,
        category,
        channel,
        price,
        foodCost,
        packaging,
        prepMinutes,
        orders,
        commission,
        discount,
        marketing,
        payment,
        waste
      ] = cells;
      const channelKey = Object.keys(channelPresets).includes(channel) ? channel : "zomato";
      const preset = channelPresets[channelKey];
      return {
        id: uid(),
        name,
        category: category || "Imported",
        channel: channelKey,
        sellingPrice: numeric(price),
        foodCost: numeric(foodCost),
        packagingCost: packaging === undefined ? preset.packagingCost : numeric(packaging),
        prepMinutes: prepMinutes === undefined ? 8 : numeric(prepMinutes),
        monthlyOrders: orders === undefined ? 100 : numeric(orders),
        commissionPct: commission === undefined ? preset.commissionPct : numeric(commission),
        discountPct: discount === undefined ? preset.discountPct : numeric(discount),
        marketingPct: marketing === undefined ? preset.marketingPct : numeric(marketing),
        paymentPct: payment === undefined ? preset.paymentPct : numeric(payment),
        wastePct: waste === undefined ? 3 : numeric(waste)
      };
    });
}

function importCsv() {
  const rows = parseCsv(dom.csvInput.value);
  if (!rows.length) {
    showToast("No valid CSV rows found.");
    return;
  }
  state.items = rows;
  state.filter = "all";
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });
  clearForm();
  renderAll();
  showToast(`${rows.length} menu items imported.`);
}

function exportCsv() {
  const header = "name,category,channel,price,foodCost,packaging,prepMinutes,orders,commission,discount,marketing,payment,waste,netSales,gst,commissionGst,contribution,margin,targetPrice";
  const rows = state.items.map((item) => {
    const metrics = calculateItem(item);
    return [
      item.name,
      item.category,
      item.channel,
      item.sellingPrice,
      item.foodCost,
      item.packagingCost,
      item.prepMinutes,
      item.monthlyOrders,
      item.commissionPct,
      item.discountPct,
      item.marketingPct,
      item.paymentPct,
      item.wastePct,
      metrics.netRevenue.toFixed(2),
      metrics.outputGst.toFixed(2),
      metrics.commissionGst.toFixed(2),
      metrics.contribution.toFixed(2),
      metrics.marginPct.toFixed(2),
      metrics.targetPrice.toFixed(2)
    ].join(",");
  });
  dom.csvInput.value = [header, ...rows].join("\n");
  showToast("CSV export is ready in the intake box.");
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    dom.toast.classList.remove("visible");
  }, 2600);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindEvents() {
  dom.viewTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      setView(tab.dataset.viewTarget);
    });
  });

  window.addEventListener("popstate", () => {
    setView(initialView(), false);
  });

  dom.targetMarginInput.addEventListener("input", () => {
    state.settings.targetMarginPct = numeric(dom.targetMarginInput.value);
    renderAll();
  });

  dom.laborRateInput.addEventListener("input", () => {
    state.settings.laborRatePerHour = numeric(dom.laborRateInput.value);
    renderAll();
  });

  dom.inputTaxInput.addEventListener("input", () => {
    state.settings.inputTaxBurdenPct = numeric(dom.inputTaxInput.value);
    renderAll();
  });

  dom.priceIncludesGstInput.addEventListener("change", () => {
    state.settings.priceIncludesGst = dom.priceIncludesGstInput.checked;
    renderAll();
  });

  dom.outputGstInput.addEventListener("input", () => {
    state.settings.outputGstPct = numeric(dom.outputGstInput.value);
    renderAll();
  });

  dom.commissionGstInput.addEventListener("input", () => {
    state.settings.commissionGstPct = numeric(dom.commissionGstInput.value);
    renderAll();
  });

  dom.resetDefaultsButton.addEventListener("click", () => {
    state.settings = { ...defaultSettings };
    renderAll();
    showToast("Assumptions reset.");
  });

  dom.presetList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    applyPreset(button.dataset.preset);
  });

  dom.channelInput.addEventListener("change", () => applyPreset(dom.channelInput.value));

  [
    dom.nameInput,
    dom.categoryInput,
    dom.ordersInput,
    dom.priceInput,
    dom.foodCostInput,
    dom.packagingInput,
    dom.prepInput,
    dom.commissionInput,
    dom.discountInput,
    dom.marketingInput,
    dom.paymentInput,
    dom.wasteInput
  ].forEach((input) => input.addEventListener("input", updatePreview));

  dom.itemForm.addEventListener("submit", saveItem);
  dom.clearFormButton.addEventListener("click", clearForm);
  dom.addFreshButton.addEventListener("click", clearForm);

  dom.sampleButton.addEventListener("click", () => {
    state.items = clone(sampleItems);
    clearForm();
    renderAll();
    showToast("Sample audit loaded.");
  });

  dom.printReportButton.addEventListener("click", () => {
    window.print();
  });

  dom.copyReportButton.addEventListener("click", async () => {
    const report = plainTextReport();
    try {
      await navigator.clipboard.writeText(report);
      showToast("Owner report copied.");
    } catch (error) {
      dom.csvInput.value = report;
      showToast("Clipboard blocked. Report placed in CSV box.");
    }
  });

  dom.importCsvButton.addEventListener("click", importCsv);
  dom.exportCsvButton.addEventListener("click", exportCsv);

  dom.restaurantForm.addEventListener("submit", saveRestaurant);
  dom.clearRestaurantButton.addEventListener("click", clearRestaurantForm);
  dom.restaurantStageInput.addEventListener("change", () => {
    const stage = stageInfo(dom.restaurantStageInput.value);
    dom.restaurantFormStatus.textContent = stage.label;
    dom.restaurantFormStatus.className = `status-pill ${stage.tone}`;
  });
  dom.saveAuditSnapshotButton.addEventListener("click", () => saveAuditSnapshot());
  dom.exportAdminButton.addEventListener("click", exportAdminData);

  document.querySelector(".filter-group").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach((entry) => {
      entry.classList.toggle("active", entry === button);
    });
    renderTable();
  });

  dom.menuTable.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");
    if (editButton) {
      const item = state.items.find((entry) => entry.id === editButton.dataset.edit);
      if (item) {
        fillForm(item);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (deleteButton) {
      state.items = state.items.filter((entry) => entry.id !== deleteButton.dataset.delete);
      renderAll();
      showToast("Item deleted.");
    }
  });

  dom.stageBoard.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-restaurant-edit]");
    if (!editButton) return;
    const restaurant = state.admin.restaurants.find((entry) => entry.id === editButton.dataset.restaurantEdit);
    if (!restaurant) return;
    state.admin.selectedRestaurantId = restaurant.id;
    fillRestaurantForm(restaurant);
    persistAdminState();
    renderAdmin();
  });

  dom.restaurantTable.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-restaurant-edit]");
    const snapshotButton = event.target.closest("[data-restaurant-snapshot]");
    const paidButton = event.target.closest("[data-restaurant-paid]");
    const deleteButton = event.target.closest("[data-restaurant-delete]");

    if (editButton) {
      const restaurant = state.admin.restaurants.find((entry) => entry.id === editButton.dataset.restaurantEdit);
      if (!restaurant) return;
      state.admin.selectedRestaurantId = restaurant.id;
      fillRestaurantForm(restaurant);
      persistAdminState();
      renderAdmin();
      return;
    }

    if (snapshotButton) {
      state.admin.selectedRestaurantId = snapshotButton.dataset.restaurantSnapshot;
      saveAuditSnapshot(snapshotButton.dataset.restaurantSnapshot);
      return;
    }

    if (paidButton) {
      const restaurant = state.admin.restaurants.find((entry) => entry.id === paidButton.dataset.restaurantPaid);
      if (!restaurant) return;
      restaurant.stage = "paid";
      restaurant.lastTouch = todayIso();
      restaurant.nextStep = "Convert into monthly MarginRx retainer";
      restaurant.nextFollowup = todayIso(7);
      state.admin.selectedRestaurantId = restaurant.id;
      fillRestaurantForm(restaurant);
      persistAdminState();
      renderAdmin();
      showToast(`${restaurant.name} marked as paid.`);
      return;
    }

    if (deleteButton) {
      const restaurantId = deleteButton.dataset.restaurantDelete;
      state.admin.restaurants = state.admin.restaurants.filter((entry) => entry.id !== restaurantId);
      if (state.admin.selectedRestaurantId === restaurantId) {
        state.admin.selectedRestaurantId = state.admin.restaurants[0]?.id || "";
        clearRestaurantForm();
      }
      persistAdminState();
      renderAdmin();
      showToast("Restaurant lead deleted.");
    }
  });

  dom.auditArchive.addEventListener("click", async (event) => {
    const loadButton = event.target.closest("[data-report-load]");
    const copyButton = event.target.closest("[data-report-copy]");
    const deleteButton = event.target.closest("[data-report-delete]");

    if (loadButton) {
      const report = state.admin.reports.find((entry) => entry.id === loadButton.dataset.reportLoad);
      if (!report) return;
      state.items = clone(report.items);
      state.settings = { ...defaultSettings, ...clone(report.settings) };
      persistAuditState();
      renderAll();
      setView("audit");
      showToast(`Loaded saved audit for ${report.restaurantName}.`);
      return;
    }

    if (copyButton) {
      const report = state.admin.reports.find((entry) => entry.id === copyButton.dataset.reportCopy);
      if (!report) return;
      const text = reportSnapshotText(report);
      try {
        await navigator.clipboard.writeText(text);
        showToast("Saved report copied.");
      } catch (error) {
        dom.csvInput.value = text;
        showToast("Clipboard blocked. Report placed in CSV box.");
      }
      return;
    }

    if (deleteButton) {
      state.admin.reports = state.admin.reports.filter((entry) => entry.id !== deleteButton.dataset.reportDelete);
      persistAdminState();
      renderAdmin();
      showToast("Saved report deleted.");
    }
  });
}

renderPresets();
renderStageOptions();
bindEvents();
clearForm();
fillRestaurantForm(selectedRestaurant());
renderAll();
setView(state.view, false);
