import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (newtheme) => {
    localStorage.setItem("chat-theme", newtheme);
    set({ theme: newtheme });
  },
}));
