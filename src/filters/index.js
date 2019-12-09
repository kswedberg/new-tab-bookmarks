const filters = {

  trim: (value = '') => typeof value === 'string' && value.trim() || value,
  ltrim: (value = '') => value.replace(/^\s+/, ''),
  rtrim: (value = '') => value.replace(/\s+$/, ''),

  pluralize: (value, plural, num) => num === 1 && value || plural,

  join: (value, separator = ', ') => Array.isArray(value) && value.join(separator) || '',

  phone: (value = '') => {
    if (/^\d{10}$/.test(value)) {
      return value.replace(/^(\d{3})(\d{3})/, '$1-$2-');
    }

    return value;
  },

  add: (value, addTo = 0) => {
    let base = value * 1;

    return isNaN(base) ? value : base + addTo;
  },

  // eslint-disable-next-line camelcase
  json_encode: (value, spacing) => {
    if (spacing) {
      return JSON.stringify(value, null, spacing);
    }

    return JSON.stringify(value);
  },

  replace: (value = '', pattern, replaceWith) => value.replace(pattern, replaceWith),
};

export const createFilters = (Vue) => {
  Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
  });
};
