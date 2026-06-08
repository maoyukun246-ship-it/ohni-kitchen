export type HangulSound = {
  symbol: string;
  name: string;
  roman: string;
  hint: string;
  example: string;
};

export const vowels: HangulSound[] = [
  { symbol: "ㅏ", name: "元音", roman: "a", hint: "像中文拼音 a", example: "아" },
  { symbol: "ㅑ", name: "元音", roman: "ya", hint: "像“呀”", example: "야" },
  { symbol: "ㅓ", name: "元音", roman: "eo", hint: "像“哦”，嘴更放松", example: "어" },
  { symbol: "ㅕ", name: "元音", roman: "yeo", hint: "像“呀哦”的连读", example: "여" },
  { symbol: "ㅗ", name: "元音", roman: "o", hint: "嘴唇圆一点的 o", example: "오" },
  { symbol: "ㅛ", name: "元音", roman: "yo", hint: "像“哟”", example: "요" },
  { symbol: "ㅜ", name: "元音", roman: "u", hint: "像“乌”", example: "우" },
  { symbol: "ㅠ", name: "元音", roman: "yu", hint: "像“于”", example: "유" },
  { symbol: "ㅡ", name: "元音", roman: "eu", hint: "轻轻的“呃”，嘴巴横向", example: "으" },
  { symbol: "ㅣ", name: "元音", roman: "i", hint: "像“一”", example: "이" },
  { symbol: "ㅐ", name: "复合元音", roman: "ae", hint: "接近“诶”", example: "애" },
  { symbol: "ㅔ", name: "复合元音", roman: "e", hint: "接近“诶”", example: "에" },
  { symbol: "ㅚ", name: "复合元音", roman: "oe", hint: "接近“外/维”之间", example: "외" },
  { symbol: "ㅟ", name: "复合元音", roman: "wi", hint: "像 wi", example: "위" },
  { symbol: "ㅢ", name: "复合元音", roman: "ui", hint: "ㅡ 和 ㅣ 连读", example: "의" },
  { symbol: "ㅘ", name: "复合元音", roman: "wa", hint: "像“哇”", example: "와" },
  { symbol: "ㅝ", name: "复合元音", roman: "wo", hint: "像“我”偏圆", example: "워" },
  { symbol: "ㅙ", name: "复合元音", roman: "wae", hint: "像“外”", example: "왜" },
  { symbol: "ㅞ", name: "复合元音", roman: "we", hint: "像 we", example: "웨" },
  { symbol: "ㅒ", name: "复合元音", roman: "yae", hint: "像 yae", example: "얘" },
  { symbol: "ㅖ", name: "复合元音", roman: "ye", hint: "像 ye", example: "예" },
];

export const consonants: HangulSound[] = [
  { symbol: "ㄱ", name: "辅音", roman: "g/k", hint: "词首像 k，词中像 g", example: "가" },
  { symbol: "ㄴ", name: "辅音", roman: "n", hint: "像 n", example: "나" },
  { symbol: "ㄷ", name: "辅音", roman: "d/t", hint: "像 d 或 t", example: "다" },
  { symbol: "ㄹ", name: "辅音", roman: "r/l", hint: "介于 r 和 l 之间", example: "라" },
  { symbol: "ㅁ", name: "辅音", roman: "m", hint: "像 m", example: "마" },
  { symbol: "ㅂ", name: "辅音", roman: "b/p", hint: "像 b 或 p", example: "바" },
  { symbol: "ㅅ", name: "辅音", roman: "s", hint: "像 s", example: "사" },
  { symbol: "ㅇ", name: "辅音", roman: "ng / 不发音", hint: "开头不发音，收尾像 ng", example: "아" },
  { symbol: "ㅈ", name: "辅音", roman: "j", hint: "像 j", example: "자" },
  { symbol: "ㅊ", name: "辅音", roman: "ch", hint: "像 ch", example: "차" },
  { symbol: "ㅋ", name: "辅音", roman: "k", hint: "送气 k", example: "카" },
  { symbol: "ㅌ", name: "辅音", roman: "t", hint: "送气 t", example: "타" },
  { symbol: "ㅍ", name: "辅音", roman: "p", hint: "送气 p", example: "파" },
  { symbol: "ㅎ", name: "辅音", roman: "h", hint: "像 h", example: "하" },
  { symbol: "ㄲ", name: "紧音", roman: "kk", hint: "更紧的 k", example: "까" },
  { symbol: "ㄸ", name: "紧音", roman: "tt", hint: "更紧的 t", example: "따" },
  { symbol: "ㅃ", name: "紧音", roman: "pp", hint: "更紧的 p", example: "빠" },
  { symbol: "ㅆ", name: "紧音", roman: "ss", hint: "更紧的 s", example: "싸" },
  { symbol: "ㅉ", name: "紧音", roman: "jj", hint: "更紧的 j", example: "짜" },
];

export const hangulSounds = [...vowels, ...consonants];
