const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dunzo',
  password: 'postgres',
  port: 5432,
})

const getGroceries = (request, response) => {
  pool.query('SELECT * FROM stores', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

 const getProductsById = (request, response) => {
   const id = parseInt(request.params.id)
   var query = 'select s.item_id, s.price, i.item_name from store_item s join items i on i.item_id = s.item_id and s.store_id = ' + 1;

  pool.query(query, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const filterProducts = (request, response) => {
  const searchString = request.query.searchString;
  var query = "select s.store_name, st.price, i.item_name from stores s left join store_item st on s.store_id = st.store_id left join items i on st.item_id = i.item_id where i.item_name LIKE '" + searchString + "%'";

 pool.query(query, (error, results) => {
   if (error) {
     throw error
   }
   response.status(200).json(results.rows)
 })
}

const postProduct = (data) => {
  var stId, itId;
  console.log(data);
  var storesQuery = "INSERT INTO stores (store_name, address) VALUES('"+ data.shopName + "','" + data.shopAddress +"') ON CONFLICT (store_name) DO NOTHING;"
  pool.query(storesQuery, (error, results) => {
    if (error) {
      throw error
    }
    pool.query("SELECT store_id FROM stores where store_name='" + data.shopName + "'", (error, results1) => {
      if (error) {
        throw error
      }
      stId = results1.rows[0].store_id;
      console.log(stId);
      for(let i = 0; i < data.items.length; i++) {
          var itemsQuery = "INSERT INTO items (item_name) VALUES('"+ i.name +"') ON CONFLICT (item_name) DO NOTHING";
          pool.query(itemsQuery, (error, results2) => {
            if (error) {
              throw error
            }
            pool.query("SELECT item_id FROM items where item_name='" + i.name + "'", (error, results3) => {
              if (error) {
                throw error
              }
              itId = results3.rows[0].item_id;
              console.log(itId);
              var itemStoreQuery = "INSERT INTO store_item (store_id, item_id, price) VALUES("+ stId + "," + itId + "," + i.price + ")";
              pool.query(itemStoreQuery, (error, results) => {
                if (error) {
                  throw error
                }
              })
            })

          })
      }
    })
  })
}

module.exports = {
  getGroceries,
  getProductsById,
  filterProducts,
  postProduct
}
