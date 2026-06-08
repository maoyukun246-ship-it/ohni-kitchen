import type { FurnitureItem } from "@/types";

export const furnitureAssetById: Record<string, string> = {
  "oak-round-table": "/assets_v2/furniture/oak-round-table.png",
  "mint-round-table": "/assets_v2/furniture/mint-round-table.png",
  "industrial-square-table": "/assets_v2/furniture/industrial-square-table.png",
  "sakura-round-table": "/assets_v2/furniture/sakura-round-table.png",
  "wood-chair": "/assets_v2/furniture/wood-chair.png",
  "mint-chair": "/assets_v2/furniture/mint-chair.png",
  "iron-chair": "/assets_v2/furniture/iron-chair.png",
  "pink-bow-chair": "/assets_v2/furniture/pink-bow-chair.png",
  "warm-pendant": "/assets_v2/furniture/warm-pendant.png",
  "mint-pendant": "/assets_v2/furniture/mint-pendant.png",
  "industrial-pendant": "/assets_v2/furniture/industrial-pendant.png",
  "sakura-pendant": "/assets_v2/furniture/sakura-pendant.png",
  "hanok-wall": "/assets_v2/wallpaper/hanok-wall.png",
  "mint-wall": "/assets_v2/wallpaper/mint-wall.png",
  "dopamine-wall": "/assets_v2/wallpaper/dopamine-wall.png",
  "industrial-wall": "/assets_v2/wallpaper/industrial-wall.png",
  "cream-flower-wall": "/assets_v2/wallpaper/cream-flower-wall.png",
  "wood-floor": "/assets_v2/flooring/wood-floor.png",
  "mint-tile-floor": "/assets_v2/flooring/mint-tile-floor.png",
  "marble-floor": "/assets_v2/flooring/marble-floor.png",
  "checker-floor": "/assets_v2/flooring/checker-floor.png",
  "menu-board": "/assets_v2/furniture/menu-board.png",
  "wind-chime": "/assets_v2/furniture/wind-chime.png",
  "large-ornament": "/assets_v2/furniture/large-ornament.png",
  "wall-clock": "/assets_v2/furniture/wall-clock.png",
  "open-kitchen": "/assets_v2/furniture/open-kitchen.png",
  "mint-kitchen": "/assets_v2/furniture/mint-kitchen.png",
  "dopamine-kitchen": "/assets_v2/furniture/dopamine-kitchen.png",
  "industrial-kitchen": "/assets_v2/furniture/industrial-kitchen.png",
  "cream-kitchen": "/assets_v2/furniture/cream-kitchen.png",
  "window-plant": "/assets_v2/furniture/window-plant.png",
  "big-monstera": "/assets_v2/furniture/big-monstera.png",
  "tulip-pot": "/assets_v2/furniture/tulip-pot.png",
  "lavender-pot": "/assets_v2/furniture/lavender-pot.png",
  "daisy-pot": "/assets_v2/furniture/daisy-pot.png",
};

const shopSizeByCategory: Record<FurnitureItem["category"], string> = {
  tables: "h-36 w-44",
  chairs: "h-36 w-28",
  lights: "h-36 w-28",
  walls: "h-36 w-44",
  floors: "h-36 w-44",
  decor: "h-36 w-32",
  kitchen: "h-36 w-52",
  plants: "h-36 w-36",
};

export const getFurnitureAssetPath = (item: FurnitureItem) =>
  furnitureAssetById[item.id] ?? "/assets_v2/ui/placeholder.png";

export function FurnitureIllustration({
  item,
  small = false,
  className = "",
}: {
  item: FurnitureItem;
  small?: boolean;
  className?: string;
}) {
  return (
    <img
      src={getFurnitureAssetPath(item)}
      alt={`${item.name} 插画`}
      className={`mx-auto object-contain ${small ? "h-20 w-20" : shopSizeByCategory[item.category]} ${className}`}
      draggable={false}
      onError={(event) => {
        event.currentTarget.src = "/assets_v2/ui/placeholder.png";
      }}
    />
  );
}
