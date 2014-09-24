import DS from "ember-data";

export default DS.Model.extend({
  member: DS.belongsTo('person'),
  isLead: DS.attr('boolean'),
  startDate: DS.attr('date'),
  endDate: DS.attr('date')
});