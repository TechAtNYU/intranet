import DS from "ember-data";

export default DS.Model.extend({
  name: DS.attr('string'),
  currentEmployer: DS.belongsTo('company'),
  twitterId: DS.attr('string'),
  'contact.phone': DS.attr('string'),
  'contact.twitter': DS.attr('string'),
  'contact.email': DS.attr('string'),
  isApproved: DS.attr('boolean'),
  skills: DS.attr(),
  wantsToLearn: DS.attr(),
  notes: DS.attr('string'),
  imgUrl: DS.attr('string'),
  school: DS.attr('string'),
  graduationDate: DS.attr('date')
});