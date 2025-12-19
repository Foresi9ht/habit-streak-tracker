<template>
  <section class="login">
    <div class="form-container">
      <p>Register</p>
      <form action="#">
        <label for="email">Email</label>
        <input type="email" v-model="form.email" required />
        <label for="password">Password</label>
        <input type="password" v-model="form.password" minlength="6" />
        <label for="repeat_password">Repeat Password</label>
        <input type="password" name="repeat_password" />
        <input type="submit" value="Register" />
      </form>
      <p>or <span>Log In</span></p>
    </div>
  </section>
</template>
<style>
.login .form-container {
  width: 566px;
  height: auto;
  background-color: #161515;
  padding: 26px 70px 26px 70px;
}

.login .form-container > p:first-child {
  text-align: center;
  font-size: 24px;
  color: #b8b8b8;
}

.login .form-container > form {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.login .form-container > form > input {
  height: 42px;
  background-color: #404040;
  margin-bottom: 24px;
}

.login .form-container > form > label {
  font-size: 17px;
  color: #a3a3a3;
}

.login .form-container > form > input[type="submit"] {
  background-color: #3b82f6;
  width: 136px;
  text-align: center;
  margin: auto;
  cursor: pointer;
  font-size: 20px;
  margin-top: 57px;
  margin-bottom: 20px;
}

.login .form-container > p:last-child {
  text-align: center;
  font-size: 15px;
  color: #ffffffff;
}

.login .form-container > p:last-child > span {
  color: #ffffffff;
}

.login > p {
  font-size: 15px;
  color: #ffffffff;
  margin-top: 20px;
}

.login > p > span {
  color: #c1c1c1;
}
</style>
<script setup>
import { reactive } from "vue";

const form = reactive({
  email: "",
  password: "",
  repeat: "",
});
</script>
