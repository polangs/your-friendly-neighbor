function getEvents(location, superagent){
  const URL = `https://www.eventbriteapi.com/v3/events/search?location.address=${location}&location.within=1km`
  return superagent.get(URL)
    .set('Authorization', `Bearer ${process.env.EVENT_BRITE}`)
    .then(data => data.body.events.map(event => new Event(event)));
}

function Event(event){
  this.link = event.url;
  this.event_name= event.name.text;//changed this.name to this.event_name
  this.event_date = new Date(event.start.local).toUTCString();
  this.summary = event.summary;
  this.image = event.logo.original.url;

}

module.exports = getEvents;
