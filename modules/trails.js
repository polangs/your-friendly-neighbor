function getTrails(location, superagent) {
    console.log('Yelp request', location);
    const URL = `https://api.yelp.com/v3/businesses/search?term=hiking&location=${location}`;
  
    return superagent.get(URL)
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
      .then(response => response.body.businesses.map(trail => new Trail(trail)));
  }
  
  function Trail(trailData) {
    this.name = trailData.name ? trailData.name : 'No name available';
    this.rating = trailData.rating ? trailData.rating : 'No rating available';
    this.address = trailData.location.display_address;
    this.phoneNumber = trailData.display_phone ? trailData.display_phone : 'No phone number available';
    this.url = trailData.url;
    this.image = trailData.image_url;
    console.log('*******Trail object*******:', this);
  }
  
  module.exports = getTrails