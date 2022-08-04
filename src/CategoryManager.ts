import { Category } from "./Category.js";
import { Container } from "./Container.js";
import { Placeholder } from "./Placeholder.js";

/**
 * @author Ganko Pi
 */
export class CategoryManager extends Container {

	/**
	 * Constructor for a new CategoryManager.
	 * @param {Date} creationDate the date on which the CategoryManager was first created
	 */
	constructor(creationDate: Date) {
		super(creationDate);
		this.htmlObject = document.querySelector("main");
	}

	/**
	 * Creates a new category and adds it to the HTML page.
	 */
	createNewCategory(): void {
		let category: Category = new Category(new Date(), this);

		this.addChild(category);

		// ask the user to choose a name for the category
		category.editName();
	}

	/**
	 * Determines if a given HTML object overlaps with the HTML object of a category of this manager and returns this category.
	 * @param {HTMLElement} object the HTML object to test the overlapping with a category
	 * @returns a category which overlaps with the HTML object or undefined if no category overlaps
	 */
	getOverlappingCategory(object: HTMLElement): Category {
		return this.elements.find((category: Category) => {
			return (object != category.getHTMLObject())
				&& !(category instanceof Placeholder)
				&& category.doesOverlap(object);
		}) as Category;
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
