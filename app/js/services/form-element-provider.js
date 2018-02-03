angular.module("app.services").provider("formElementProvider", function() {
  "use strict";

  const useTextarea = function(field) {
    const acceptsLongValues = (field.validation.maxlength || 0) > 200;
    const acceptsEmailOrUrl = field.validation.url || field.validation.email;

    // For the rationale behind never giving email and url fields a
    // textarea, see https://github.com/TechAtNYU/intranet/issues/102
    return acceptsLongValues && !acceptsEmailOrUrl;
  };

  const templates = {
    String: function(field) {
      if (field && field.validation["allowed-html"]) {
        return "partials/inputs/tinymce-input.html";
      } else if (field && field.validation["one-of"]) {
        return "partials/inputs/enum-input.html";
      } else if (
        field &&
        useTextarea(field) &&
        field["friendly-name"] !== "Address"
      ) {
        return "partials/inputs/textarea-input.html";
      } else {
        return "partials/inputs/default-input.html";
      }
    },
    Relationship: function(field) {
      if (field.kind["is-array"]) {
        return "partials/inputs/link-multiple-input.html";
      } else {
        return "partials/inputs/link-input.html";
      }
    },
    Date: "partials/inputs/date-input.html",
    Boolean: "partials/inputs/boolean-input.html",
    Number: "partials/inputs/number-input.html"
  };

  return {
    $get: function() {
      return {
        getTemplateUrl: function(field) {
          const t = templates[field.kind["base-type"]];
          if (_.isFunction(t)) {
            return t(field);
          } else {
            return t || templates["String"]();
          }
        },
        hiddenFields: ["id", "created", "modified"]
      };
    }
  };
});
