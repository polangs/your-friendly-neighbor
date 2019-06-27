function getLocation(query, superagent) {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEO_DATA}`;
  
  return superagent.get(URL)
    .then(response => {
      console.log('Response.body', response.body);
      console.log('*******************');
      const newLocation = new Location(query, response.body.results[0]);
      return newLocation;
    });
}

function Location(query, geoData) {
  console.log(query, geoData);
  this.query = query;
  this.formatted_query = geoData.formatted_address;
  this.name = geoData.address_components[0].long_name;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
  this.map = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=13&size=600x300&maptype=roadmap&key=AIzaSyBFwYFVJcxEDhqJPLXsEFGeLZLaa0RtCbQ`;
}

module.exports = getLocation;
