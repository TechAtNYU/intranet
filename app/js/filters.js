"use strict";

angular
  .module("app.filters", [])
  .filter("interpolate", version => {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  })
  // Adds lead string to team position
  .filter("formatTeamDisplay", () => {
    return function(teamName, isLead) {
      return `${teamName} ${isLead ? "- Lead" : ""}`;
    };
  });
