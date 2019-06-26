function getEvents(query, superagent){
    console.log('query', query);
    const URL = `https://www.eventbriteapi.com/v3/events/search?location.address=${query.formatted_query}&location.within=1km`
    return superagent.get(URL)
      .set('Authorization', `Bearer ${process.env.EVENT_BRITE}`)
      .then(data => data.body.events.map(event => new Event(event)));
  }
  
  function Event(event){
    this.link = event.url,
    this.name= event.name.text,
    this.event_date = event.start.local,
    this.summary = event.summary
  }

  module.exports = getEvents;