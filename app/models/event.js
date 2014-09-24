import DS from "ember-data";

export default DS.Model.extend({
  title: DS.attr('string'),
  shortTitle: DS.attr('string'),
  description: DS.attr('string'),
  details: DS.attr('string'),
  venue: DS.belongsTo('venue'),
  startDateTime: DS.attr('date'),
  endDateTime: DS.attr('date'),
  teams: DS.hasMany('team', {async: true}),
  coorganizers: DS.hasMany('related-club', {async: true}),
  presenters: DS.hasMany('person', {async: true}),
  attendees: DS.hasMany('person', {async: true}),
  rsvpUrl: DS.attr('string'),
  cost: DS.attr('number'),
  addedBy: DS.belongsTo('person'),
  isPlaceholder: DS.attr('boolean', {defaultValue: true}),

  startDate: function() {
    return this.get('startDateTime');
  }.property('startDateTime')
});