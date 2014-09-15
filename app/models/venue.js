import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  address: DS.attr('string'),
  seats: DS.attr('number'),
  kind: DS.attr('string'),
  notes: DS.attr('string'),
  company: DS.belongsTo('company')
});