export default {
    computed: {
        filteredProducts: function() {
          return this.productList.filter((product) => {
              return product.item_name.toLowerCase().match(this.search.toLowerCase());
            });
        }
    }
};
