/**
 * @author Ganko Pi
 */
class CategoryManager extends Container {

	/**
	 * Constructor for a new CategoryManager.
	 * @param {Date} creationDate the date on which the CategoryManager was first created
	 */
	constructor(creationDate) {
		super(creationDate);
		this._htmlObject = document.querySelector("main");
	}

	/**
	 * Creates a new category and adds it to the HTML page.
	 */
	createNewCategory() {
		let category = new Category(new Date(), this);

		this.addChild(category);

		// ask the user to choose a name for the category
		category.editName();
	}

	/**
	 * Determines if a given HTML object overlaps with the HTML object of a category of this manager and returns this category.
	 * @param {HTMLElement} object the HTML object to test the overlapping with a category
	 * @returns a category which overlaps with the HTML object or undefined if no category overlaps
	 */
	getOverlappingCategory(object) {
		return this._elements.find((category) => {
			return (object != category.getHTMLObject())
				&& !(category instanceof Placeholder)
				&& category.doesOverlap(object);
		});
	}
}