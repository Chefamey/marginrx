import type { HouseModule } from "@/lib/modules";

export type HouseEntry = {
  id: string;
  user_id: string;
  module: HouseModule;
  title: string;
  category: string;
  tags: string[];
  entry_date: string;
  body: string;
  context: string | null;
  created_at: string;
  updated_at: string;
};

export type HouseEntryPayload = {
  module: HouseModule;
  title: string;
  category: string;
  tags: string[];
  entry_date: string;
  body: string;
  context: string | null;
};
