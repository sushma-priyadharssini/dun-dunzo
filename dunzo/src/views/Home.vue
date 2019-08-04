<template>
  <div class="home">
    <h1 class="subheading grey--text">Home</h1>

    <v-container class="my-5">
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg4 v-for="category in categories" :key="category.name">
          <v-card flat class="text-xs-center ma-3" max-width="400">
            <v-list-item three-line>
              <v-avatar size="80" class="grey lighten-2">
                <img :src="category.avatar">
              </v-avatar>
              <v-list-item-content>
                <router-link v-bind:to="category.route"><h2>{{category.name}}</h2></router-link>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
      </v-layout>

    </v-container>

  </div>
</template>

<script>

export default {
  data() {
    return {
      categories: [
        { name: 'Food', avatar: '/g2.jpg', route:'/food' },
        { name: 'Daily Grocery', avatar: '/g2.jpg', route:'/groceries' },
        { name: 'Electronics', avatar: '/g2.jpg', route:'/electronics' }
      ]
    }
  }
};
</script>
