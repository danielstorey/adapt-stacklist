define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var StackList = ComponentView.extend({

        TRANSITION_TIME: 250,

        events: {
            "click .stacklist-next": "nextItem"
        },

        preRender: function() {
            this.model.set("_globals", Adapt.course.get("_globals"));
            this.model.set("_stage", -1);
            this.setupButton();
        },

        postRender: function() {
            this.$items = this.$(".stacklist-item");
            this.$button = this.$('.stacklist-button');

            if (!this.model.get("_isComplete") || this.model.get("_isResetOnRevisit")) {
                this.setupListItems();
                this.setupItemOffsets();
                this.listenTo(Adapt, 'device:resize', this.setupItemOffsets);
            }
            this.setReadyStatus();
        },

        setupButton: function() {
            var _button = this.model.get("_button") || {};
            // Set up button aria label

            var btnAriaLabel = this.model.get("_globals")._components._stacklist.ariaButtonLabel || this.model.get("_globals")._accessibility._ariaLabels.next;
            this.model.set({ buttonAriaLabel: btnAriaLabel });

            if (!_button.startText) _button.startText = "Click here to begin";
            if (!_button.continueText) _button.continueText = "Next";
            if (!_button.ariaLabel) _button.ariaLabel = btnAriaLabel;

            this.model.set("_button", _button);
        },

        setupListItems: function() {
            this.$items.addClass("visibility-hidden");
            this.$button.show();
        },

        setupItemOffsets: function() {
            // Set item positions alternating R and L
            var wWin = $(window).width();
            var offsetLeft = -this.$el.outerWidth();
            var offsetRight = wWin + 10;
            var stage = this.model.get('_stage');
            var buttonOffset = 0;

            this.$items.each(function(i) {
                var $el = $(this);

                if (i <= stage) {
                    buttonOffset += $el.outerHeight(true);
                    return;
                }

                var isLeft = i % 2 === 0;
                var offset = $el.offset();
                offset.left = isLeft ? offsetLeft : offsetRight;
                $el.offset(offset);
            });

            this.$button.css({top: buttonOffset});


        },

        nextItem: function() {
            var stage = this.model.get("_stage") + 1;
            this.setStage(stage);
        },

        setStage: function(stage) {
            this.model.set("_stage", stage);

            var items = this.model.get("_items");
            var isComplete = this.model.get("_items").length - 1 === stage;
            var $item = this.$(".stacklist-item").eq(stage);

            $item.removeClass("visibility-hidden");

            var h = $item.outerHeight(true);

            $item.velocity({ left: 0 }, {
                delay: this.TRANSITION_TIME,
                duration: this.TRANSITION_TIME,
                complete: function() {
                    $item.addClass("show").a11y_focus();
                }
            });

            if (isComplete) {
                this.onComplete();
                this.updateButton('', h);
            } else {
                var continueText = items[stage].next || this.model.get("_button").continueText;
                var btnAriaLabel = this.model.get("_globals")._components._stacklist.ariaButtonLabel || this.model.get("_globals")._accessibility._ariaLabels.next;
                var ariaLabel = continueText + ', ' + btnAriaLabel;

                this.updateButton(continueText, h, ariaLabel);
            }
        },

        updateButton: function(text, offset, ariaLabel) {
            this.$(".stacklist-button").css({ top: "+=" + offset });

            if (text === '') { // On last item we do not want to update text (it's most important when stack-list has only one item)
                return;
            }

            var $button = this.$(".stacklist-next");
            $button.blur();
            setTimeout(function() {
                $button.html(text);
                $button.attr('aria-label', ariaLabel);
            }, this.TRANSITION_TIME * 2);
        },

        onComplete: function() {
            var $buttonDiv = this.$(".stacklist-button");
            var $button = this.$(".stacklist-next");
            $buttonDiv.css({ opacity: 0 });

            setTimeout(function() {
                $button.remove();
            }, this.TRANSITION_TIME);

            this.setCompletionStatus();
        }
    });

    Adapt.register('stacklist', StackList);

    return StackList;

});
