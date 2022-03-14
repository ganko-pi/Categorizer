/**
 * @author Ganko Pi
 */
class Category extends Element {
	#name;
	#notesWithDueDate;
	#notesWithoutDueDate;

	/**
	 * Constructor for a new category with empty name which will be displayed at the HTML page.
	 * @param {CategoryManager} categoryManager the class which holds a reference to this category
	 * @param {Date} creationDate the date on which the category was first created
	 */
	constructor(categoryManager, creationDate) {
		super(categoryManager, creationDate);
		this._htmlObject = this.createCategoryInHTML();
		this.#name = "";
		this.#notesWithDueDate = [];
		this.#notesWithoutDueDate = [];
		this._remapKeysRef = this.remapKeys.bind(this);
	}

	/**
	 * Creates a new category with blank name.
	 * @returns the newly created category
	 */
	createCategoryInHTML() {
		// create container which contains all elements of a category
		let category = document.createElement("div");
		category.classList.add("category");
		category.classList.add("draggable");

		// create area with which the category can be moved around
		let dragArea = document.createElement("div");
		dragArea.classList.add("dragArea");
		dragArea.innerHTML = ".&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;.";
		category.appendChild(dragArea);

		// create the categoryHeader which contains the name of the category and a container for buttons edit, save and cancel
		let categoryHeader = document.createElement("div");
		categoryHeader.classList.add("categoryHeader");
		let categoryName = document.createElement("p");
		categoryName.classList.add("categoryName");
		categoryName.innerHTML = "";
		categoryHeader.appendChild(categoryName);
		let buttonsContainerCategoryHeader = document.createElement("div");
		buttonsContainerCategoryHeader.classList.add("buttonsContainerCategoryHeader");
		categoryHeader.appendChild(buttonsContainerCategoryHeader);
		category.appendChild(categoryHeader);

		// create a button to add new notes
		let addButton = document.createElement("div");
		addButton.classList.add("button");
		addButton.classList.add("addNote");
		addButton.innerHTML = "Neue Notiz";
		LockableManager.makeLockable(addButton, "click", this.createNewNote.bind(this));
		category.appendChild(addButton);

		// create a container which contains a new created note before it is saved for the first time
		let newNotesContainer = document.createElement("div");
		newNotesContainer.classList.add("newNotesContainer");
		category.appendChild(newNotesContainer);

		// create a container which contains all notes with a due date
		let notesWithDueDateContainer = document.createElement("div");
		notesWithDueDateContainer.classList.add("notesWithDueDateContainer");
		category.appendChild(notesWithDueDateContainer);

		// create a container which contains all notes without a due date
		let notesWithoutDueDateContainer = document.createElement("div");
		notesWithoutDueDateContainer.classList.add("notesWithoutDueDateContainer");
		category.appendChild(notesWithoutDueDateContainer);

		return category;
	}

	/**
	 * Makes the HTML element of the name of this category editable and locks all lockable elements.
	 */
	editName() {
		LockableManager.lockElements();

		// remove all buttons from the header of category
		let buttonsContainerCategoryHeader = this._htmlObject.querySelector(".buttonsContainerCategoryHeader");
		this.removeAllChildren(buttonsContainerCategoryHeader);
	
		// add buttons cancel and save
		let buttonCancel = document.createElement("img");
		buttonCancel.classList.add("button");
		buttonCancel.src = "img/cross.svg";
		buttonCancel.alt = "Abbrechen";
		buttonCancel.addEventListener("click", this.cancelEditName.bind(this));
		buttonsContainerCategoryHeader.appendChild(buttonCancel);
	
		let buttonSave = document.createElement("img");
		buttonSave.classList.add("button");
		buttonSave.src = "img/tick_green.svg";
		buttonSave.alt = "Speichern";
		buttonSave.addEventListener("click", this.saveName.bind(this));
		buttonsContainerCategoryHeader.appendChild(buttonSave);
	
		// remap ctrl+s and esc
		window.addEventListener("keydown", this._remapKeysRef);
	
		// make the element of name editable and focus this element
		let categoryName = this._htmlObject.querySelector(".categoryName");
		categoryName.contentEditable = true;
		categoryName.focus();
	
		// set cursor at end of text
		if (categoryName.innerHTML.length > 0) {
			window.getSelection().setBaseAndExtent(categoryName, 1, categoryName, 1)
		}
	}

