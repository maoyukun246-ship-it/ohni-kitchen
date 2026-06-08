import type { ReactNode } from "react";

export function WoodenSignFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="relative mt-5 overflow-hidden p-4 sm:p-5">
      <img
        src="/assets_v2/ui/hangul-wood-board.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
        draggable={false}
        onError={(event) => {
          event.currentTarget.src = "/assets_v2/ui/placeholder.png";
        }}
      />
      <div className="relative p-4 sm:p-5">
        <div className="mx-auto mb-5 w-fit px-7 py-2 text-center">
          <h3 className="text-xl font-black text-[#734425]">{title}</h3>
        </div>
        {children}
      </div>
    </section>
  );
}

export function WoodenSoundTile({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden p-3">
      <img
        src="/assets_v2/ui/hangul-wood-tile.png"
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
        draggable={false}
        onError={(event) => {
          event.currentTarget.src = "/assets_v2/ui/placeholder.png";
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
