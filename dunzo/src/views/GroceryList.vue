<template>
  <div class="groceryList">
    <h1 class="subheading grey--text">Groceries</h1>
      <v-layout row wrap>
        <v-flex xs12 sm6 md12 id="searchBar">
          <v-text-field label="solo" v-model="search" placeholder="Search Products" solo
          v-on:input="filterProducts('input', $event)"></v-text-field>
      </v-flex>
    </v-layout>

    <v-container class="my-5" v-show="!search">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="shop in groceryList" :key="shop.store_id">
          <v-card flat class="text-xs-center ma-3" max-width="400">
            <v-responsive class="pt-4">
              <v-avatar size="100" class="grey lighten-2">
                <img :src="'/g2.jpg'">
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <router-link v-bind:to="'/groceries/products/' + 1"><h2>{{ shop.store_name }}</h2></router-link>
              <div class="grey--text">Supermarket</div>
              <div class="grey--text">{{ shop.address }}</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="my-5" v-show="search">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg12 v-for="product in productList" :key="product.store_name">
          <v-card flat class="text-xs-center ma-3" max-width="500">
            <v-list-item three-line>
              <v-avatar size="80" class="grey lighten-2">
                <img :src="'/g2.jpg'">
              </v-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline mb-1">{{ product.item_name }}</v-list-item-title>
                <v-list-item-subtitle>{{ product.store_name }}</v-list-item-subtitle>
                <div class="grey--text">Rs. {{ product.price }}</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <!-- <v-card flat class="text-xs-center ma-3" max-width="400">
            <v-responsive class="pt-4">
              <v-avatar size="100" class="grey lighten-2">
                <img :src="'/g2.jpg'">
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading"></div>
              <div class="grey--text">{{ product.store_name }}</div>
              <div class="grey--text">Rs. {{ product.price }}</div>
            </v-card-text>
          </v-card> -->
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>

export default {
  data() {
    return {
      groceryList: [],
      productList: []
    }
  },
  created() {
        this.$http.get('http://localhost:4000/groceryList').then(function(data){
            this.groceryList = data.body;
        });
  },
  methods : {
    filterProducts : function () {
      this.$http.get('http://localhost:4000/filterItems?searchString=' + this.search).then(function(data){
          this.productList = data.body;
      });
    }
  }
};
</script>
