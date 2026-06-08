export type RestaurantSaveState = {
  coins: number;
  level: number;
  ownedItems: string[];
  equippedItems: string[];
};

const SAVE_KEY = "ohni-kitchen-save";

export class SaveSystem {
  static read(): RestaurantSaveState {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return { coins: 0, level: 1, ownedItems: [], equippedItems: [] };
      const parsed = JSON.parse(raw);
      const state = parsed?.state ?? parsed;
      return {
        coins: Number(state?.coins ?? 0),
        level: Number(state?.level ?? 1),
        ownedItems: Array.isArray(state?.ownedItems) ? state.ownedItems : [],
        equippedItems: Array.isArray(state?.equippedItems) ? state.equippedItems : [],
      };
    } catch {
      return { coins: 0, level: 1, ownedItems: [], equippedItems: [] };
    }
  }
}
