import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moodToEmoji(mood: string) {
  switch (mood) {
    case "Calm":
      return "😌";
    case "Stressed":
      return "😵‍💫";
    case "Hopeful":
      return "🌤️";
    case "Positive":
      return "🙂";
    case "Negative":
      return "☁️";
    default:
      return "😐";
  }
}

export function moodToColor(mood: string) {
  switch (mood) {
    case "Calm":
      return "from-green-500/20 to-emerald-500/20";
    case "Stressed":
      return "from-red-500/20 to-rose-500/20";
    case "Hopeful":
      return "from-blue-500/20 to-cyan-500/20";
    case "Positive":
      return "from-lime-500/20 to-green-500/20";
    case "Negative":
      return "from-stone-400/20 to-gray-400/20";
    default:
      return "from-slate-400/20 to-slate-500/20";
  }
}


