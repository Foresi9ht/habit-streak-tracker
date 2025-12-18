import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isLoggedIn = ref(false);

  function login() {
    isLoggedIn.value = true;
    localStorage.setItem("userToken", "token");
  }

  function logout() {
    isLoggedIn.value = false;
    localStorage.removeItem("userToken");
  }

  return { isLoggedIn, login, logout };
});
