import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  ChefHat,
  Coins,
  Gift,
  Home,
  RotateCcw,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Volume2,
} from "lucide-react";
import Lenis from "lenis";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FoodIllustration } from "@/components/illustrations/FoodIllustrations";
import { FurnitureIllustration } from "@/components/illustrations/FurnitureIllustrations";
import { PhaserRestaurantCanvas } from "@/components/PhaserRestaurantCanvas";
import { WoodenSignFrame, WoodenSoundTile } from "@/components/illustrations/WoodenHangulBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { categories, furnitureItems, restaurantStages } from "./data/furniture";
import { hangulSounds, vowels, consonants, type HangulSound } from "./data/hangul";
import { lessonStages, questions } from "./data/lessons";
import { recipeItems } from "./data/recipes";
import { useGameStore } from "./store/gameStore";
import type { FurnitureCategory, FurnitureItem, NavItem, Question, RecipeItem, View } from "./types";

const navItems: NavItem[] = [
  { view: "restaurant", label: "餐厅经营", icon: Store },
  { view: "learn", label: "韩语学习", icon: BookOpen, badge: true },
  { view: "shop", label: "装修商店", icon: ShoppingBag, badge: true },
  { view: "profile", label: "我的餐厅", icon: Home },
];

let cachedKoreanVoice: SpeechSynthesisVoice | null = null;

function prepareKoreanVoice() {
  if (!("speechSynthesis" in window)) return;
  const pick = () => {
    cachedKoreanVoice =
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith("ko")) ?? null;
  };
  pick();
  window.speechSynthesis.addEventListener("voiceschanged", pick);
  window.speechSynthesis.resume();
}

