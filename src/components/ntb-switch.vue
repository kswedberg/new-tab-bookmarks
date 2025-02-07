<template>
  <div>
    <input
      @input="switchValue"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      type="checkbox"
      class="ntb-switch"
      :style="{
        width: inputWidth,
        borderColor: color,
        backgroundColor: color,
        '--x': checked ? `calc(${inputWidth} - 20px)` : '0',
      }"
    >
    <label :for="id">{{ labelText }}</label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'switcher',
    },
    name: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 40,
    },
    activeText: {
      type: String,
      default: null,
    },
    inactiveText: {
      type: String,
      default: null,
    },
    activeColor: {
      type: String,
      default: null,
    },
    inactiveColor: {
      type: String,
      default: null,
    },
    value: {
      type: [Boolean, String, Number],
      default: false,
    },
    activeValue: {
      type: [Boolean, String, Number],
      default: true,
    },
    inactiveValue: {
      type: [Boolean, String, Number],
      default: false,
    },
  },
  data() {
    return {
      color: undefined,
    };
  },
  computed: {
    checked() {
      return this.value === this.activeValue;
    },
    switchDisabled() {
      return this.disabled;
    },
    labelText() {
      if (!this.inactiveText) {
        return this.activeText;
      }

      return this.checked ? this.activeText : this.inactiveText;
    },
    inputWidth() {
      return typeof this.width === 'number' ? `${this.width}px` : this.width;
    },
  },
  watch: {
    checked() {
      this.$refs.input.checked = this.checked;
      console.log('checked changed');
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
    },
  },
  mounted() {
    this.coreWidth = this.width || 40;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
    this.$refs.input.checked = this.checked;
  },
  methods: {
    handleChange(event) {
      const val = this.checked ? this.inactiveValue : this.activeValue;

      this.$emit('input', val);
      this.$emit('change', val);
      this.$nextTick().then(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        if (this.$refs.input) {
          this.$refs.input.checked = this.checked;
        }
      });
    },
    setBackgroundColor() {
      this.color = this.checked ? this.activeColor : this.inactiveColor;

      const {checked, activeColor, inactiveColor} = this;

      console.log('hello', this.color, {checked, activeColor, inactiveColor});
    },
    switchValue() {
      if (!this.switchDisabled) {
        this.handleChange();
      }
    },
  },
};
</script>

<style scoped>
/* Based on https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/ */

.ntb-switch {
  --active: #275efe;
  --active-inner: #fff;
  --thumb: #fff;
  --focus: 2px rgba(39, 94, 254, 0.3);
  --border: #bbc1e1;
  --border-hover: #275efe;
  --background: #bababd;
  --disabled: #f6f8ff;
  --disabled-inner: #e1e6f9;
  appearance: none;
  height: 20px;
  outline: none;
  display: inline-block;
  vertical-align: top;
  position: relative;
  margin: 0;
  cursor: pointer;
  border: 1px solid var(--bdc, var(--border));
  background: var(--bg, var(--background));
  transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;

  border-radius: 11px;


  &:checked {
    --bg: var(--active);
    --bdc: var(--active);
    --ab: var(--active-inner);
    /* --x: 17px; */
    /* --duration-opacity: 0.3s;
    --duration-transform: 0.6s;
    --transform-easing: cubic-bezier(0.2, 0.85, 0.32, 1.2); */
    transition: transform 0.6s cubic-bezier(0.2, 0.85, 0.32, 1.2), opacity 0.3s;
  }

  &:disabled {
    --bg: var(--disabled);
    cursor: not-allowed;
    opacity: 0.9;
    &:checked {
      --bg: var(--disabled-inner);
      --bdc: var(--border);
    }
    &:not(:checked) {
      &:after {
        opacity: 0.6;
      }
    }
    & + label {
      cursor: not-allowed;
    }
  }

  &:hover {
    &:not(:checked) {
      &:not(:disabled) {
        --bdc: var(--border-hover);
      }
    }
  }
  &:focus {
    box-shadow: 0 0 0 var(--focus);
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    transition: transform 0.3s ease, opacity 0.2s;
    left: 1px;
    top: 1px;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background: var(--thumb);
    transform: translateX(var(--x, 0));
  }


  & + label {
    font-size: 14px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }

}

</style>
