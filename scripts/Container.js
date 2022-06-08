/**
 * @author Ganko Pi
 */
class Container extends Element {
	_elements;

	/**
	 * Constructor for a container element which manages a HTML object with a custom date of creation which contains other elements.
	 * @param {string} creationDate the date on which the element was first created
	 */
	constructor(creationDate) {
		super(creationDate);
		this._elements = [];
	}

	/**
	 * Adds an element at the end of this class and of HTML.
	 * @param {Element} element the element to add
	 */
	addChild(element) {
		// add element to HTML
		this._htmlObject.appendChild(element.getHTMLObject());

		this._elements.push(element);
	}

	/**
	 * Adds an element to this class and to HTML at a given index.
	 * @param {Element} element the element to add
	 * @param {number} index the index at which the element should be added
	 */
	addChild(element, index) {
		if (!this.#isValidIndex(index)) {
			return;
		}

		this.#addChildToHTML(element, index);
		this._elements.splice(index, 0, element);
	}

	/**
	 * Removes an element from this class and from HTML.
	 * @param {Element} element the element to remove
	 */
	removeChild(element) {
		let index = this._elements.indexOf(element);
		if (index != -1) {
			this._elements.splice(index, 1);

			element.getHTMLObject().remove();
		}
	}

	/**
	 * Moves the given element to a new position in this class and in HTML.
	 * @param {Element} element the element to move
	 * @param {number} index the index at which the element should be moved
	 */
	moveChildToIndex(element, index) {
		this.removeChild(element);
		this.addChild(element, index);
	}

	/**
	 * Tests if element1 is before element2.
	 * @param {Element} element1 the first element
	 * @param {Element} element2 the second element
	 * @returns true if element1 is before element2, false otherwise
	 */
	isChildBeforeOtherChild(element1, element2) {
		let index1 = this._elements.indexOf(element1);
		let index2 = this._elements.indexOf(element2);
		if (index1 == -1 || index2 == -1) {
			return false;
		}

		return index1 < index2;
	}

	/**
	 * Moves an element to a position before another element.
	 * @param {Element} elementToMove the element to move to a new position
	 * @param {Element} elementFixed the element indicating the new position
	 */
	moveChildBeforeOtherChild(elementToMove, elementFixed) {
		this.removeChild(elementToMove);

		let index = this._elements.indexOf(elementFixed);
		if (index == -1) {
			return;
		}

		this.addChild(elementToMove, index);
	}

	/**
	 * Moves an element to a position after another element.
	 * @param {Element} elementToMove the element to move to a new position
	 * @param {Element} elementFixed the element indicating the new position
	 */
	moveChildAfterOtherChild(elementToMove, elementFixed) {
		this.removeChild(elementToMove);

		let index = this._elements.indexOf(elementFixed);
		if (index == -1) {
			return;
		}

		this.addChild(elementToMove, index + 1);
	}

	/**
	 * Sets a placeholder at the position of a given element.
	 * @param {Element} element the element to replace with a placeholder
	 * @param {Placeholder} placeholder the placeholder to replace the element
	 */
	replaceElementWithPlaceholder(element, placeholder) {
		let index = this._elements.indexOf(element);
		if (index == -1) {
			return;
		}

		this.addChild(placeholder, index);

		// move element to last position
		this.moveChildToIndex(element, this._elements.length - 1);
	}

	/**
	 * Sets an element at the position of the given placeholder.
	 * @param {Element} element the element to set at position of the placeholder
	 * @param {Placeholder} placeholder the placeholder to replace with the element
	 */
	setElementAtPositionOfPlaceholder(element, placeholder) {
		let index = this._elements.indexOf(placeholder);
		if (index == -1) {
			return;
		}

		this.moveChildToIndex(element, index);

		this.removeChild(placeholder);
	}

	/**
	 * Tests if an index has a valid value.
	 * @param {number} index the index to test
	 * @returns true if index is valid false otherwise
	 */
	#isValidIndex(index) {
		if (index < 0) {
			return false;
		}

		if (index > this._elements.length) {
			return false;
		}

		return true;
	}

	/**
	 * Inserts the HTML object of a given element at the specified position in the HTML page.
	 * @param {Element} element the element with the HTML object to insert
	 * @param {number} index the position where the element should be inserted
	 */
	#addChildToHTML(element, index) {
		// add element to HTML at index
		if (index < this._elements.length) {
			let elementAfter = this._elements[index];
			this._htmlObject.insertBefore(element.getHTMLObject(), elementAfter.getHTMLObject());
		} else {
			this._htmlObject.appendChild(element.getHTMLObject());
		}
	}
}