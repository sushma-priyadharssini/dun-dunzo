<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light">DUN </span>
        <span>DUNZO</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  flat color="green" @click="parseData">Parse <v-icon right>exit_to_app</v-icon> </v-btn>
      <router-link v-bind:to="'/quickBuy'">
        <v-btn flat color="green">Quick Buy <v-icon right>exit_to_app</v-icon> </v-btn>
      </router-link>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods : {
    parseData : function () {
      this.$http.post('http://localhost:4000/postProduct', { title: 'lala' });
    }
  }
}
</script>

<style>
</style>
