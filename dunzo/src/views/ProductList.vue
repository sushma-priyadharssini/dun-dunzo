<template>
  <div class="productList">
    <h1 class="subheading grey--text">Products</h1>
    <v-layout row wrap>
      <v-flex xs12 sm6 md12 id="searchBar">
        <v-text-field label="solo" v-model="search" placeholder="Search Products" solo></v-text-field>
    </v-flex>
  </v-layout>

    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="product in filteredProducts" :key="product.item_id">
          <v-card flat class="text-xs-center ma-3" max-width="400">
            <v-responsive class="pt-4">
              <v-avatar size="100" class="grey lighten-2">
                <img :src="'/g2.jpg'">
              </v-avatar>
            </v-responsive>
            <v-card-text>
              <div class="subheading">{{ product.item_name }}</div>
              <div class="grey--text">Rs. {{ product.price }}</div>
              <div class="grey--text">1 Kg</div>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>

  </div>
</template>

<script>
import searchMixin from '../mixins/searchMixin';

export default {
  data() {
    return {
      productList: [],
      search: ''
    }
  },
  created() {
        this.$http.get('http://localhost:4000/productList/' + this.$route.params.id).then(function(data){
            this.productList = data.body;
        });
  },
  mixins: [searchMixin]
};
</script>

<style >
#searchBar {
  margin: 0 80px 0 80px ;
}
</style>
