import { mount } from "@vue/test-utils";
import HabitQuest from "../src/components/HabitQuest.vue";

test("renders points", () => {
  const wrapper = mount(HabitQuest, {
    props: {
      points: 10,
      level: 1,
      progress: 10,
      nextLevelAt: 100,
      unlockedCount: 1,
      totalAchievements: 3,
    },
  });
  expect(wrapper.text()).toContain("10");
});
