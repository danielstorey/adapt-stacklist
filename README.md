# adapt-stacklist

**Stacklist** is a *presentation component* Created by Dan storey.
<img align="right" src="https://raw.githubusercontent.com/danielstorey/assets/master/stacklist-demo.png" alt="Stacklist in action">

The **Stacklist** component displays list items one at a time when the learner clicks a button. Items fly into view from left and right alternately.

[**Click here for an interactive demo**](https://danielstorey.github.io/adapt-demo-course/#/id/co-main)

##Installation

Run the following from the command line: `adapt install adapt-stacklist`

## Settings Overview

The attributes listed below are used in *components.json* to configure **Stacklist**, and are properly formatted as JSON in [*example.json*](https://github.com/danielstorey/adapt-stacklist/example.json).

### Attributes

For core model attributes see [**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes). The attributes listed below are specific to the `Stacklist` component.

**_component** (string): This value must be: `stacklist`.

**_button** (object): This allows you to specify the default button text (Optional).

>**startText** (string): The text to display before any items are shown (Optional - defaults to "Click here to begin")

>**continueText** (string): The text to display to trigger the next item (Optional - defaults to "Next")

**_items** (array): Each item represents a sliding element.

>**body** (string): The main text for sliding item.

>**next** (string): This text becomes the 'next' button.

## Limitations

No known limitations

----------------------------
**Version number:**  4.0.0
**Framework versions:**  >=4
**Author / maintainer:** Dan Storey
