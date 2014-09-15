import Ember from 'ember';

var Router = Ember.Router.extend({
  location: CmsENV.locationType
});

Router.map(function() {
  this.resource('events');
});

export default Router;
