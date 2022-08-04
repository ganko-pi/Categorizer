import { Element } from "./Element.js";
import { Placeholder } from "./Placeholder.js";

/**
 * @author Ganko Pi
 */
export abstract class Container extends Element {
	protected elements: Element[];

	/**
	 * Constructor for a container element which manages a HTML object with a custom date of creation which contains other elements.
	 * @param {Date} creationDate the date on which the element was first created
	 */
	constructor(creationDate: Date) {
		super(creationDate);
		this.elements = [];
	}

	/**
	 * Adds an element at the end of this class and of HTML.
	 * @param {Element} element the element to add
	 */
	addChild(element: Element): void {
		// add element to HTML
		this.htmlObject.appendChild(element.getHTMLObject());

		this.elements.push(element);
	}

	/**
	 * Adds an element to this class and to HTML at a given index.
	 * @param {Element} element the element to add
	 * @param {number} index the index at which the element should be added
	 */
	addChildAtIndex(element: Element, index: number): void {
		if (!this.isValidIndex(index)) {
			return;
		}

		this.addChildToHTML(element, index);
		this.elements.splice(index, 0, element);
	}

	/**
	 * Removes an element from this class and from HTML.
	 * @param {Element} element the element to remove
	 */
	removeChild(element: Element): void {
		let index: number = this.elements.indexOf(element);
		if (index != -1) {
			this.elements.splice(index, 1);

			element.getHTMLObject().remove();
		}
	}

	/**
	 * Moves the given element to a new position in this class and in HTML.
	 * @param {Element} element the element to move
	 * @param {number} index the index at which the element should be moved
	 */
	moveChildToIndex(element: Element, index: number): void {
		this.removeChild(element);
		this.addChildAtIndex(element, index);
	}

	/**
	 * Tests if element1 is before element2.
	 * @param {Element} element1 the first element
	 * @param {Element} element2 the second element
	 * @returns true if element1 is before element2, false otherwise
	 */
	isChildBeforeOtherChild(element1: Element, element2: Element): boolean {
		let index1: number = this.elements.indexOf(element1);
		let index2: number = this.elements.indexOf(element2);
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
	moveChildBeforeOtherChild(elementToMove: Element, elementFixed: Element): void {
		this.removeChild(elementToMove);

		let index: number = this.elements.indexOf(elementFixed);
		if (index == -1) {
			return;
		}

		this.addChildAtIndex(elementToMove, index);
	}

	/**
	 * Moves an element to a position after another element.
	 * @param {Element} elementToMove the element to move to a new position
	 * @param {Element} elementFixed the element indicating the new position
	 */
	moveChildAfterOtherChild(elementToMove: Element, elementFixed: Element): void {
		this.removeChild(elementToMove);

		let index: number = this.elements.indexOf(elementFixed);
		if (index == -1) {
			return;
		}

		this.addChildAtIndex(elementToMove, index + 1);
	}

	/**
	 * Sets a placeholder at the position of a given element.
	 * @param {Element} element the element to replace with a placeholder
	 * @param {Placeholder} placeholder the placeholder to replace the element
	 */
	replaceElementWithPlaceholder(element: Element, placeholder: Placeholder): void {
		let index: number = this.elements.indexOf(element);
		if (index == -1) {
			return;
		}

		this.addChildAtIndex(placeholder, index);

		// move element to last position
		this.moveChildToIndex(element, this.elements.length - 1);
	}

	/**
	 * Sets an element at the position of the given placeholder.
	 * @param {Element} element the element to set at position of the placeholder
	 * @param {Placeholder} placeholder the placeholder to replace with the element
	 */
	setElementAtPositionOfPlaceholder(element: Element, placeholder: Placeholder): void {
		let index: number = this.elements.indexOf(placeholder);
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
	private isValidIndex(index: number): boolean {
		if (index < 0) {
			return false;
		}

		if (index > this.elements.length) {
			return false;
		}

		return true;
	}

	/**
	 * Inserts the HTML object of a given element at the specified position in the HTML page.
	 * @param {Element} element the element with the HTML object to insert
	 * @param {number} index the position where the element should be inserted
	 */
	private addChildToHTML(element: Element, index: number): void {
		// add element to HTML at index
		if (index < this.elements.length) {
			let elementAfter: Element = this.elements[index];
			this.htmlObject.insertBefore(element.getHTMLObject(), elementAfter.getHTMLObject());
		} else {
			this.htmlObject.appendChild(element.getHTMLObject());
		}
	}
}
