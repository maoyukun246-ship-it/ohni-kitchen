import { useEffect, useRef } from "react";
import { createRestaurantGame } from "@/game/main";
import type { FurnitureItem } from "@/types";

export function PhaserRestaurantCanvas({ installedItems }: { installedItems: FurnitureItem[] }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<ReturnType<typeof createRestaurantGame> | null>(null);

  useEffect(() => {
    if (!hostRef.current || gameRef.current) return;
    gameRef.current = createRestaurantGame(hostRef.current);
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("ohni:restaurant:update", {
        detail: {
          equippedItems: installedItems.map((item) => item.id),
        },
      }),
    );
  }, [installedItems]);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" aria-label="Phaser 餐厅经营场景" />;
}
