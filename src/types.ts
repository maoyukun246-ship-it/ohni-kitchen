import type { LucideIcon } from "lucide-react";

export type View = "home" | "restaurant" | "learn" | "shop" | "profile";

export type StageId = 1 | 2 | 3 | 4 | 5;

export type QuestionKind = "choice" | "match";

export type FurnitureCategory =
  | "all"
  | "recipes"
  | "tables"
  | "chairs"
  | "lights"
  | "walls"
  | "floors"
  | "decor"
  | "kitchen"
  | "plants";

export type FurnitureItem = {
  id: string;
  name: string;
  category: Exclude<FurnitureCategory, "all" | "recipes">;
  price: number;
  levelRequired: number;
  style: "warm" | "mint" | "industrial" | "sakura" | "modern" | "green";
  shape: "round-table" | "square-table" | "chair" | "lamp" | "wall" | "floor" | "plant" | "kitchen" | "decor";
  description: string;
};

export type RecipeItem = {
  id: string;
  name: string;
  korean: string;
  price: number;
  stageRequired: StageId;
  description: string;
  shape: "rice" | "noodles" | "bibimbap" | "gimbap" | "tteokbokki" | "bbq" | "soup" | "chicken";
};

export type LessonStage = {
  id: StageId;
  title: string;
  subtitle: string;
  unlocks: string;
  grammar?: string;
};

export type Question = {
  id: string;
  stage: StageId;
  kind: QuestionKind;
  prompt: string;
  korean?: string;
  pronunciation?: string;
  explanation: string;
  options?: string[];
  answer?: string;
  pairs?: Array<{ left: string; right: string }>;
};

export type NavItem = {
  view: View;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
};
