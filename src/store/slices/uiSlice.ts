import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  darkMode: boolean;
  language: "en" | "ar" | "fr";
  mobileMenuOpen: boolean;
}

const loadThemeFromStorage = (): boolean => {
  try {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
};

const loadLanguageFromStorage = (): "en" | "ar" | "fr" => {
  try {
    const saved = localStorage.getItem("language") as "en" | "ar" | "fr";
    if (saved) {
      return saved;
    } else return "en";
  } catch (error) {
    console.error();
  }
};

const initialState: UIState = {
  darkMode: loadThemeFromStorage(),
  language: loadLanguageFromStorage(),
  mobileMenuOpen: false,
};

// Apply theme on load
if (initialState.darkMode) {
  document.documentElement.classList.add("dark");
}
document.documentElement.dir = initialState.language === "ar" ? "rtl" : "ltr";

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode));
      if (state.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setLanguage: (state, action: PayloadAction<"en" | "ar" | "fr">) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
      document.documentElement.dir = action.payload === "ar" ? "rtl" : "ltr";
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setLanguage,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export const selectDarkMode = (state: { ui: UIState }) => state.ui.darkMode;
export const selectLanguage = (state: { ui: UIState }) => state.ui.language;
export const selectMobileMenuOpen = (state: { ui: UIState }) =>
  state.ui.mobileMenuOpen;

export default uiSlice.reducer;
