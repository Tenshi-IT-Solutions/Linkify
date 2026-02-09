import { create } from "zustand";

export const useLanguageStore = create((set) => ({
    selected: "en",
    translations: {},
    setLanguage: (lang) => set({ selected: lang }),
    setTranslation: (messageId, translation) => set((state) => ({
        translations: { ...state.translations, [messageId]: translation }
    })),
}));
