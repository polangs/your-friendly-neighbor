function getLocation(query, client, superagent) {
  console.log('TESTING QUERY', query);
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEO_DATA}`;

  return superagent.get(URL)
    .then(response => {
      const locationName = response.body.results[0].address_components[0].long_name;
      const imageSearchURL = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_CUSTOM_SEARCH_TOKEN}&cx=${process.env.GOOGLE_CUSTOM_SEARCH_ID}-x5i&&searchType=image&q=${locationName}&num=1`;
      return superagent.get(imageSearchURL).then(imageSearchResult => {
        console.log(imageSearchResult.body.items);
        const link = imageSearchResult.body.items[0].link;
        return {query: query,
                imageURL: link,
                locationInfo: response.body.results[0]}
      })
    })
    .then(locationData => {
      return new Location(locationData.query, locationData.imageURL, locationData.locationInfo)
    })
    .then(location => {
      return cacheLocation(location, client)
    });
}

function Location(query, imageLink, geoData) {
  console.log(query, imageLink, geoData);
  this.query = query;
  this.formatted_query = geoData.formatted_address;
  this.name = geoData.address_components[0].long_name;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
  this.map = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=13&size=600x300&maptype=roadmap&key=AIzaSyBFwYFVJcxEDhqJPLXsEFGeLZLaa0RtCbQ`;
  this.image = imageLink;
}

function cacheLocation(location, client) {
  // console.log('caching query);
  const SQL = `INSERT INTO popular (query, formatted_query, latitude, longitude) VALUES ('${
    location.query}', '${location.formatted_query}', ${location.latitude}, ${location.longitude});`;
  return client.query(SQL)
    .then(results => {
      console.log('?????????', results);
      return location;
    });
}

module.exports = getLocation;
