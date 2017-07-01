/* eslint-disable prefer-template */
// jQuery modal Plugin

// See byrne twine site for usage

(function($) {
  var settings = {
    keepFocus: true,
    templates: {
      modal: '<div class="Modal" aria-live="polite"></div>',
      content: '<div class="Modal-content"></div>',
      closeDiv: '<div class="Modal-close"></div>',
      closeBtn: '<button class="Modal-closeBtn Button Button--close">&times;</button>'
    },
    classes: {
      modal: 'js-modal',
      content: 'js-modalContent',
      closeDiv: 'js-closeModalWrapper',
      closeBtn: 'js-closeModal',
      active: 'is-active'
    },

    // events
    onInit: null,
    beforeOpen: null,
    beforeOpenAsync: null,
    afterOpen: null,
    beforeClose: null,
    afterClose: null
  };

  var getData = function getData(el) {
    var modal, opts;
    var $trigger = $(el);
    var data = $trigger.data('modal') || {};

    if (!data.modal) {
      return false;
    }

    return data;
  };

  var methods = {
    init: function(options) {

      this.each(function() {
        var data, dataId, opts;
        var  $modal, $content;
        var $trigger = $(this);

        $trigger.modal('options', options);
        data = $trigger.data('modal') || {};
        opts = data.options;

        opts.selectors = {};
        $.each(opts.classes, function(key, val) {
          opts.selectors[key] = '.' + val.split(/\s+/).join('.');
        });

        // If the plugin hasn't been initialized yet
        if (!data.modal) {
          dataId = +new Date();

          data = {
            modal: true,
            options: opts,
            id: dataId
          };

          // create elements and append to body
          $content = $(opts.templates.content)
          .addClass(opts.classes.content);

          $modal = $(opts.templates.modal)
          .addClass(opts.classes.modal)
          .append($content)
          .appendTo('body');

          // Associate created element with invoking element
          $modal.data('modal', {trigger: $trigger, id: dataId});

          // And vice versa
          data.modal = $modal;

          $trigger.addClass('js-modalTrigger');
          $trigger.data('modal', data);
        } // !data.modal

        if (opts.onInit) {
          opts.onInit.call(this, data);
        }
      });

      return this;
    },
    destroy: function() {

      this.each(function() {

        var $trigger = $(this);
        var data = $trigger.data('modal');

        // Remove created elements, unbind namespaced events, and remove data
        $('body').off('.modal');
        data.modal.remove();
        $trigger.off('.modal')
        .removeData('modal');

      });

      return this;
    },
    options: function(options) {

      this.each(function() {
        var $trigger = $(this);
        // don't use our getData() function here
        // because we want an object regardless
        var data = $trigger.data('modal') || {};
        var opts = data.options || {};

        // deep extend (merge) default settings, per-call options, and options set with:
        // html10 data-modal options JSON and $('selector').modal( 'options', {} );
        opts = $.extend(true, {}, $.fn.modal.defaults, opts, options || {});
        data.options = opts;
        $.data(this, 'modal', data);
      });

      return this;
    },
    open: function(opts) {
      var data = getData(this);

      if (!data) {
        methods.init.call(this, opts);
        data = getData(this);
      }
      var settings = $.extend({}, data.options, opts || {});
      var self = this;
      var $modal = data.modal;
      var openedBy = settings.openedBy || this;

      data.content = $modal.find(settings.selectors.content);
      data.openedBy = openedBy;
      $(this).data('openedBy', openedBy);

      var setupOpen = function setupOpen(show) {
        if (show === false) {
          return;
        }

        var $firstFocusable = $modal
        .find('input, select, button')
        .not('[readonly], [disabled], :hidden, ' + settings.selectors.closeBtn)
        .first();


        $modal.addClass(settings.classes.active);

        if (settings.templates.closeDiv && !$modal.find(settings.selectors.closeDiv).length) {
          var $closeDiv = $(settings.templates.closeDiv)
          .addClass(settings.classes.closeDiv)
          .html(settings.templates.closeBtn);

          $closeDiv.children().addClass(settings.classes.closeBtn);

          $modal.prepend($closeDiv);
        }

        if (!$firstFocusable.length) {
          $firstFocusable = $modal.find(settings.selectors.closeBtn);
        }

        if ($firstFocusable.length) {
          $firstFocusable[0].focus();
        }

        $('body')
        .on('keyup.modal' + data.id, function(event) {

          if (event.which === 27) {
            methods.close.call(self, data);
          }
        })
        .on('click.modal' + data.id, function(event) {
          var $tgt = $(event.target);

          var trigger = settings.delegateElement || self;

          if ($tgt.is(data.modal)) {
            return methods.close.call(self, data);
          }

          if ($tgt.hasClass(settings.classes.closeBtn) && $tgt.closest(data.modal).length) {
            methods.close.call(self, data);
          }
        })
        .on('keydown.modal' + data.id, function(event) {
          if (settings.keepFocus) {
            methods.keepFocus(event, $modal);
          }

        });

        if (settings.afterOpen) {
          settings.afterOpen.call(self, data);
        }
      };

      if (settings.beforeOpen) {
        settings.beforeOpen.call(this, data);
        setupOpen();
      } else if (settings.beforeOpenAsync) {
        settings.beforeOpenAsync.call(this, data, setupOpen);
      } else {
        setupOpen();
      }

    },
    close: function(settings) {
      var data, opts;

      if (settings && settings.options) {
        data = settings;
        opts = settings.options;
      } else {
        data = getData(this);
        opts = $.extend({}, data.options, settings || {});
      }

      var toFocus = $(this).data('openedBy') || this;

      if (!data) {
        return console.log('no data');
      }

      if (opts.beforeClose) {
        opts.beforeClose.call(this, data);
      }

      data.modal.removeClass(opts.classes.active);
      $('body').off('.modal' + data.id);
      toFocus.focus();

      if (opts.afterClose) {
        opts.afterClose.call(this, data);
      }
    },
    keepFocus: function keepFocus(event, $modal) {

      if (event.which !== 9) {
        return;
      }

      let $focusable = $modal.find('input, button, a, textarea, select, [tabindex]').not(':disabled').not(':hidden');
      let $focused = $(event.target);
      let index = $focusable.index($focused[0]);

      if (!event.shiftKey && index + 1 === $focusable.length) {
        event.preventDefault();
        $focusable[0].focus();
      } else if (event.shiftKey && index === 0) {
        $focusable.last()[0].focus();
      }
    },
  };

  var protoSlice = Array.prototype.slice;

  $.fn.modal = function(method) {

    if (methods[method]) {
      return methods[method].apply(this, protoSlice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.fn.modal');
    }

  };

  $.extend($.fn.modal, {
    defaults: settings
  });

})(jQuery);
