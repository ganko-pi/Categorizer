/**
 * @author Ganko Pi
 */
window.onload = init;

let categoryManager;

/**
 * Maps actions to the buttons for adding a category and showing the finished notes.
 * // TODO: Update description
 */
function init() {
	// add new category
	categoryManager = new CategoryManager(new Date());
	let addContainerButton = document.querySelector(".addCategoryButton");
	LockableManager.makeLockable(addContainerButton, "click", categoryManager.createNewCategory.bind(categoryManager));

	// link to finished notes
	let doneButton = document.querySelector(".doneButton");
	// TODO
	LockableManager.makeLockable(doneButton, "click", () => console.log("Done"));
}

/**
 * Determines if a given HTML object overlaps with the HTML object of a category of the category manager and returns this category.
 * @param {HTMLElement} object the HTML object to test the overlapping with a category
 * @returns a category which overlaps with the HTML object or undefined if no category overlaps
 */
function getOverlappingCategory(object) {
	return categoryManager.getOverlappingCategory(object);
}

/**
 * Returns the height of a passed HTML object, optional with padding, border and/or margin.#
 * @param {HTMLElement} element the element to retrieve the height from
 * @param {boolean} withPadding specifies if padding top and bottom should be included in calculation
 * @param {boolean} withBorder specifies if border thickness top and bottom should be included in calculation
 * @param {boolean} withMargin specifies if margin top and bottom should be included in calculation
 * @returns the height of the passed HTML object
 */
function getHeight(element, withPadding, withBorder, withMargin) {
	let styleEle = getComputedStyle(element);

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

	return height;
}

/**
 * Returns the width of a passed HTML object, optional with padding, border and/or margin.
 * @param {HTMLElement} element the element to retrieve the width from
 * @param {boolean} withPadding specifies if padding left and right should be included in calculation
 * @param {boolean} withBorder specifies if border thickness left and right should be included in calculation
 * @param {boolean} withMargin specifies if margin left and right should be included in calculation
 * @returns the width of the passed HTML object
 */
function getWidth(element, withPadding, withBorder, withMargin) {
	let styleEle = getComputedStyle(element);

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

	return width;
}

// TODO: description
function save() {
	// TODO: Send type, index and contents of changed object to server as JSON
}