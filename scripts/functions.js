/**
 * @author Ganko Pi
 */
window.onload = init;

/**
 * Maps actions to the buttons for adding a category and showing the finished notes.
 * // TODO: Update description
 */
function init() {
	let categoryManager = new CategoryManager();

	// add new category
	let addContainerButton = document.querySelector(".addCategoryButton");
	LockableManager.makeLockable(addContainerButton, "click", categoryManager.createNewCategory.bind(categoryManager));

	// link to finished notes
	let doneButton = document.querySelector(".doneButton");
	// TODO
	LockableManager.makeLockable(doneButton, "click", () => console.log("Done"));
}