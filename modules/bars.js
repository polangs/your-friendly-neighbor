function getBars(location, superagent) {
  console.log('Yelp request', location);
  const URL = `https://api.yelp.com/v3/businesses/search?term=bars&location=${location}`;

  return superagent.get(URL)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(response => response.body.businesses.map(bar => new Bar(bar)));
}

function Bar(barData) {
  this.id = barData.id;
  this.bar_name = barData.name ? barData.name : 'No name available';
  this.rating = barData.rating ? barData.rating : 'No rating available';
  this.price = barData.price ? barData.price : 'No price available';
  this.address = barData.location.display_address;
  this.phoneNumber = barData.display_phone ? barData.display_phone : 'No phone number available';
  this.url = barData.url;
  this.image = barData.image_url;
}

module.exports = getBars
