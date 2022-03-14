/**
 * @author Ganko Pi
 */
class CategoryManager {
	#categories;

	/**
	 * Constructor for a new CategoryManager with no categories
	 */
	constructor() {
		this.#categories = [];
	}

	/**
	 * Creates a new category and adds it to the HTML page.
	 */
	createNewCategory() {
		let category = new Category(this, new Date());
		
		// add category to HTML
		document.querySelector("main").appendChild(category.getHTMLObject());

		this.addCategory(category);

		// ask the user to choose a name for the category
		category.editName();
	}

	/**
	 * Adds a category to this class at the end
	 * @param {Category} category the category to add
	 */
	addCategory(category) {
		this.#categories.push(category);
	}

	/**
	 * Adds a category to this class at a given index
	 * @param {Category} category the category to add
	 * @param {number} index the index at which the category should be added
	 */
	addCategory(category, index) {
		this.#categories.splice(index, 0, category);
	}

	/**
	 * Removes a category from this class
	 * @param {Category} category the category to remove
	 */
	removeCategory(category) {
		let index = this.#categories.indexOf(category);
		if (index != -1) {
			this.#categories.splice(index, 1);
		}
	}

	/**
	 * Moves the category to a new position
	 * @param {Category} category the category to move
	 * @param {number} index the index at which the category should be moved
	 */
	moveCategoryToIndex(category, index) {
		this.removeCategory(category);
		this.addCategory(category, index);
	}

	// TODO: comment
	save() {
		// TODO: Send this.#categories to server as JSON
	}
}