function speakKorean(text?: string) {
  if (!text || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.94;
  utterance.pitch = 1.05;
  utterance.volume = 1;
  if (cachedKoreanVoice) utterance.voice = cachedKoreanVoice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.resume();
  window.speechSynthesis.speak(utterance);
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const level = useGameStore((state) => state.level);

  useEffect(() => {
    prepareKoreanVoice();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.88,
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8ebd5] text-[#6a432d]">
      <div className="fixed inset-0 -z-30 bg-[linear-gradient(180deg,#fff2d5_0%,#f4c987_48%,#bd7442_100%)]" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(255,244,201,.96),transparent_35%),radial-gradient(circle_at_14%_32%,rgba(255,194,96,.34),transparent_28%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,.55),transparent_22%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-52 bg-[linear-gradient(180deg,rgba(255,246,212,.9),rgba(255,214,139,.2),transparent)]" />
      <TooltipProvider delayDuration={180}>
        <TopHud onHome={() => setView("home")} />
        <main className="mx-auto min-h-screen w-full max-w-[1440px] px-3 pb-28 pt-24 sm:px-5">
          <AnimatePresence mode="wait">
            {view === "home" && <HomeScreen key="home" onStart={() => setView("restaurant")} />}
            {view === "restaurant" && <RestaurantScreen key="restaurant" onLearn={() => setView("learn")} />}
            {view === "learn" && <LearningScreen key="learn" />}
            {view === "shop" && <ShopScreen key="shop" />}
            {view === "profile" && <ProfileScreen key="profile" />}
          </AnimatePresence>
        </main>
        {view !== "home" && <GameDock active={view} level={level} onNavigate={setView} />}
      </TooltipProvider>
    </div>
  );
}

function TopHud({ onHome }: { onHome: () => void }) {
  const coins = useGameStore((state) => state.coins);
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const progress = Math.min(100, ((xp % 90) / 90) * 100 || (level === 5 ? 100 : 8));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-[#fff1dc]/75 shadow-[0_18px_60px_rgba(151,82,32,.16)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-3 px-3 sm:px-5">
        <button
          onClick={onHome}
          className="group flex items-center gap-2 rounded-[24px] px-2 py-1 transition hover:bg-white/40"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/70 shadow-[inset_0_2px_0_rgba(255,255,255,.9),0_10px_24px_rgba(146,82,35,.16)]">
            <ChefHat className="h-8 w-8 text-[#cc6a3a]" />
          </span>
          <span className="text-left">
            <span className="block text-2xl font-black text-[#9b552f] sm:text-3xl">欧尼小厨房</span>
            <span className="hidden text-xs font-black uppercase tracking-[.2em] text-[#b77843] sm:block">
              Onni Kitchen
            </span>
          </span>
        </button>
        <div className="ml-auto flex min-w-0 items-center gap-2">
          <HudPill icon={<Coins className="h-5 w-5 text-[#e5a23f]" />} text={`金币 ${coins.toLocaleString()}`} />
          <DailyCheckInButton />
          <div className="hidden min-w-52 rounded-[22px] border border-white/60 bg-white/55 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_10px_25px_rgba(137,77,32,.1)] sm:block">
            <div className="flex justify-between text-sm font-black">
              <span>餐厅等级 Lv.{level}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#dcc7aa]">
              <motion.div
                className="h-full rounded-full bg-[#87c7a1]"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function DailyCheckInButton() {
  const checkInToday = useGameStore((state) => state.checkInToday);
  const lastCheckInDate = useGameStore((state) => state.lastCheckInDate);
  const checkInStreak = useGameStore((state) => state.checkInStreak);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("每天签到可以领取 120 金币，连续第 7 天可以领取 500 金币大奖。");
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}-${`${today.getDate()}`.padStart(2, "0")}`;
  const checked = lastCheckInDate === todayKey;
  const nextDay = checked ? checkInStreak || 1 : Math.min((checkInStreak || 0) + 1, 7);

  const handleCheckIn = () => {
    const result = checkInToday();
    setMessage(result.message);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          onClick={() => {
            setMessage(
              checked
                ? `今天已经签到过啦。当前连续签到 ${checkInStreak} 天。`
                : `今天签到可领取 ${nextDay >= 7 ? 500 : 120} 金币。`,
            );
          }}
          className="hidden items-center gap-2 rounded-[22px] border border-white/60 bg-white/55 px-3 py-3 text-sm font-black shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_10px_25px_rgba(137,77,32,.1)] transition hover:-translate-y-0.5 hover:bg-white/70 sm:flex"
        >
          <CalendarCheck className="h-5 w-5 text-[#d67642]" />
          <span>{checked ? "已签到" : "签到"}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>每日签到</DialogTitle>
          <DialogDescription>连续签到 7 天，可以领取更多金币来装修小厨房。</DialogDescription>
        </DialogHeader>
        <div className="mt-5 rounded-[28px] border border-white/60 bg-[#fff8eb]/80 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.85)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#b56a3b]">当前连续签到</p>
              <p className="mt-1 text-4xl font-black text-[#8c4f31]">{checkInStreak} 天</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#ffe3a9] text-[#a45b34] shadow-[0_14px_30px_rgba(121,67,32,.18)]">
              <Gift className="h-9 w-9" />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, index) => {
              const day = index + 1;
              const active = checked ? day <= checkInStreak : day <= checkInStreak || day === nextDay;
              return (
                <div
                  key={day}
                  className={`rounded-2xl border px-2 py-3 text-center text-xs font-black ${
                    active
                      ? "border-[#efb45d] bg-[#ffd889] text-[#7a432b]"
                      : "border-white/55 bg-white/55 text-[#9a765e]"
                  }`}
                >
                  <p>第{day}天</p>
                  <p className="mt-1">{day === 7 ? "500" : "120"}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 rounded-2xl bg-white/55 px-4 py-3 text-sm font-bold leading-6 text-[#76513a]">{message}</p>
        </div>
        <Button disabled={checked} onClick={handleCheckIn} className="mt-5 w-full" size="lg">
          {checked ? "今天已领取" : `签到领取 ${nextDay >= 7 ? 500 : 120} 金币`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function HudPill({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-[22px] border border-white/60 bg-white/55 px-3 py-3 text-sm font-black shadow-[inset_0_1px_0_rgba(255,255,255,.85),0_10px_25px_rgba(137,77,32,.1)] sm:text-base">
      {icon}
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}

function NameSettings({ compact }: { compact: boolean }) {
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(playerName);

  const save = () => {
    setPlayerName(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant={compact ? "glass" : "default"}
              size={compact ? "icon" : "default"}
              onClick={() => setDraft(playerName)}
              aria-label="设置老板姓名"
              className={compact ? "h-10 w-10 rounded-2xl" : "mt-5"}
            >
              <Settings className="h-5 w-5" />
              {!compact && "设置老板姓名"}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        {compact && <TooltipContent>修改老板姓名</TooltipContent>}
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>设置老板姓名</DialogTitle>
          <DialogDescription>这个名字会显示在餐厅经营界面的老板卡片上。</DialogDescription>
        </DialogHeader>
        <label className="mt-5 block text-sm font-black text-[#9a5a34]" htmlFor={compact ? "player-name-compact" : "player-name-home"}>
          老板姓名
        </label>
        <input
          id={compact ? "player-name-compact" : "player-name-home"}
          value={draft}
          maxLength={12}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") save();
          }}
          className="mt-2 w-full rounded-2xl border border-[#e8c99a] bg-white/80 px-4 py-3 font-black text-[#6a432d] outline-none focus:border-[#eea04d]"
          placeholder="例如：小林老板"
        />
        <div className="mt-5 flex gap-2">
          <Button className="flex-1" type="button" onClick={save}>保存</Button>
          <DialogClose asChild>
            <Button className="flex-1" variant="glass" type="button">取消</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HomeScreen({ onStart }: { onStart: () => void }) {
  const coins = useGameStore((state) => state.coins);
  const level = useGameStore((state) => state.level);
  const done = useGameStore((state) => state.completedQuestionIds.length);
  const playerName = useGameStore((state) => state.playerName);

  return (
    <ScreenMotion className="grid min-h-[calc(100vh-13rem)] items-center gap-6 lg:grid-cols-[420px_1fr]">
      <div className="z-10 rounded-[36px] border border-white/55 bg-white/35 p-6 shadow-[0_25px_80px_rgba(118,67,31,.18),inset_0_1px_0_rgba(255,255,255,.75)] backdrop-blur-xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fff7ea]/75 px-4 py-2 text-sm font-black text-[#b56a3b]">
          <Sparkles className="h-4 w-4" />
          治愈系韩语模拟经营
        </div>
        <h1 className="text-5xl font-black leading-tight text-[#96522f] sm:text-6xl">欧尼小厨房</h1>
        <p className="mt-5 text-xl font-bold leading-9 text-[#79513a]/85">
          一边学韩语，一边经营你的幸福小店。下课以后，来这里点亮一盏暖灯，慢慢把餐厅变漂亮。
        </p>
        <NameSettings compact={false} />
        <p className="mt-3 rounded-[22px] bg-white/45 px-4 py-3 text-sm font-black text-[#9a5a34]">
          当前老板：{playerName}
        </p>
        <Button
          onClick={onStart}
          size="lg"
          className="mt-8 text-xl"
        >
          <BookOpen className="h-7 w-7" />
          开始游戏
        </Button>
        <div className="mt-7 grid grid-cols-3 gap-3">
          <MiniBadge label="学习进度" value={`${done}/${questions.length}`} />
          <MiniBadge label="金币" value={coins.toLocaleString()} />
          <MiniBadge label="等级" value={`Lv.${level}`} />
        </div>
      </div>
      <GameScene showSidePanels={false} />
    </ScreenMotion>
  );
}

function RestaurantScreen({ onLearn }: { onLearn: () => void }) {
  return (
    <ScreenMotion>
      <GameScene showSidePanels onLearn={onLearn} />
    </ScreenMotion>
  );
}

function GameScene({ showSidePanels, onLearn }: { showSidePanels: boolean; onLearn?: () => void }) {
  const level = useGameStore((state) => state.level);
  const selected = useGameStore((state) => state.equippedItems);
  const recipes = useGameStore((state) => state.unlockedRecipes);
  const playerName = useGameStore((state) => state.playerName);
  const stageName = restaurantStages[level - 1] ?? restaurantStages[0];
  const selectedItems = furnitureItems.filter((item) => selected.includes(item.id)).slice(0, 8);

  return (
    <section className="scene-frame relative min-h-[610px] overflow-hidden rounded-[42px] border border-white/55 shadow-[0_35px_100px_rgba(105,58,27,.26)]">
        <EmptyKitchenRoom installedItems={selectedItems} />
        {showSidePanels && (
          <>
            <FloatingCard className="left-4 top-5 w-[280px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-[#b46a3d]">{playerName}</p>
                  <p className="mt-1 text-2xl font-black">{stageName}</p>
                </div>
                <NameSettings compact />
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#dfc8a9]">
                <motion.div className="h-full rounded-full bg-[#efae58]" animate={{ width: `${level * 20}%` }} />
              </div>
              <p className="mt-3 text-sm font-bold text-[#79513a]/75">学习越多，小店越温暖。</p>
            </FloatingCard>
            <TaskPopover onLearn={onLearn} />
          </>
        )}
        {recipes.length > 0 && (
        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-3">
          {recipes.map((recipe) => (
            <button key={recipe} className="rounded-full bg-[#c75e36]/92 px-5 py-4 font-black text-white shadow-[0_12px_28px_rgba(102,45,20,.28)]">
              {recipe}
            </button>
          ))}
        </div>
        )}
    </section>
  );
}

function EmptyKitchenRoom({ installedItems }: { installedItems: FurnitureItem[] }) {
  return <PhaserRestaurantCanvas installedItems={installedItems} />;
}

function TaskPopover({ onLearn }: { onLearn?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute left-4 top-56 z-20">
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 rounded-full border border-white/60 bg-[#fff8eb]/72 px-5 py-3 font-black text-[#8d5635] shadow-[0_18px_42px_rgba(91,50,24,.16),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-xl"
      >
        <Sparkles className="h-5 w-5 text-[#e8a047]" />
        今日任务
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 210, damping: 22 }}
            className="mt-3 w-[270px] rounded-[28px] border border-white/50 bg-[#fff8eb]/72 p-4 shadow-[0_18px_48px_rgba(91,50,24,.18),inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-xl"
          >
            <TaskLine text="听读 5 个韩语音" done />
            <TaskLine text="完成 2 道题目" />
            <TaskLine text="获得 100 金币" />
            <Button onClick={onLearn} className="mt-4 w-full">
              开始学习
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LearningScreen() {
  const [stage, setStage] = useState(1);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const completed = useGameStore((state) => state.completedQuestionIds);
  const answerQuestion = useGameStore((state) => state.answerQuestion);
  const stageQuestions = questions.filter((question) => question.stage === stage);
  const current = stageQuestions.find((question) => !completed.includes(question.id)) ?? stageQuestions[0];
  const lesson = lessonStages[stage - 1];

  const submit = (question: Question) => {
    if (question.kind === "choice" && (!question.answer || !selected)) return;
    const result = answerQuestion(
      question.id,
      question.kind === "match" ? true : selected === question.answer,
    );
    setFeedback(
      result.correct
        ? `答对啦，获得 ${result.earned} 金币。${result.stageCompleted ? "本阶段完成，新的菜谱正在厨房里发光。" : ""}`
        : `再听一遍也没关系：${question.explanation}`,
    );
    if (result.correct) setSelected("");
  };

  return (
    <ScreenMotion className="grid gap-5 xl:grid-cols-[330px_1fr]">
      <GamePanel title="学习路线">
        <div className="space-y-2">
          {lessonStages.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setStage(item.id);
                setSelected("");
                setFeedback("");
                setShowQuiz(item.id !== 1);
              }}
              className={`w-full rounded-[22px] px-4 py-4 text-left font-black transition ${
                stage === item.id
                  ? "bg-[#eba452] text-white shadow-[0_14px_30px_rgba(202,103,38,.25)]"
                  : "bg-white/48 hover:bg-white/70"
              }`}
            >
              Lv.{item.id} {item.title.replace(/^第.阶段：/, "")}
            </button>
          ))}
        </div>
      </GamePanel>
      <GamePanel title={showQuiz ? lesson.title : "四十音木牌"}>
        {!showQuiz && (
          <>
            <p className="mb-4 rounded-[22px] bg-[#fff8eb]/65 p-4 font-bold leading-7 text-[#76513a]/80">
              先把韩语字母听熟，再开始答题。点击每张木牌上的喇叭会立刻播放韩语读音；括号里是接近中文拼音的记忆法。
            </p>
            <HangulBoard title="元音 21 个" sounds={vowels} />
            <HangulBoard title="辅音 19 个" sounds={consonants} />
            <button
              onClick={() => setShowQuiz(true)}
              className="mt-5 rounded-[24px] bg-[#ed9e48] px-7 py-4 text-lg font-black text-white shadow-[0_16px_36px_rgba(204,103,39,.28)]"
            >
              我听过了，开始做题
            </button>
          </>
        )}
        {showQuiz && (
          <>
            <p className="font-bold leading-7 text-[#76513a]/80">{lesson.subtitle}</p>
            {lesson.grammar && (
              <div className="mt-4 rounded-[24px] border border-white/45 bg-[#e1f1df]/50 p-4 font-bold leading-7">
                {lesson.grammar}
              </div>
            )}
            <QuestionCard question={current} selected={selected} setSelected={setSelected} onSubmit={() => submit(current)} />
            {feedback && (
              <motion.div
                className="mt-4 rounded-[24px] bg-[#ffe0a7]/55 p-4 font-black leading-7 text-[#a05d34]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {feedback}
              </motion.div>
            )}
          </>
        )}
      </GamePanel>
    </ScreenMotion>
  );
}

function HangulBoard({ title, sounds }: { title: string; sounds: HangulSound[] }) {
  const warmed = useRef(false);
  return (
    <WoodenSignFrame title={title}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7">
        {sounds.map((sound) => (
          <WoodenSoundTile key={sound.symbol}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-4xl font-black text-[#6f3f26]">{sound.symbol}</p>
                <p className="mt-1 text-sm font-black text-[#b16b3c]">{sound.roman}</p>
              </div>
              <button
                onPointerDown={() => {
                  if (!warmed.current) {
                    prepareKoreanVoice();
                    warmed.current = true;
                  }
                  speakKorean(sound.example);
                }}
                className="rounded-2xl bg-[#f0a351] p-2 text-white shadow-[0_8px_18px_rgba(175,82,31,.24)]"
                aria-label={`播放 ${sound.symbol} 的读音`}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs font-bold text-[#76513a]/75">{sound.hint}</p>
            <p className="mt-1 text-xs font-black text-[#8e5632]">例：{sound.example}</p>
          </WoodenSoundTile>
        ))}
      </div>
    </WoodenSignFrame>
  );
}

function QuestionCard({
  question,
  selected,
  setSelected,
  onSubmit,
}: {
  question: Question;
  selected: string;
  setSelected: (value: string) => void;
  onSubmit: () => void;
}) {
  const [selectedLeft, setSelectedLeft] = useState("");
  const [matched, setMatched] = useState<string[]>([]);
  const [matchTip, setMatchTip] = useState("");

  useEffect(() => {
    setSelectedLeft("");
    setMatched([]);
    setMatchTip("");
  }, [question.id]);

  const chooseRight = (right: string) => {
    if (!selectedLeft) {
      setMatchTip("先点左边的韩语，再点右边的中文或读音。");
      return;
    }
    const correctPair = question.pairs?.find((pair) => pair.left === selectedLeft);
    if (correctPair?.right === right) {
      const nextMatched = [...matched, selectedLeft];
      setMatched(nextMatched);
      setSelectedLeft("");
      setMatchTip("配对正确。");
      if (question.pairs && nextMatched.length === question.pairs.length) {
        setMatchTip("全部配对完成。");
        onSubmit();
      }
    } else {
      setMatchTip("这个还没配上，听一遍再试试。");
    }
  };

  return (
    <div className="mt-5 rounded-[32px] border border-white/45 bg-white/45 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.75),0_18px_45px_rgba(118,67,31,.14)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-black">{question.prompt}</p>
          {question.korean && <p className="mt-4 text-5xl font-black text-[#97562f]">{question.korean}</p>}
          {question.pronunciation && <p className="mt-2 font-bold text-[#76513a]/70">{question.pronunciation}</p>}
        </div>
        {question.korean && (
          <button
            onPointerDown={() => speakKorean(question.korean)}
            className="rounded-[20px] bg-[#eea04d] p-3 text-white shadow-[0_10px_22px_rgba(185,88,31,.28)]"
          >
            <Volume2 className="h-6 w-6" />
          </button>
        )}
      </div>
      {question.kind === "choice" && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.options?.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={`rounded-[24px] border px-4 py-4 text-left font-black transition ${
                selected === option
                  ? "border-[#ec9e49] bg-[#ffe0a7]/70 text-[#9c5a33]"
                  : "border-white/55 bg-[#fff9ef]/65 hover:bg-white/85"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {question.kind === "match" && (
        <div className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-black text-[#9a5a34]">韩语木牌</p>
              {question.pairs?.map((pair) => {
                const done = matched.includes(pair.left);
                return (
                  <button
                    key={pair.left}
                    disabled={done}
                    onClick={() => {
                      setSelectedLeft(pair.left);
                      speakKorean(
                        hangulSounds.find((sound) => sound.symbol === pair.left)?.example ?? pair.left,
                      );
                    }}
                    className={`flex w-full items-center justify-between rounded-[24px] px-4 py-4 font-black shadow-[0_10px_22px_rgba(105,58,27,.12)] transition ${
                      done
                        ? "bg-[#dcefdc] text-[#5f9268]"
                        : selectedLeft === pair.left
                          ? "bg-[#ffe0a7] text-[#9a5a34]"
                          : "bg-[#fff9ef]/75 hover:bg-white"
                    }`}
                  >
                    <span className="text-3xl">{pair.left}</span>
                    <Volume2 className="h-5 w-5" />
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <p className="font-black text-[#9a5a34]">中文 / 拼音</p>
              {question.pairs?.map((pair) => (
                <button
                  key={pair.right}
                  onClick={() => chooseRight(pair.right)}
                  className="w-full rounded-[24px] bg-[#fff4dc]/80 px-4 py-4 text-left font-black shadow-[0_10px_22px_rgba(105,58,27,.12)] transition hover:bg-white"
                >
                  {pair.right}
                </button>
              ))}
            </div>
          </div>
          {matchTip && (
            <p className="mt-4 rounded-[20px] bg-[#fff4dc]/72 px-4 py-3 font-black text-[#9a5a34]">
              {matchTip}
            </p>
          )}
        </div>
      )}
      <p className="mt-5 font-bold leading-7 text-[#76513a]/72">{question.explanation}</p>
      {question.kind === "choice" && (
        <button
          onClick={onSubmit}
          disabled={!selected}
          className="mt-5 rounded-[24px] bg-[#cf6840] px-6 py-3 font-black text-white shadow-[0_14px_30px_rgba(174,70,36,.24)] disabled:opacity-45"
        >
          提交答案
        </button>
      )}
    </div>
  );
}

function ShopScreen() {
  const [category, setCategory] = useState<FurnitureCategory>("all");
  const [selectedId, setSelectedId] = useState(furnitureItems[0].id);
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipeItems[0].id);
  const [message, setMessage] = useState("");
  const coins = useGameStore((state) => state.coins);
  const level = useGameStore((state) => state.level);
  const unlocked = useGameStore((state) => state.ownedItems);
  const installed = useGameStore((state) => state.equippedItems);
  const completedQuestionIds = useGameStore((state) => state.completedQuestionIds);
  const purchasedRecipeIds = useGameStore((state) => state.purchasedRecipeIds);
  const buyFurniture = useGameStore((state) => state.buyFurniture);
  const buyRecipe = useGameStore((state) => state.buyRecipe);
  const selectFurniture = useGameStore((state) => state.selectFurniture);
  const visibleItems = category === "all" ? furnitureItems : furnitureItems.filter((item) => item.category === category);
  const selectedItem = furnitureItems.find((item) => item.id === selectedId) ?? furnitureItems[0];
  const selectedRecipe = recipeItems.find((item) => item.id === selectedRecipeId) ?? recipeItems[0];
  const owned = unlocked.includes(selectedItem.id);
  const isInstalled = installed.includes(selectedItem.id);
  const recipeMode = category === "recipes";
  const recipeOwned = purchasedRecipeIds.includes(selectedRecipe.id);
  const recipeUnlocked = isRecipeStageCompleted(selectedRecipe.stageRequired, completedQuestionIds);

  return (
    <ScreenMotion className="relative">
      <div className="pointer-events-none absolute inset-x-4 -top-10 h-60 rounded-full bg-[#ffd978]/30 blur-3xl" />
      <Card className="relative overflow-hidden rounded-[44px] bg-[linear-gradient(145deg,rgba(255,250,238,.62),rgba(255,222,166,.36))] p-3">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.72),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(255,196,92,.24),transparent_24%)]" />
        <CardHeader className="relative items-center pb-3 text-center">
          <div className="rounded-[26px] border-[5px] border-[#bd7a42] bg-[#ffe2ae] px-10 py-4 shadow-[inset_0_2px_0_rgba(255,255,255,.55),0_14px_28px_rgba(125,69,32,.18)]">
            <CardTitle className="text-4xl">{recipeMode ? "经典韩式料理" : "欧尼装修商店"}</CardTitle>
          </div>
          <p className="mt-3 text-lg font-black text-[#a7673d]">
            {recipeMode ? "学习韩语 · 解锁食谱 · 经营小店" : "挑选家具 · 点亮灯光 · 布置幸福小厨房"}
          </p>
        </CardHeader>
        <CardContent className="relative grid gap-5 xl:grid-cols-[190px_1fr_360px]">
          <div className="rounded-[32px] border border-white/55 bg-white/34 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_16px_36px_rgba(117,66,32,.13)] backdrop-blur-xl">
            <ScrollArea className="h-[520px] pr-2">
            <div className="space-y-2">
              {categories.map((item) => (
                <Button
                  key={item.id}
                  variant={category === item.id ? "default" : "glass"}
                  onClick={() => {
                    setCategory(item.id);
                    setMessage("");
                  }}
                  className="h-13 w-full justify-start rounded-[20px]"
                >
                  {item.label}
                </Button>
              ))}
            </div>
            </ScrollArea>
          </div>

          <motion.div
            key={recipeMode ? "recipes" : category}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="min-h-[620px] rounded-[36px] border border-white/50 bg-white/28 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_20px_55px_rgba(105,58,27,.15)] backdrop-blur-xl"
          >
            <ScrollArea className="h-[620px] pr-3">
            {recipeMode ? (
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {recipeItems.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    active={recipe.id === selectedRecipeId}
                    owned={purchasedRecipeIds.includes(recipe.id)}
                    unlocked={isRecipeStageCompleted(recipe.stageRequired, completedQuestionIds)}
                    delay={index * 0.035}
                    onClick={() => {
                      setSelectedRecipeId(recipe.id);
                      setMessage("");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {visibleItems.map((item, index) => (
                  <FurnitureShopCard
                    key={item.id}
                    item={item}
                    active={item.id === selectedId}
                    owned={unlocked.includes(item.id)}
                    delay={index * 0.035}
                    onClick={() => {
                      setSelectedId(item.id);
                      setMessage("");
                    }}
                  />
                ))}
              </div>
            )}
            </ScrollArea>
          </motion.div>

          <Card className="sticky top-24 h-fit rounded-[36px] bg-[linear-gradient(145deg,rgba(255,250,238,.72),rgba(255,221,164,.42))] p-4">
            {recipeMode ? (
              <ShopRecipeDetail
                recipe={selectedRecipe}
                owned={recipeOwned}
                unlocked={recipeUnlocked}
                coins={coins}
                onBuy={() => setMessage(buyRecipe(selectedRecipe.id).message)}
              />
            ) : (
              <ShopFurnitureDetail
                item={selectedItem}
                installedItems={furnitureItems.filter((item) => installed.includes(item.id))}
                owned={owned}
                installed={isInstalled}
                coins={coins}
                level={level}
                onAction={() => {
                  const result = owned ? selectFurniture(selectedItem.id) : buyFurniture(selectedItem.id);
                  setMessage(result.message);
                }}
              />
            )}
            {message && <p className="mt-3 rounded-[22px] bg-[#ffe0a7]/65 p-3 font-black text-[#9c5a33]">{message}</p>}
          </Card>
        </CardContent>
      </Card>
    </ScreenMotion>
  );
}

function isRecipeStageCompleted(stage: number, completedQuestionIds: string[]) {
  const stageQuestions = questions.filter((question) => question.stage === stage);
  return stageQuestions.length > 0 && stageQuestions.every((question) => completedQuestionIds.includes(question.id));
}

function FurnitureShopCard({
  item,
  active,
  owned,
  delay,
  onClick,
}: {
  item: FurnitureItem;
  active: boolean;
  owned: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -7 }}
        transition={{ type: "spring", stiffness: 190, damping: 20, delay }}
        onClick={onClick}
        className={`relative min-h-[300px] w-full overflow-hidden rounded-[32px] border p-4 text-center shadow-[0_20px_46px_rgba(118,67,31,.16)] ${
          active ? "border-[#eda24d] bg-[#ffe3b4]/72" : "border-white/55 bg-[#fff8ec]/58"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(255,255,255,.85),transparent_28%),linear-gradient(145deg,rgba(255,255,255,.35),rgba(255,200,119,.16))]" />
        <span className="absolute right-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[#9c5a33]">
          {owned ? "已拥有" : `Lv.${item.levelRequired}`}
        </span>
        <div className="relative pt-6">
          <FurnitureIllustration item={item} />
          <p className="mt-3 text-xl font-black text-[#5f3727]">{item.name}</p>
          <p className="mx-auto mt-2 line-clamp-2 max-w-[220px] text-sm font-bold leading-6 text-[#76513a]">
            {item.description}
          </p>
          <div className="mx-auto mt-4 flex w-36 items-center justify-center gap-2 rounded-2xl bg-white/72 py-2 text-xl font-black text-[#9e5c33]">
            <Coins className="h-5 w-5 text-[#e6a23f]" />
            {item.price}
          </div>
        </div>
      </motion.button>
  );
}

function RecipeCard({
  recipe,
  active,
  owned,
  unlocked,
  delay,
  onClick,
}: {
  recipe: RecipeItem;
  active: boolean;
  owned: boolean;
  unlocked: boolean;
  delay: number;
  onClick: () => void;
}) {
  return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 190, damping: 20, delay }}
        onClick={onClick}
        className={`relative min-h-[330px] w-full rounded-[30px] border bg-[linear-gradient(145deg,rgba(255,250,238,.82),rgba(255,226,178,.48))] p-4 text-center shadow-[0_18px_45px_rgba(118,67,31,.13)] transition hover:bg-[#fff3df]/80 ${
          active ? "border-[#eda24d] bg-[#ffe3b4]/60" : "border-white/50"
        }`}
      >
        <span className="absolute left-4 top-4 text-2xl">{owned ? "✓" : unlocked ? "✨" : "🔒"}</span>
        <p className="text-2xl font-black text-[#5f3727]">{recipe.name}</p>
        <p className="mt-1 font-black text-[#7d4b33]">{recipe.korean}</p>
        <FoodIllustration recipe={recipe} />
        <p className="mx-auto mt-3 max-w-[210px] text-sm font-bold leading-6 text-[#76513a]">{recipe.description}</p>
        <div className="mx-auto mt-3 flex w-36 items-center justify-center gap-2 rounded-2xl bg-white/70 py-2 text-xl font-black text-[#9e5c33]">
          <Coins className="h-5 w-5 text-[#e6a23f]" />
          {recipe.price}
        </div>
        {!unlocked && (
          <p className="mt-2 text-xs font-black text-[#b66b3d]">完成第 {recipe.stageRequired} 阶段后解锁</p>
        )}
      </motion.button>
  );
}

function ShopRecipeDetail({
  recipe,
  owned,
  unlocked,
  coins,
  onBuy,
}: {
  recipe: RecipeItem;
  owned: boolean;
  unlocked: boolean;
  coins: number;
  onBuy: () => void;
}) {
  return (
    <div>
      <div className="rounded-[30px] border border-white/55 bg-[#fff7e8]/70 p-5 text-center shadow-[0_18px_42px_rgba(111,61,29,.18)]">
        <FoodIllustration recipe={recipe} large />
        <p className="mt-3 text-3xl font-black text-[#5f3727]">{recipe.name}</p>
        <p className="font-black text-[#9c5a33]">{recipe.korean}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-black text-[#7a432b]">食谱书页</p>
        <span className="rounded-full bg-[#ffe0a7] px-3 py-1 text-sm font-black text-[#9c5a33]">
          {owned ? "已购买" : unlocked ? "可购买" : "未解锁"}
        </span>
      </div>
      <div className="mt-4 rounded-[24px] border border-white/45 bg-white/45 p-4 font-bold leading-8">
        <p>购买条件：完成第 {recipe.stageRequired} 阶段全部题目</p>
        <p>菜单丰富度 +1</p>
        <p>顾客期待值 +5%</p>
      </div>
      <p className="mt-4 font-bold leading-7 text-[#76513a]/80">{recipe.description}</p>
      <div className="mt-5 flex items-center justify-between rounded-[24px] bg-[#fff5e5]/70 p-4">
        <span className="font-black">总价格</span>
        <span className="flex items-center gap-2 text-2xl font-black text-[#9e5c33]">
          <Coins className="h-6 w-6 text-[#e6a23f]" />
          {owned ? 0 : recipe.price}
        </span>
      </div>
      <Button
        disabled={owned || !unlocked || coins < recipe.price}
        onClick={onBuy}
        size="lg"
        className="mt-4 w-full"
      >
        {owned ? "已加入菜单" : unlocked ? "购买菜谱" : `完成第 ${recipe.stageRequired} 阶段后解锁`}
      </Button>
    </div>
  );
}

function ShopFurnitureDetail({
  item,
  installedItems,
  owned,
  installed,
  coins,
  level,
  onAction,
}: {
  item: FurnitureItem;
  installedItems: FurnitureItem[];
  owned: boolean;
  installed: boolean;
  coins: number;
  level: number;
  onAction: () => void;
}) {
  return (
    <div>
      <div className="relative h-56 overflow-hidden rounded-[30px] border border-white/55 shadow-[0_18px_42px_rgba(111,61,29,.18)]">
        <EmptyKitchenRoom installedItems={installedItems} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xl font-black text-[#7a432b]">{item.name}</p>
        <span className="rounded-full bg-[#ffe0a7] px-3 py-1 text-sm font-black text-[#9c5a33]">
          {installed ? "已安装" : owned ? "已拥有" : "待购买"}
        </span>
      </div>
      <div className="mt-4 rounded-[24px] border border-white/45 bg-white/45 p-4 font-bold leading-8">
        <p>当前风格：温馨木质风</p>
        <p>顾客满意度 +10%</p>
        <p>金币收益 +5%</p>
      </div>
      <p className="mt-4 font-bold leading-7 text-[#76513a]/80">{item.description}</p>
      <div className="mt-5 flex items-center justify-between rounded-[24px] bg-[#fff5e5]/70 p-4">
        <span className="font-black">总价格</span>
        <span className="flex items-center gap-2 text-2xl font-black text-[#9e5c33]">
          <Coins className="h-6 w-6 text-[#e6a23f]" />
          {owned ? 0 : item.price}
        </span>
      </div>
      <Button
        disabled={installed || (!owned && (coins < item.price || level < item.levelRequired))}
        onClick={onAction}
        size="lg"
        className="mt-4 w-full"
      >
        {installed ? "已安装" : owned ? "安装到餐厅" : "购买家具"}
      </Button>
    </div>
  );
}

function ProfileScreen() {
  const resetProgress = useGameStore((state) => state.resetProgress);
  const level = useGameStore((state) => state.level);
  const coins = useGameStore((state) => state.coins);
  const furniture = useGameStore((state) => state.ownedItems.length);
  const recipes = useGameStore((state) => state.unlockedRecipes.length);

  return (
    <ScreenMotion className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <GameScene showSidePanels={false} />
      <GamePanel title="我的餐厅">
        <div className="grid grid-cols-2 gap-3">
          <MiniBadge label="等级" value={`Lv.${level}`} />
          <MiniBadge label="金币" value={coins.toLocaleString()} />
          <MiniBadge label="家具" value={`${furniture} 件`} />
          <MiniBadge label="菜谱" value={`${recipes} 道`} />
        </div>
        <p className="mt-5 rounded-[24px] bg-white/45 p-4 font-bold leading-7 text-[#76513a]/78">
          进度会自动保存在浏览器 localStorage。换浏览器或清理缓存会重置本地存档。
        </p>
        <button
          onClick={resetProgress}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[24px] bg-white/55 px-5 py-4 font-black text-[#a25e36] shadow-[inset_0_1px_0_rgba(255,255,255,.85)]"
        >
          <RotateCcw className="h-5 w-5" />
          重置本地存档
        </button>
      </GamePanel>
    </ScreenMotion>
  );
}

function FloatingCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`absolute rounded-[28px] border border-white/50 bg-[#fff8eb]/55 p-4 shadow-[0_18px_48px_rgba(91,50,24,.18),inset_0_1px_0_rgba(255,255,255,.8)] backdrop-blur-xl ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function GamePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[36px] border border-white/55 bg-white/32 p-4 shadow-[0_24px_70px_rgba(108,61,31,.18),inset_0_1px_0_rgba(255,255,255,.72)] backdrop-blur-xl sm:p-5">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-[#96522f]">
        <Sparkles className="h-6 w-6 text-[#e8a047]" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function MiniBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/55 bg-white/48 p-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_12px_25px_rgba(112,64,32,.11)]">
      <p className="text-xs font-black text-[#ad6b3d]">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}

function TaskLine({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between rounded-[18px] bg-white/45 px-3 py-2 font-bold">
      <span>{text}</span>
      <span className={done ? "text-[#62a874]" : "text-[#c49a75]"}>{done ? "完成" : "进行中"}</span>
    </div>
  );
}

function ScreenMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      {children}
    </motion.section>
  );
}

function GameDock({ active, level, onNavigate }: { active: View; level: number; onNavigate: (view: View) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/55 bg-[#fff1dc]/78 px-3 py-3 shadow-[0_-18px_55px_rgba(114,62,28,.16)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-4 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`relative flex min-h-16 items-center justify-center gap-2 rounded-[24px] px-2 text-sm font-black transition sm:text-xl ${
                active === item.view
                  ? "bg-[#eea04d] text-white shadow-[0_14px_35px_rgba(194,95,35,.28),inset_0_2px_0_rgba(255,255,255,.3)]"
                  : "bg-white/50 text-[#9a5a34] shadow-[inset_0_1px_0_rgba(255,255,255,.75)]"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="hidden sm:inline">{item.label}</span>
              {item.badge && level < 5 && (
                <span className="absolute -right-1 -top-2 rounded-full bg-[#d86548] px-2 py-0.5 text-xs text-white">
                  新
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

