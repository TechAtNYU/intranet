"use strict";

angular.module("app.controllers").controller("TinyMceCtrl", $scope => {
  $scope.getTinyMceConfiguration = function(field) {
    return tinymceConfig(
      field.validation["allowed-html"],
      field.validation.maxlength || false,
      field.validation["read-only"]
    );
  };

  /**
	 * Returns a tinymce.init() compatible configuration object based on the
	 * field's allowed tags and maxlength.
	 *
	 * @TODO: Use tinymce.Editor.addButton() to add buttons for <blockquote> and <q>
	 * that automatically trigger a popup asking for `cite` info, so users can add
	 * attributed notes in the notes field.
	 *
	 * Also add a button for the character counter, which means (probably)figuring
	 * out a property that angular can observe to make falsey when over maxlength.
	 */
  var tinymceConfig = function(allowedTags, charLimit, disabled) {
    const toolbarItems = [];
    const formatsListItems = [];
    let allowsBlockFormatting = false;
    let allowsInlineFormatting = false;

    // Build the items in formatsListItems based on the allowedTags. We do want
    // to add the formats to formatsListItems in the order they're defined in
    // the object literal below, so it's reassuring to know that object member
    // enumeration is in fact deterministic in ES6.
    const tagsToFormats = {
      h1: { title: "Heading", format: "h1" },
      h2: { title: "Subheading", format: "h2" },
      p: { title: "Standard Paragraph", format: "p" },
      code: { title: "Code", icon: "code", format: "code" },
      sup: { title: "Superscript", icon: "superscript", format: "superscript" },
      sub: { title: "Subscript", icon: "subscript", format: "subscript" }
    };

    const tagsToButtonNames = {
      em: "italic",
      strong: "bold",
      ul: "bullist",
      ol: "numlist",
      blockquote: "blockquote"
    };

    for (const tag in tagsToFormats) {
      if (allowedTags.indexOf(tag) !== -1) {
        formatsListItems.push(tagsToFormats[tag]);
      }
    }

    // Add format picker to the toolbar
    toolbarItems.push("styleselect");
    toolbarItems.push("spacer");

    // Add inline formatting buttons
    ["strong", "em"].forEach(tag => {
      if (allowedTags.indexOf(tag) !== -1) {
        toolbarItems.push(tagsToButtonNames[tag]);
        allowsInlineFormatting = true;
      }
    });

    if (allowsInlineFormatting) {
      toolbarItems.push("spacer");
    }

    // Add Link buttons
    if (allowedTags.indexOf("a") !== -1) {
      toolbarItems.push("link");
      toolbarItems.push("anchor");
      toolbarItems.push("spacer");
    }

    // Add block formatting buttons.
    ["ul", "ol", "blockquote"].forEach(tag => {
      if (allowedTags.indexOf(tag) !== -1) {
        toolbarItems.push(tagsToButtonNames[tag]);
        allowsBlockFormatting = true;
      }
    });

    if (allowsBlockFormatting) {
      toolbarItems.push("spacer");
    }

    // HTML EDITING.
    toolbarItems.push("code");

    // Note: DO NOT include the importcss plugin below,
    // as a bug makes it incompatible with the styleselect button.
    return {
      selector: "textarea",
      theme: "modern",
      plugins: [
        "anchor autolink autoresize autosave charmap code contextmenu emoticons",
        "lists link noneditable paste save searchreplace tabfocus table",
        "template textpattern"
      ],
      toolbar: toolbarItems.join(" "),
      browser_spellcheck: true,
      fix_list_elements: true,
      image_advtab: true,
      menubar: false,
      statusbar: false,
      object_resizing: false,
      templates: [],
      valid_elements: allowedTags.join(","), // the array from the api
      relative_urls: false,
      style_formats: formatsListItems,
      style_formats_merge: false,
      autoresize_min_height: 175,
      readonly: disabled
    };
  };
});