	/**
	 * Stores the new name, makes the HTML element of name immutable and unlocks all lockable elements.
	 * If the name is empty and the category contains notes, the state does not change.
	 * If the name is empty and the category does not contain notes, the category will be removed.
	 */
	saveName() {
		let categoryName = this._htmlObject.querySelector(".categoryName");

		// if line breaks are at the end, remove them
		while (categoryName.innerHTML.substring(categoryName.innerHTML.length - 4) == "<br>") {
			categoryName.innerHTML = categoryName.innerHTML.substring(0, categoryName.innerHTML.length - 4);
		}

		// if name is blank and the category contains notes, saving is disallowed
		if ((categoryName.innerHTML.trim().length == 0) && ((this.#notesWithDueDate > 0) || (this.#notesWithoutDueDate > 0))) {
			return;
		}

		// if name is blank and the category does not contain notes, the category will be removed
		if (categoryName.innerHTML.trim().length == 0) {
			this._htmlObject.remove();
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeCategory(this);

			return;
		}

		this.#name = categoryName.innerHTML;

		this.#removeEditState();
	}

	/**
	 * Restores the previous name in HTML, makes the HTML element of name immutable and unlocks all lockable elements.
	 */
	cancelEditName() {
		if (this.#name == "") {
			this._htmlObject.remove();
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeCategory(this);

			return;
		}

		let categoryName = this._htmlObject.querySelector(".categoryName");
		categoryName.innerHTML = this.#name;

		this.#removeEditState();
	}

	/**
	 * Makes the HTML element of name immutable, sets edit as the only button and unlocks all lockable elements.
	 */
	#removeEditState() {
		// remove remappings
		window.removeEventListener("keydown", this._remapKeysRef);

		let categoryName = this._htmlObject.querySelector(".categoryName");
		categoryName.contentEditable = false;

		// remove all buttons from the header of category
		let buttonsContainerCategoryHeader = this._htmlObject.querySelector(".buttonsContainerCategoryHeader");
		this.removeAllChildren(buttonsContainerCategoryHeader);

		// add button to switch to edit mode
		let buttonEdit = document.createElement("img");
		buttonEdit.classList.add("button");
		buttonEdit.src = "img/pencil.svg";
		buttonEdit.alt = "Bearbeiten";
		LockableManager.makeLockable(buttonEdit, "click", this.editName);
		buttonsContainerCategoryHeader.appendChild(buttonEdit);

		LockableManager.unlockElements();
	}

	/**
	 * Creates a new note and adds it to this category.
	 */
	createNewNote() {
		let note = new Note(this, new Date());

		let newNotesContainer = this._htmlObject.querySelector(".newNotesContainer");
		newNotesContainer.appendChild(note.getHTMLObject());
		
		note.editContent();
	}

	/**
	 * Adds a note to this category.
	 * @param {Note} note a note which should be added to this category
	 */
	addNote(note) {
		// detach note from previous parent
		note.getHTMLObject().remove();

		// if note has no due date, insert it at last position
		if (!note.hasDueDate()) {
			this.#notesWithoutDueDate.push(note);

			// insert in HTML page
			let notesWithoutDueDateContainer = this._htmlObject.querySelector(".notesWithoutDueDateContainer");
			notesWithoutDueDateContainer.appendChild(note.getHTMLObject());

			return;
		}

		// if note has a due date, insert it at a position where the previous note has a smaller or equal due date and the next note a greater or none due date
		let dueDate = note.getDueDate();
		for (let i = 0; i < this.#notesWithDueDate.length; ++i) {
			let dueDateToCompare = this.#notesWithDueDate[i].getDueDate();
			if (dueDate < dueDateToCompare) {
				this.#notesWithDueDate.splice(i, 0, note);

				// insert in HTML page
				let notesWithDueDateContainer = this._htmlObject.querySelector(".notesWithDueDateContainer");
				// note was inserted at i-th position, so the element after is at i + 1
				notesWithDueDateContainer.insertBefore(note.getHTMLObject(), this.#notesWithDueDate[i + 1]);

				return;
			}
		}

		// if due date of given note is greater than all other due dates, insert at the end
		this.#notesWithDueDate.push(note);

		// insert in HTML page
		let notesWithDueDateContainer = this._htmlObject.querySelector(".notesWithDueDateContainer");
		notesWithDueDateContainer.appendChild(note.getHTMLObject());
	}

	/**
	 * Sets a new name for this category.
	 * @param {string} name the new name
	 */
	setName(name) {
		this.#name = name;
	}

	/**
	 * Returns the name of this category.
	 * @returns the current name
	 */
	getName() {
		return this.#name;
	}

	/**
	 * Removes a note from this class
	 * @param {Note} note the note to remove
	 */
	removeNote(note) {
		let index = this.#notesWithDueDate.indexOf(note);
		if (index != -1) {
			this.#notesWithDueDate.splice(index, 1);
			return;
		}

		index = this.#notesWithoutDueDate.indexOf(note);
		if (index != -1) {
			this.#notesWithoutDueDate.splice(index, 1);
		}
	}

	/**
	 * Remaps Ctrl+S to save a new container name and Escape to cancel the action of renaming and keep the previous name.
	 * @param {Event} event the event which caused the call of this method
	 */
	remapKeys(event) {
		// remap Ctrl+S to save a new container name
		if (event.key === "s" && event.ctrlKey) {
			this.saveName();
			event.preventDefault();
			return;
		}

		// remap Escape to cancel the action of renaming and keep the previous name
		if (event.key === "Escape") {
			this.cancelEditName();
			event.preventDefault();
			return;
		}
	}
}