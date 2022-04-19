/**
 * @author Ganko Pi
 */
class Element {
	#creationDate;
	_htmlObject;
	_placeholder;
	_remapKeysRef;
	_container;

	#relativeMouseOffsetX;
	#relativeMouseOffsetY;
	#dragRef;
	#endDraggingRef;

	/**
	 * Constructor for an element which manages a HTML object with a custom date of creation.
	 * @param {string} creationDate the date on which the element was first created
	 */
	constructor(creationDate) {
		this.#creationDate = creationDate;
		this._htmlObject = null;
		this._placeholder = null;
		this._remapKeysRef = null;
		this._container = null;

		this.#relativeMouseOffsetX = 0;
		this.#relativeMouseOffsetY = 0;
		this.#dragRef = this.drag.bind(this);
		this.#endDraggingRef = this.endDragging.bind(this);
	}

	/**
	 * Makes this element follow the cursor in the HTML page if a dragArea of this element is held.
	 */
	makeDraggable() {
		let dragAreas = this._htmlObject.querySelectorAll(".dragArea");
		dragAreas.forEach((dragArea) => LockableManager.makeLockable(dragArea, "mousedown", this.initDraggable.bind(this)));
	}

	/**
	 * Changes the state of this element that it can be moved in the HTML page and replaces the previous position with a placeholder.
	 * @param {Event} event the event which caused the call of this method
	 */
	initDraggable(event) {
		// needed if no event is passed
		event = event || window.event;
		event.preventDefault();

		this.#relativeMouseOffsetX = event.pageX - this._htmlObject.getBoundingClientRect().left;
		this.#relativeMouseOffsetY = event.pageY - this._htmlObject.getBoundingClientRect().top;

		LockableManager.lockElements();

		this.makeElementAbsoluteAndSetPlaceholder();

		document.addEventListener("mousemove", this.#dragRef);
		document.addEventListener("mouseup", this.#endDraggingRef);
	}

	/**
	 * Updates the position of this element and changes the position of the placeholder if needed.
	 * @param {Event} event the event which caused the call of this method
	 */
	drag(event) {
		// needed if no event is passed
		event = event || window.event;
		event.preventDefault();

		// set position of object dependent to mouse position
		this._htmlObject.style.left = (event.pageX - this.#relativeMouseOffsetX) + "px";
		this._htmlObject.style.top = (event.pageY - this.#relativeMouseOffsetY) + "px";

		let category = getOverlappingCategory(this._htmlObject);
		// end early if the object does not overlap with a category
		if (!category) {
			return;
		}
		
		this.movePlaceholder(category);
	}

	/**
	 * Sets this element at the position of the placeholder and ends the ability to move.
	 */
	endDragging() {
		document.removeEventListener("mousemove", this.#dragRef);
		document.removeEventListener("mouseup", this.#endDraggingRef);

		this.resetElementAndSetAtPositionOfPlaceholder();

		LockableManager.unlockElements();
	}

	/**
	 * Sets a placeholder at the position of this._htmlObject and makes this._htmlObject absolute so it can be moved around without affecting other elements.
	 */
	makeElementAbsoluteAndSetPlaceholder() {
		// get position on screen
		this._htmlObject.style.left = this._htmlObject.getBoundingClientRect().left + "px";
		this._htmlObject.style.top = this._htmlObject.getBoundingClientRect().top + "px";

		// get current dimensions
		// TODO correct height and width for note
		this._htmlObject.style.height = getHeight(this._htmlObject, false, false, false) + "px";
		this._htmlObject.style.width = getWidth(this._htmlObject, false, false, false) + "px";

		// replace this._htmlObject with a placeholder
		this._placeholder = new Placeholder(this);
		this._container.replaceElementWithPlaceholder(this, this._placeholder);

		// make this._htmlObject absolute to move it around without affecting other elements
		this._htmlObject.style.position = "absolute";
		this._htmlObject.style.zIndex = "10";
	}

	/*
	 * Sets this._htmlObject at the position of this._placeholder and removes this._placeholder.
	 */
	resetElementAndSetAtPositionOfPlaceholder() {
		// reset inline style
		this._htmlObject.style.left = "";
		this._htmlObject.style.top = "";
		this._htmlObject.style.height = "";
		this._htmlObject.style.width = "";
		this._htmlObject.style.position = "";
		this._htmlObject.style.zIndex = "";

		if (this._placeholder) {
			this._container.setElementAtPositionOfPlaceholder(this, this._placeholder);
			this._placeholder = null;
		}
	}

	/**
	 * Moves the placeholder for this element.
	 * @param {Category} overlappedCategory the category which overlaps with this element
	 */
	movePlaceholder(overlappedCategory) {
		throw new Error("Method must be overridden.");
	}

	/**
	 * Tests if the midpoint of a given HTML object is in the bounding box of the HTML object of this element.
	 * @param {HTMLElement} object the HTML object which midpoint is tested
	 * @returns if the given HTML object overlaps with this element
	 */
	doesOverlap(object) {
		// calculate midpoint of the passed object
		let midpointObjectX = object.getBoundingClientRect().left + (getWidth(object, false, false, false) / 2);
		let midpointObjectY = object.getBoundingClientRect().top + (getHeight(object, false, false, false) / 2);

		// calculate positions of the borders of this element
		let leftBorderThis = this._htmlObject.getBoundingClientRect().left;
		let rightBorderThis = leftBorderThis + getWidth(this._htmlObject, true, true, false);
		let topBorderThis = this._htmlObject.getBoundingClientRect().top;
		let bottomBorderThis = topBorderThis + getHeight(this._htmlObject, true, true, false);

		// return if midpoint lies in between the borders
		return (midpointObjectX > leftBorderThis && midpointObjectX < rightBorderThis &&
				midpointObjectY > topBorderThis  && midpointObjectY < bottomBorderThis)
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

	/**
	 * Returns the managed HTML object.
	 * @returns the managed HTML object
	 */
	getHTMLObject() {
		return this._htmlObject;
	}
}