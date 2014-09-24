import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  school: DS.attr('string'),
  notes: DS.attr('string'),
  inNYUEN: DS.attr('boolean'),
  url: DS.attr('string'),
  liaisons: DS.hasMany('person', {async: true})
});