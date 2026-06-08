import { create } from "zustand";
import { persist } from "zustand/middleware";
import { furnitureItems } from "../data/furniture";
import { questions } from "../data/lessons";
import { recipeItems } from "../data/recipes";

type AnswerResult = {
  correct: boolean;
  earned: number;
  combo: number;
  stageCompleted: boolean;
};

type CheckInResult = {
  ok: boolean;
  message: string;
  reward: number;
  streak: number;
};

type GameState = {
  playerName: string;
  coins: number;
  level: number;
  xp: number;
  combo: number;
  completedQuestionIds: string[];
  ownedItems: string[];
  equippedItems: string[];
  unlockedRecipes: string[];
  purchasedRecipeIds: string[];
  currentStage: number;
  lastCheckInDate: string | null;
  checkInStreak: number;
  setPlayerName: (name: string) => void;
  addCoins: (amount: number) => void;
  checkInToday: () => CheckInResult;
  answerQuestion: (questionId: string, correct: boolean) => AnswerResult;
  buyFurniture: (id: string) => { ok: boolean; message: string };
  buyRecipe: (id: string) => { ok: boolean; message: string };
  selectFurniture: (id: string) => { ok: boolean; message: string };
  resetProgress: () => void;
};

const initialState = {
  playerName: "中国小老板",
  coins: 1280,
  level: 1,
  xp: 0,
  combo: 0,
  completedQuestionIds: [] as string[],
  ownedItems: [] as string[],
  equippedItems: [] as string[],
  unlockedRecipes: [] as string[],
  purchasedRecipeIds: [] as string[],
  currentStage: 1,
  lastCheckInDate: null as string | null,
  checkInStreak: 0,
};

const stageForLevel = (level: number) => Math.min(5, Math.max(1, level));

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const daysBetween = (from: string, to: string) => {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((toUtc - fromUtc) / 86_400_000);
};

const isStageCompleted = (stage: number, completedQuestionIds: string[]) => {
  const stageQuestions = questions.filter((item) => item.stage === stage);
  return stageQuestions.length > 0 && stageQuestions.every((item) => completedQuestionIds.includes(item.id));
};

const equipFurniture = (equippedItems: string[], id: string) => {
  const item = furnitureItems.find((entry) => entry.id === id);
  if (!item) return equippedItems;
  const sameCategoryIds = furnitureItems
    .filter((entry) => entry.category === item.category)
    .map((entry) => entry.id);
  return [...equippedItems.filter((selectedId) => !sameCategoryIds.includes(selectedId)), id];
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setPlayerName: (name) => set({ playerName: name.trim().slice(0, 12) || initialState.playerName }),
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      checkInToday: () => {
        const state = get();
        const today = localDateKey();
        if (state.lastCheckInDate === today) {
          return {
            ok: false,
            message: "今天已经签到过啦，明天再来小厨房领金币。",
            reward: 0,
            streak: state.checkInStreak,
          };
        }

        const continued =
          state.lastCheckInDate !== null && daysBetween(state.lastCheckInDate, today) === 1;
        const nextStreak = continued ? Math.min(state.checkInStreak + 1, 7) : 1;
        const reward = nextStreak >= 7 ? 500 : 120;
        const savedStreak = nextStreak >= 7 ? 0 : nextStreak;

        set({
          coins: state.coins + reward,
          lastCheckInDate: today,
          checkInStreak: savedStreak,
        });

        return {
          ok: true,
          message:
            nextStreak >= 7
              ? "连续 7 天签到完成！今天领取七日大奖 500 金币。"
              : `签到成功！连续签到 ${nextStreak} 天，领取 ${reward} 金币。`,
          reward,
          streak: nextStreak,
        };
      },
      answerQuestion: (questionId, correct) => {
        const state = get();
        const alreadyDone = state.completedQuestionIds.includes(questionId);
        const question = questions.find((item) => item.id === questionId);
        const nextCombo = correct ? state.combo + 1 : 0;
        const earned = correct ? 80 + Math.min(nextCombo * 15, 120) : 0;
        const completedQuestionIds =
          correct && !alreadyDone ? [...state.completedQuestionIds, questionId] : state.completedQuestionIds;
        const xpGain = correct && !alreadyDone ? 24 : correct ? 8 : 0;
        const nextXp = state.xp + xpGain;
        const nextLevel = Math.min(5, Math.max(state.level, Math.floor(nextXp / 90) + 1));
        const stageCompleted = Boolean(question && isStageCompleted(question.stage, completedQuestionIds));

        set({
          coins: state.coins + earned,
          combo: nextCombo,
          completedQuestionIds,
          xp: nextXp,
          level: nextLevel,
          currentStage: Math.max(
            state.currentStage,
            question ? question.stage : state.currentStage,
            stageForLevel(nextLevel),
          ),
        });

        return { correct, earned, combo: nextCombo, stageCompleted };
      },
      buyFurniture: (id) => {
        const state = get();
        const item = furnitureItems.find((entry) => entry.id === id);
        if (!item) return { ok: false, message: "没有找到这个商品。" };
        if (state.ownedItems.includes(id)) {
          set({ equippedItems: equipFurniture(state.equippedItems, id) });
          return { ok: true, message: "已经拥有，已安装到餐厅。" };
        }
        if (state.level < item.levelRequired) {
          return { ok: false, message: `餐厅等级 Lv.${item.levelRequired} 后可购买。` };
        }
        if (state.coins < item.price) {
          return { ok: false, message: "金币还不够，先去完成几道韩语题吧。" };
        }
        set({
          coins: state.coins - item.price,
          ownedItems: [...state.ownedItems, id],
          equippedItems: equipFurniture(state.equippedItems, id),
        });
        return { ok: true, message: "购买成功，已自动安装到餐厅。" };
      },
      buyRecipe: (id) => {
        const state = get();
        const recipe = recipeItems.find((entry) => entry.id === id);
        if (!recipe) return { ok: false, message: "没有找到这个菜谱。" };
        if (state.purchasedRecipeIds.includes(id)) {
          return { ok: true, message: "这道菜谱已经加入菜单啦。" };
        }
        if (!isStageCompleted(recipe.stageRequired, state.completedQuestionIds)) {
          return { ok: false, message: `完成第 ${recipe.stageRequired} 阶段所有题目后，才可以购买这道菜谱。` };
        }
        if (state.coins < recipe.price) {
          return { ok: false, message: "金币还不够，先去学习关卡赚一点吧。" };
        }
        set({
          coins: state.coins - recipe.price,
          purchasedRecipeIds: [...state.purchasedRecipeIds, id],
          unlockedRecipes: [...state.unlockedRecipes, recipe.name],
        });
        return { ok: true, message: `${recipe.name} 已加入餐厅菜单。` };
      },
      selectFurniture: (id) => {
        const state = get();
        const item = furnitureItems.find((entry) => entry.id === id);
        if (!item) return { ok: false, message: "没有找到这个家具。" };
        if (!state.ownedItems.includes(id)) {
          return { ok: false, message: "请先购买，再安装到餐厅。" };
        }
        set({ equippedItems: equipFurniture(state.equippedItems, id) });
        return { ok: true, message: `${item.name} 已安装，餐厅场景已更新。` };
      },
      resetProgress: () => set(initialState),
    }),
    {
      name: "ohni-kitchen-save",
      version: 9,
      merge: (persisted, current) => ({ ...current, ...(persisted as Partial<GameState>) }),
    },
  ),
);
