import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  url: DS.attr('string'),
  description: DS.attr('string')
});