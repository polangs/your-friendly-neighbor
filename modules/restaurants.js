function getRestaurants(location, superagent) {
  console.log('Yelp request', location);
  const URL = `https://api.yelp.com/v3/businesses/search?term=restaurant&location=${location}`;

  return superagent.get(URL)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(response => response.body.businesses.map(restaurant => new Restaurant(restaurant)));
}

function Restaurant (restaurantData) {
  this.id = restaurantData.id;
  this.restaurant_name = restaurantData.name; //changed this.name to this.restaurant_name
  this.rating = restaurantData.rating;
  this.price = restaurantData.price;
  this.address = restaurantData.display_address;
  this.phoneNumber = restaurantData.display_phone;
  this.url = restaurantData.url;
  this.image = restaurantData.image_url;
}

module.exports = getRestaurants
