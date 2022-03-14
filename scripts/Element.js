/**
 * @author Ganko Pi
 */
class Element {
	#creationDate;
	_htmlObject;
	#placeholder;
	_container;
	_remapKeysRef;

	/**
	 * Constructor for an element which manages a HTML object with a custom date of creation.
	 * @param {CategoryManager | Category} container the class which holds a reference to this element
	 * @param {string} creationDate the date on which the element was first created
	 */
	constructor(container, creationDate) {
		this.#creationDate = creationDate;
		this._htmlObject = null;
		this.#placeholder = null;
		this._container = container;
		this._remapKeysRef = null;
	}

	/**
	 * Sets a placeholder at the position of this._htmlObject and makes this._htmlObject absolute so it can be moved around without affecting other elements.
	 */
	makeElementAbsoluteAndSetPlaceholder() {
		// get position on screen
		this._htmlObject.style.left = this._htmlObject.getBoundingClientRect().left + "px";
		this._htmlObject.style.top = this._htmlObject.getBoundingClientRect().top + "px";

		// get current dimensions
		this._htmlObject.style.height = this.getHeight(false, false, false);
		this._htmlObject.style.width = this.getWidth(false, false, false);

		// replace this._htmlObject with a placeholder
		this.#placeholder = this.#getNewPlaceholder();
		this._htmlObject.parentNode.insertBefore(this.#placeholder, this._htmlObject.nextSibling);

		// make this._htmlObject absolute to move it around without affecting other elements
		this._htmlObject.style.position = "absolute";
		this._htmlObject.style.zIndex = "10";

		// move this._htmlObject at the end of its parent
		let parent = this._htmlObject.parentNode;
		this._htmlObject.remove();
		parent.appendChild(this._htmlObject);
	}

	/*
	 * Sets this._htmlObject at the position of this.#placeholder and removes this.#placeholder.
	 */
	setElementAtPositionOfPlaceholder() {
		// reset inline style
		this._htmlObject.style.left = "";
		this._htmlObject.style.top = "";
		this._htmlObject.style.height = "";
		this._htmlObject.style.width = "";
		this._htmlObject.style.position = "";
		this._htmlObject.style.zIndex = "";

		if (this.#placeholder) {
			// replace this.#placeholder with this._htmlObject
			this._htmlObject.remove();
			this.#placeholder.parentNode.insertBefore(this._htmlObject, this.#placeholder);
			this.#placeholder.remove();
			this.#placeholder = null;
		}
	}

	/**
	 * Creates a placeholder element with the dimensions of this._htmlObject.
	 * @returns a placeholder with the dimensions of this._htmlObject
	 */
	#getNewPlaceholder() {
		let placeholder = document.createElement("div");
		placeholder.classList.add("placeholder");
		placeholder.style.height = this.getHeight(true, true, true);
		placeholder.style.width = this.getWidth(true, true, true);

		return placeholder;
	}

	/**
	 * Returns the height of the managed HTML object, optional with padding, border and/or margin.
	 * @param {boolean} withPadding specifies if padding top and bottom should be included in calculation
	 * @param {boolean} withBorder specifies if border thickness top and bottom should be included in calculation
	 * @param {boolean} withMargin specifies if margin top and bottom should be included in calculation
	 * @returns the height of the managed HTML object
	 */
	getHeight(withPadding, withBorder, withMargin) {
		let styleEle = getComputedStyle(this._htmlObject);

		let height = parseFloat(styleEle.height);
		if (withPadding) {
			height += parseFloat(styleEle.paddingTop) + parseFloat(styleEle.paddingBottom);
		}
		if (withBorder) {
			height += parseFloat(styleEle.borderTopWidth) + parseFloat(styleEle.borderBottomWidth);
		}
		if (withMargin) {
			height += parseFloat(styleEle.marginTop) + parseFloat(styleEle.marginBottom);
		}

		return height + "px";
	}

	/**
	 * Returns the width of the managed HTML object, optional with padding, border and/or margin.
	 * @param {boolean} withPadding specifies if padding left and right should be included in calculation
	 * @param {boolean} withBorder specifies if border thickness left and right should be included in calculation
	 * @param {boolean} withMargin specifies if margin left and right should be included in calculation
	 * @returns the width of the managed HTML object
	 */
	getWidth(withPadding, withBorder, withMargin) {
		let styleEle = getComputedStyle(this._htmlObject);

		let width = parseFloat(styleEle.width);
		if (withPadding) {
			width += parseFloat(styleEle.paddingLeft) + parseFloat(styleEle.paddingRight);
		}
		if (withBorder) {
			width += parseFloat(styleEle.borderLeftWidth) + parseFloat(styleEle.borderRightWidth);
		}
		if (withMargin) {
			width += parseFloat(styleEle.marginLeft) + parseFloat(styleEle.marginRight);
		}

		return width + "px";
	}

	/**
	 * Returns the managed HTML object.
	 * @returns the managed HTML object
	 */
	getHTMLObject() {
		return this._htmlObject;
	}

	/**
	 * Removes all children from a given HTML element
	 * @param {HTMLElement} element the element from which all children should be removed
	 */
	removeAllChildren(element) {
		while (element.firstChild) {
			element.firstChild.remove();
		}
	}
}