define(function(require) {

	var ComponentView = require('coreViews/componentView');
	var Adapt = require('coreJS/adapt');

	var StackList = ComponentView.extend({

		events: {
			"click .stacklist-next": "nextItem"
		},

		postRender: function() {
			this.setupListItems();
			this.setReadyStatus();
			this.model.set("_stage", -1);
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
				offset.left = even ? - wWin : wWin;
				$el.offset(offset).hide();
			});
		},

		nextItem: function() {
			var stage = this.model.get("_stage") + 1;
			this.setStage(stage);
		},

		setStage: function(stage) {
			this.model.set("_stage", stage);

			this.$(".stacklist-next").html("Next");
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
