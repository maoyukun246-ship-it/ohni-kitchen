import type { RecipeItem } from "@/types";

const foodAssetByShape: Record<RecipeItem["shape"], string> = {
  rice: "/assets_v2/foods/kimchi-fried-rice.png",
  noodles: "/assets_v2/foods/ramen.png",
  bibimbap: "/assets_v2/foods/bibimbap.png",
  gimbap: "/assets_v2/foods/gimbap.png",
  tteokbokki: "/assets_v2/foods/tteokbokki.png",
  bbq: "/assets_v2/foods/bulgogi.png",
  soup: "/assets_v2/foods/doenjang-jjigae.png",
  chicken: "/assets_v2/foods/korean-fried-chicken.png",
};

export function FoodIllustration({ recipe, large = false }: { recipe: RecipeItem; large?: boolean }) {
  return (
    <img
      src={foodAssetByShape[recipe.shape] ?? "/assets_v2/ui/placeholder.png"}
      alt={`${recipe.name} 插画`}
      className={`mx-auto mt-3 object-contain ${large ? "h-52 w-60" : "h-40 w-48"}`}
      draggable={false}
      onError={(event) => {
        event.currentTarget.src = "/assets_v2/ui/placeholder.png";
      }}
    />
  );
}
