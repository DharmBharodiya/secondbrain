import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Reddit-style adjectives and nouns for random usernames
const ADJECTIVES = [
  "Happy",
  "Lazy",
  "Clever",
  "Brave",
  "Witty",
  "Proud",
  "Calm",
  "Quick",
  "Bright",
  "Swift",
  "Eager",
  "Fancy",
  "Gentle",
  "Graceful",
  "Honest",
  "Jolly",
  "Kind",
  "Loyal",
  "Mighty",
  "Noble",
  "Quiet",
  "Radiant",
  "Smart",
  "Tender",
  "Vivid",
  "Wise",
  "Young",
  "Zesty",
];

const NOUNS = [
  "Panda",
  "Tiger",
  "Eagle",
  "Dolphin",
  "Phoenix",
  "Dragon",
  "Wolf",
  "Hawk",
  "Lion",
  "Bear",
  "Fox",
  "Raven",
  "Salmon",
  "Otter",
  "Penguin",
  "Whale",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Flamingo",
  "Peacock",
  "Butterfly",
  "Beetle",
  "Spider",
  "Shark",
  "Owl",
  "Lynx",
  "Badger",
];

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
  "#F8B88B",
  "#82E0AA",
  "#FAD7A0",
  "#AED6F1",
  "#F5B7B1",
  "#D7BDE2",
  "#A9DFBF",
  "#F9E79F",
  "#82E0AA",
  "#F1948A",
  "#D5A6BD",
  "#A3E4D7",
];

// Generate a deterministic random username based on userId
export function getRandomUsername(userId: string): string {
  const hash = userId.split("").reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  const adjIndex = Math.abs(hash) % ADJECTIVES.length;
  const nounIndex =
    Math.abs(Math.floor(hash / ADJECTIVES.length)) % NOUNS.length;

  return `${ADJECTIVES[adjIndex]}${NOUNS[nounIndex]}`;
}

// Generate a deterministic random color based on userId
export function getRandomColor(userId: string): string {
  const hash = userId.split("").reduce((acc, char) => {
    return (acc << 5) - acc + char.charCodeAt(0);
  }, 0);

  const colorIndex = Math.abs(hash) % COLORS.length;
  return COLORS[colorIndex];
}
