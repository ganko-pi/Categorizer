/**
 * @author Ganko Pi
 */
 class Placeholder extends Element {

	/**
	 * Constructor for a new placeholder.
	 * @param {Element} element the element to create a placeholder for
	 */
	constructor(element) {
		super(new Date());
		this._htmlObject = this.createPlaceholderInHTML(element);
	}

	/**
	 * Creates a placeholder element with the dimensions of the given element.
	 * @returns a placeholder with the dimensions of the given element.
	 */
	createPlaceholderInHTML(element) {
		let placeholder = document.createElement("div");
		placeholder.classList.add("placeholder");
		placeholder.style.height = getHeight(element.getHTMLObject(), true, true, true) + "px";
		placeholder.style.width = getWidth(element.getHTMLObject(), true, true, true) + "px";

		return placeholder;
	}
}