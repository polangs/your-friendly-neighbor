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
  this.name = geoData.address_components[0].long_name;
  this.query = query; //formerly this.search_query = query; in JSON file as well
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
  console.log('My name is: ', this.name);
}

module.exports = getLocation;
