function getLocation(query, superagent) {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEO_DATA}`;
  
  return superagent
    .get(URL)
    .then(response => {
      console.log('Response.body', response.body);
      console.log('*******************');
      const newLocation = new Location(query, response.body.results[0]);
      return newLocation;
    });
}



function Location(query, geoData) {
  console.log(query, geoData);
  this.search_query = query;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}

module.exports = getLocation;
