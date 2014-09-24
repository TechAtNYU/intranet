import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  isMeta: DS.attr('boolean'),
  memberships: DS.hasMany('team-membership')
});