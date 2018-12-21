const STORAGE_LUCKY_KEY = "STORAGE_LUCKY_KEY";

export const setStoredLuckySheep = (sheep: string[]) => {
  localStorage.setItem(STORAGE_LUCKY_KEY, sheep.join(","));
}

export const getStoredLuckySheep = () => {
  const storedLuckyString = localStorage.getItem(STORAGE_LUCKY_KEY) || "";
  const luckySheep = storedLuckyString.split(",");
  return Array.isArray(luckySheep) ? luckySheep : [];
}