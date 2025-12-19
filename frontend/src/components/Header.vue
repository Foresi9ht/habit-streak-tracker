<template>
  <header>
    <nav class="header-nav nav-desktop">
      <div class="header-nav-elems default-container">
        <ul>
          <li>
            <router-link to="/" class="logo">
              <img src="/img/icons/habitlogo.png" alt="logo" />
            </router-link>
          </li>
        </ul>
        <ul class="second-menu">
          <li><router-link to="/">HOME</router-link></li>
          <li><router-link to="/habits">MY HABITS</router-link></li>
          <li><router-link to="/habits/stats">STATISTICS</router-link></li>
          <li><router-link to="/login">LOGIN</router-link></li>
          <li><router-link to="/register">REGISTER</router-link></li>
        </ul>
      </div>
    </nav>
  </header>
</template>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

header {
  background-color: black;

  padding: 10px 5px 10px 5px;
}

body {
  font-family: "Oswald", sans-serif;
  overflow-x: hidden;
}
input {
  all: unset;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

a {
  color: white;
  text-decoration: none;
}

.default-container {
  max-width: 1716px;
  margin: auto;
}

header {
  position: sticky;
  top: 0;
  z-index: 3;
}

header .header-nav {
  display: flex;
  height: 56px;
  padding: 0px 0 0 0;
  margin: 10px;
}

header .header-nav ul {
  display: flex;
  align-items: center;
  position: relative;
}

.header-nav-elems {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.header-nav-elems img {
  width: 50px;
  height: 50px;
}

ul.second-menu > li > a {
  padding: 0 0 0 17px;
}

ul.second-menu > li:last-child {
  margin-left: 17px;
}

ul.second-menu > li:last-child > a {
  border: solid 1px white;
  width: 108px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

ul.second-menu > li:nth-last-child(2) {
  margin-left: 100px;
}

ul.second-menu > li:first-child > a {
  margin-right: 10px;
}

ul.second-menu > li:first-child > a::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  background-color: #3b82f6;
  border-radius: 50%;
  left: 74px;
  top: 14px;
}
</style>
