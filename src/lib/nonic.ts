// The entire intelligence of stepesAI lives here.
// No matter what you ask, the answer is some flavor of "no nic".

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T>(arr: T[]): T => arr[rand(arr.length)];
const chance = (p: number) => Math.random() < p;
const repeat = (ch: string, min: number, max: number) =>
  ch.repeat(min + rand(max - min + 1));

// Hand-picked classics that should show up now and then.
const CLASSICS = [
  "no nic",
  "no nicccc",
  "no n i i i i i c",
  "NOOO niiiiccc",
  "no nNnnNNic",
  "nnoooooo nic",
  "n o   n i c",
  "nonononic",
  
];

function buildNo(): string {
  return pick([
    "no",
    "n" + repeat("o", 2, 100),
    "no no",
    "nono",
    "ňoooo",
    "n" + repeat("o", 1, 3) + "pe",
  ]);
}

function buildNic(): string {
  // spaced-out variant: n i i i c
  if (chance(0.3)) {
    return ["n", repeat("i", 1, 5), "c"].join("").split("").join(" ").trim();
  }
  return "n" + repeat("i", 1, 6) + "c" + (chance(0.5) ? repeat("c", 0, 4) : "");
}

const SUFFIXES = [""];

// Occasionally stepesAI is genuinely impressed.
function buildGenialni(): string {
  // spaced-out variant: g e n i a l n i
  if (chance(0.4)) return "genialni".split("").join(" ");
  let out =
    "geni" + repeat("a", 1, 4) + "lni" + (chance(0.5) ? repeat("i", 0, 4) : "");
  if (chance(0.3)) out = out.toUpperCase();
  return out;
}

/** Produce one fresh stepesAI utterance. */
export function generateNoNic(): string {
  // sometimes it just thinks you're a genius
  if (chance(0.15)) return buildGenialni();
  if (chance(0.18)) return pick(CLASSICS);

  let out = `${buildNo()} ${buildNic()}`;
  if (chance(0.18)) out = out.toUpperCase();
  if (chance(0.35)) out += pick(SUFFIXES);
  return out;
}

/** Reaction bundles the "AI" might slap on your message. */
const AI_REACTION_SETS: string[][] = [
  ["💀"],
  ["😭", "🙏"], // sob + pray always together
  ["🥀"],
];

/** Returns a set of emojis to react with, or null if the AI feels nothing. */
export function maybeAiReaction(): string[] | null {
  if (!chance(0.45)) return null;
  return pick(AI_REACTION_SETS);
}
