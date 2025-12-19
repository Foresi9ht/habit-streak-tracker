import { mount } from "@vue/test-utils";
import Achievements from "../src/components/Achievements.vue";

test("renders achievements", () => {
  const wrapper = mount(Achievements, {
    props: {
      achievements: [
        {
          code: "a1",
          title: "Test",
          desc: "Desc",
          emoji: "🔥",
          unlocked: true,
        },
      ],
    },
  });
  expect(wrapper.text()).toContain("Test");
});
