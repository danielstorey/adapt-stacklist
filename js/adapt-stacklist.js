define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var StackList = ComponentView.extend({

		events: {
			"click .stacklist-next": "nextItem"
		},

		preRender: function() {
			this.model.set("_stage", -1);
			this.setupButton();
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
			var $stacklistItems = this.$(".stacklist-items");
			$stacklistItems.height($stacklistItems.height());
			var $items = this.$(".stacklist-item");
			var wWin = $(window).width();
			$items.each(function(i) {
				var $el = $items.eq(i);
				var even = i % 2 === 0;
				var offset = $el.offset();
				offset.left = even ? - ($el.outerWidth() + 10) : wWin + 10;
				$el.offset(offset).hide();
			});
			this.$(".stacklist-button").show();
		},

		nextItem: function() {
			var stage = this.model.get("_stage") + 1;
			this.setStage(stage);
		},

		setStage: function(stage) {
			this.model.set("_stage", stage);
			var continueText = this.model.get("_items")[stage].next || this.model.get("_button").continueText;
			this.$(".stacklist-next").html(continueText);
			var $item = this.$(".stacklist-item").eq(stage);
			$item.show();
			var h = $item.outerHeight(true);

			this.$(".stacklist-button").css({top: "+=" + h});
			setTimeout(function() {
				$item.css({left: 0});
			}, 250);

			if (this.model.get("_items").length - 1 === stage) {
				this.onComplete()
			}
		},

		onComplete: function () {

			var $button = this.$(".stacklist-button");
			$button.css({top: $(window).height()});
			setTimeout(function() {
				$button.remove();
			}, 500);

			this.setCompletionStatus();
		}
	});

	Adapt.register('stacklist', StackList);

	return StackList;

});
