import {Store} from '../lib/store.js';

let store = new Store('settings');

let styleDefaults = {
  'background-color': '#fff',
  'text-color': '#333',
  'border-color': '#ddd',
  'link-color': '#003A97',
  'link-text-decoration': 'none',
  'button-color': '#fff',
  'button-background-color': '#006AA7',
  'cell-background-color': '#f3f3f3',

};

let getStyles = function(storedStyles) {
  return Object.keys(styleDefaults).reduce((prev, prop) => {
    let stored = storedStyles.get(prop);
    let val = stored || styleDefaults[prop];

    if (!stored) {
      storedStyles.set(prop, val);
    }

    prev[prop] = val;

    return prev;
  }, {});
};

let setSelected = function(select, val) {
  let options = select.children;

  for (let i = 0, len = options.length; i < len; i++) {
    if (options[i].value === val) {
      select.selectedIndex = i;
    }
  }
};

export let applyStyles = function(storedStyles) {
  let styles = getStyles(storedStyles);
  let el = document.createElement('style');
  let sheet;

  document.head.appendChild(el);

  sheet = el.sheet;

  let html = Object.keys(styles).map((prop) => {
    return `--${prop}: ${styles[prop]};`;
  });

  sheet.insertRule(`body { ${html.join('')} }`, 0);
};

export let populateStyleInputs = function(storedStyles) {
  let styles = getStyles(storedStyles);

  Object.keys(styles).forEach((prop) => {
    let val = styles[prop];
    let input = document.querySelector(`[name="${prop}"]`);

    if (input.nodeName === 'SELECT') {
      setSelected(input, val);
    } else if (input) {
      input.value = val;
    }
  });
};

export let setStyles = function(storedStyles) {
  Object.keys(styleDefaults).forEach((prop) => {
    let input = document.querySelector(`[name="${prop}"]`);
    // If nothing in input, reset to defaults
    let val = input.value || styleDefaults[prop];

    storedStyles.set(prop, val);
  });
};

export let updateSwatch = function(event) {
  let tgt = event.target;
  let swatch = tgt.nextElementSibling;

  if (!swatch.dataset.swatch) {
    return;
  }

  swatch.style.backgroundColor = tgt.value;
};
