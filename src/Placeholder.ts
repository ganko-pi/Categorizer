import { Category } from "./Category.js";
import { Element } from "./Element.js";
import { getHeight, getWidth } from "./functions.js";

/**
 * @author Ganko Pi
 */
 export class Placeholder extends Element {

	/**
	 * Constructor for a new placeholder.
	 * @param {Element} element the element to create a placeholder for
	 */
	constructor(element: Element) {
		super(new Date());
		this.htmlObject = this.createPlaceholderInHTML(element);
	}

	/**
	 * Creates a placeholder element with the dimensions of the given element.
	 * @param {Element} element the element to be replaced
	 * @returns a placeholder with the dimensions of the given element.
	 */
	createPlaceholderInHTML(element: Element): HTMLElement {
		let placeholder: HTMLElement = document.createElement("div");
		placeholder.classList.add("placeholder");
		placeholder.style.height = getHeight(element.getHTMLObject(), true, true, true) + "px";
		placeholder.style.width = getWidth(element.getHTMLObject(), true, true, true) + "px";

		return placeholder;
	}

	/**
	 * NOT IMPLEMENTED FOR THIS CLASS!
	 * 
	 * Moves the placeholder for this element.
	 * @param {Category} overlappedCategory the category which overlaps with this element
	 */
	 movePlaceholder(overlappedCategory: Category): void {
		throw new Error("Not implemented");
	}
}
