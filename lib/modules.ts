export const houseModules = [
  {
    key: "founders_codex",
    label: "Founder's Codex",
    shortLabel: "Codex",
    description: "The source text for identity, standards, doctrine, and founder judgment."
  },
  {
    key: "projects",
    label: "Projects",
    shortLabel: "Projects",
    description: "Strategic initiatives, operating priorities, experiments, and build logs."
  },
  {
    key: "relationships",
    label: "Relationships",
    shortLabel: "Relationships",
    description: "People, institutions, allies, advisors, partners, and relationship context."
  },
  {
    key: "decisions",
    label: "Decisions",
    shortLabel: "Decisions",
    description: "High-consequence calls, rationale, alternatives, and future review points."
  },
  {
    key: "principles",
    label: "Principles",
    shortLabel: "Principles",
    description: "Operating principles, taste, ethics, standards, and strategic rules."
  },
  {
    key: "wealth",
    label: "Wealth",
    shortLabel: "Wealth",
    description: "Capital frameworks, allocation logic, compounding maps, and risk posture."
  },
  {
    key: "prophetic_record",
    label: "Prophetic Record",
    shortLabel: "Prophetic",
    description: "Predictions, intuitions, thesis records, signals, and later outcomes."
  }
] as const;

export type HouseModule = (typeof houseModules)[number]["key"];

export const defaultModule: HouseModule = "founders_codex";

export function isHouseModule(value: string | null | undefined): value is HouseModule {
  return Boolean(value && houseModules.some((module) => module.key === value));
}

export function normalizeModule(value: string | null | undefined): HouseModule {
  return isHouseModule(value) ? value : defaultModule;
}

export function moduleLabel(moduleKey: string | null | undefined) {
  return houseModules.find((module) => module.key === moduleKey)?.label ?? "House Record";
}
