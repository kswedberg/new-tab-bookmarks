//
// Copyright (c) 2011 Frank Kohlhepp
// https://github.com/frankkohlhepp/fancy-settings
// License: LGPL v2.1
//

import {i18n as terms} from '../custom-options/i18n.js';

var lang = navigator.language;

let i18n = Object.assign({}, terms, {
  get: function (value) {
    if (value === "lang") {
        return lang;
    }

    if (this.hasOwnProperty(value)) {
        value = this[value];
        if (value.hasOwnProperty(lang)) {
            return value[lang];
        } else if (value.hasOwnProperty("en")) {
            return value["en"];
        } else {
            return Object.values(value)[0];
        }
    } else {
        return value;
    }
  }
});

export {i18n};
