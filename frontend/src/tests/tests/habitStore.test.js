import { setActivePinia, createPinia } from "pinia";
import { useHabitStore } from "../src/stores/habitStore";

test("adds habit", () => {
  setActivePinia(createPinia());
  const store = useHabitStore();
  store.addHabit({ id: 1 });
  expect(store.habits.length).toBe(1);
});
