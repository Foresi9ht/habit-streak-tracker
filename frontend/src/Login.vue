<template>
  <section class="login">
    <div class="form-container">
      <p>Log In</p>
      <form action="#">
        <label for="email">Email</label>
        <input type="email" name="email" />
        <label for="password">Password</label>
        <input type="password" name="password" />
        <input type="submit" value="Log In" />
      </form>
      <p>or <span>Forgot Password</span></p>
    </div>
    <p>No account? <span>Create one</span></p>
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
  background-color: #ff501a;
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
  color: #747474;
}

.login .form-container > p:last-child > span {
  color: #c1c1c1;
}

.login > p {
  font-size: 15px;
  color: #747474;
  margin-top: 20px;
}

.login > p > span {
  color: #c1c1c1;
}
</style>
<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    loginUser() {
      console.log("Logging in:", this.email, this.password);
    },
  },
};
</script>
