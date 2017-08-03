define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var StackList = ComponentView.extend({

	    TRANSITION_TIME: 250,

		events: {
			"click .stacklist-next": "nextItem"
		},

		preRender: function() {
			this.model.set("_stage", -1);
			this.setupButton();
			this.listenTo(Adapt, "device:resize", this.setupListItems);
		},

		postRender: function() {
			if (!this.model.get("_isComplete") || this.model.get("_isResetOnRevisit")) this.setupListItems();
			this.setReadyStatus();
		},

		setupButton: function() {
			var _button = this.model.get("_button") || {};

			if (!_button.startText) _button.startText = "Click here to begin";
			if (!_button.continueText) _button.continueText = "Next";

			this.model.set("_button", _button);
		},

		setupListItems: function() {

			// Set item positions alternating R and L
            this.$(".stacklist-items").height(this.$(".stacklist-items-inner").height());
			var $items = this.$(".stacklist-item");
			var wWin = $(window).width();
			$items.each(function(i) {
				var $el = $items.eq(i);
				var even = i % 2 === 0;
				var offset = $el.offset();
				offset.left = even ? - ($el.outerWidth() + 10) : wWin + 10;
				$el.offset(offset);
			});
			this.$(".stacklist-button").show();
		},

        setupListHeight: function() {

        },

		nextItem: function() {
			var stage = this.model.get("_stage") + 1;
			this.setStage(stage);
		},

		setStage: function(stage) {
			this.model.set("_stage", stage);

			var continueText = this.model.get("_items")[stage].next || this.model.get("_button").continueText;
			var isComplete = this.model.get("_items").length - 1 === stage;

			if (!isComplete) {
                this.$(".stacklist-next").html(continueText);
            }

			var $item = this.$(".stacklist-item").eq(stage);
            $item.removeClass("visibility-hidden");
			var h = $item.outerHeight(true);

			this.$(".stacklist-button").velocity({top: "+=" + h}, this.TRANSITION_TIME);

			$item.velocity({left: 0}, {
			    delay: this.TRANSITION_TIME,
                duration: this.TRANSITION_TIME,
                complete: function() {
			        $item.addClass("show");
                }
			});

			if (isComplete) {
				this.onComplete()
			}
		},

		onComplete: function () {

			var $button = this.$(".stacklist-button");
			$button.velocity({opacity: 0}, {
			    duration: this.TRANSITION_TIME,
                queue: false,
                complete: function() {
                    $button.remove();
                }
			});

			this.setCompletionStatus();
		}
	});

	Adapt.register('stacklist', StackList);

	return StackList;

});
