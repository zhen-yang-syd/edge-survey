import { create } from "zustand";
import { persist } from "zustand/middleware";
const surveyStore = (set: any) => ({
    survey: [],
    updateSurvey: (survey: any) => {
        set({ survey: survey });
    },
});

const useSurveyStore = create(persist(surveyStore, { name: "survey" }));

export default useSurveyStore;
