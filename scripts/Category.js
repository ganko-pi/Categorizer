/**
 * @author Ganko Pi
 */
class Category extends Container {
	#name;
	#newNotes;
	#notesWithDueDate;
	#notesWithoutDueDate;
	#notesWithPlaceholder;

	/**
	 * Constructor for a new category with empty name which will be displayed in the HTML page.
	 * @param {Date} creationDate the date on which the category was first created
	 * @param {CategoryManager} categoryManager the CategoryManager managing this category
	 */
	constructor(creationDate, categoryManager) {
		super(creationDate);
		this._htmlObject = this.createCategoryInHTML();
		this._container = categoryManager;
		this.#name = "";
		this.#newNotes = [];
		this.#notesWithDueDate = [];
		this.#notesWithoutDueDate = [];
		this.#notesWithPlaceholder = [];
		this._remapKeysRef = this.remapKeys.bind(this);

		this.makeDraggable();
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

		// create a container for a note that has currently a placeholder
		let notesWithPlaceholder = document.createElement("div");
		notesWithPlaceholder.classList.add("notesWithPlaceholderContainer");
		category.appendChild(notesWithPlaceholder);

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
		if ((categoryName.innerHTML.trim().length == 0) && ((this.#notesWithDueDate.length > 0) || (this.#notesWithoutDueDate.length > 0))) {
			alert("Kategoriename darf nicht leer sein, wenn die Kategorie Notizen enthält.")
			return;
		}

		// if name is blank and the category does not contain notes, the category will be removed
		if (categoryName.innerHTML.trim().length == 0) {
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeChild(this);

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
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeChild(this);

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
		LockableManager.makeLockable(buttonEdit, "click", this.editName.bind(this));
		buttonsContainerCategoryHeader.appendChild(buttonEdit);

		LockableManager.unlockElements();
	}

	/**
	 * Creates a new note and adds it to this category.
	 */
	createNewNote() {
		let note = new Note(new Date(), this, null);

		this.#newNotes.push(note);
		let newNotesContainer = this.#getHTMLElementContainer(this.#newNotes);
		newNotesContainer.appendChild(note.getHTMLObject());
		
		note.editContent();
	}

	/**
	 * Adds a note to this category.
	 * @param {Note} note a note which should be added to this category
	 */
	addChild(note) {
		// if note has no due date, insert it at last position
		if (!note.hasDueDate()) {
			this.addElementWithoutDueDate(note);

			return;
		}

		this.addElementWithDueDate(note, note.getDueDate());
	}

	/**
	 * Removes an element from this class
	 * @param {Element} element the element to remove
	 */
	removeChild(element) {
		let index = this.#newNotes.indexOf(element);
		if (index != -1) {
			this.#newNotes.splice(index, 1);

			element.getHTMLObject().remove();
			return;
		}

		index = this.#notesWithDueDate.indexOf(element);
		if (index != -1) {
			this.#notesWithDueDate.splice(index, 1);

			element.getHTMLObject().remove();
			return;
		}

		index = this.#notesWithoutDueDate.indexOf(element);
		if (index != -1) {
			this.#notesWithoutDueDate.splice(index, 1);

			element.getHTMLObject().remove();
			return;
		}

		index = this.#notesWithPlaceholder.indexOf(element);
		if (index != -1) {
			this.#notesWithPlaceholder.splice(index, 1);

			element.getHTMLObject().remove();
		}
	}

	/**
	 * Adds an element to this category. The position is determined by the given due date.
	 * @param {Element} element the element to add in the container for elements with due date
	 * @param {Date} dueDate the due date to determine the position of element
	 */
	addElementWithDueDate(element, dueDate) {
		// insert element at a position where the previous one has a smaller or equal due date and the next one a greater or none due date
		let notesWithDueDateContainer = this.#getHTMLElementContainer(this.#notesWithDueDate);

		for (let i = 0; i < this.#notesWithDueDate.length; ++i) {
			let dueDateToCompare = this.#notesWithDueDate[i].getDueDate();
			if (dueDate < dueDateToCompare) {
				this.#notesWithDueDate.splice(i, 0, element);

				// insert in HTML page
				// note was inserted at i-th position, so the element after is at i + 1
				notesWithDueDateContainer.insertBefore(element.getHTMLObject(), this.#notesWithDueDate[i + 1].getHTMLObject());

				return;
			}
		}

		// if due date of given note is greater than all other due dates, insert at the end
		this.#notesWithDueDate.push(element);

		// insert in HTML page
		notesWithDueDateContainer.appendChild(element.getHTMLObject());
	}

	/**
	 * Adds an element to this category at the last position.
	 * @param {Element} element the element to add in the container for elements without due date
	 */
	addElementWithoutDueDate(element) {
		this.addElementWithoutDueDate(element, this.#notesWithoutDueDate.length);
	}

	/**
	 * Adds an element to this category at the specified position.
	 * @param {Element} element the element to add in the container for elements without due date
	 * @param {number} index the position the element should be inserted
	 */
	addElementWithoutDueDate(element, index) {
		this.#notesWithoutDueDate.splice(index, 0, element);

		// insert in HTML page
		let notesWithoutDueDateContainer = this.#getHTMLElementContainer(this.#notesWithoutDueDate);

		if (index < (this.#notesWithoutDueDate.length - 1)) {
			// note was inserted at i-th position, so the element after is at i + 1
			notesWithoutDueDateContainer.insertBefore(element.getHTMLObject(), this.#notesWithoutDueDate[i + 1].getHTMLObject());
			return;
		}

		notesWithoutDueDateContainer.appendChild(element.getHTMLObject());
	}

	/**
	 * Adds an element to a container which stores elements which are currently replaced by a placeholder.
	 * @param {Element} element the element to add to the container
	 */
	addNoteWithPlaceholder(element) {
		this.#notesWithPlaceholder.push(element);
		let notesWithPlaceholder = this.#getHTMLElementContainer(this.#notesWithPlaceholder);
		notesWithPlaceholder.appendChild(element.getHTMLObject());
	}

	/**
	 * Tests if element1 is before element2.
	 * @param {Element} element1 the first element
	 * @param {Element} element2 the second element
	 * @returns true if element1 is before element2, false otherwise
	 */
	isChildBeforeOtherChild(element1, element2) {
		let container = this.#notesWithDueDate;
		if (container.indexOf(element1) == -1) {
			container = this.#notesWithoutDueDate;
		}

		let index1 = container.indexOf(element1);
		let index2 = container.indexOf(element2);
		if (index1 == -1 || index2 == -1) {
			return false;
		}

		return index1 < index2;
	}

	/**
	 * Inserts an element before another element of this category.
	 * @param {Element} element the element to insert
	 * @param {Element} child an element of this category before which the new element should be inserted
	 */
	insertElementBeforeChild(element, child) {
		let container = this.#getContainer(child);
		if (!container) {
			return;
		}
		
		let index = container.indexOf(child);

		container.splice(index, 0, element);

		let htmlObjectContainer = this.#getHTMLElementContainer(container);
		htmlObjectContainer.insertBefore(element.getHTMLObject(), child.getHTMLObject());
	}

	/**
	 * Inserts an element after another element of this category.
	 * @param {Element} element the element to insert
	 * @param {Element} child an element of this category after which the new element should be inserted
	 */
	insertElementAfterChild(element, child) {
		let container = this.#getContainer(child);
		if (!container) {
			return;
		}

		let index = container.indexOf(child);

		container.splice(index + 1, 0, element);

		let htmlObjectContainer = this.#getHTMLElementContainer(container);
		htmlObjectContainer.insertBefore(element.getHTMLObject(), child.getHTMLObject().nextSibling);
	}

	/**
	 * Sets a placeholder at the position of a given element.
	 * @param {Element} element the element to replace with a placeholder
	 * @param {Placeholder} placeholder the placeholder to replace the element
	 */
	replaceElementWithPlaceholder(element, placeholder) {
		let container = this.#getContainer(element);
		if (!container) {
			return;
		}

		this.insertElementBeforeChild(placeholder, element);
		this.removeChild(element);
		
		this.addNoteWithPlaceholder(element);
	}

	/**
	 * Sets an element at the position of the given placeholder.
	 * @param {Element} element the element to set at position of the placeholder
	 * @param {Placeholder} placeholder the placeholder to replace with the element
	 */
	setElementAtPositionOfPlaceholder(element, placeholder) {
		this.removeChild(element);

		this.insertElementBeforeChild(element, placeholder);

		this.removeChild(placeholder);
	}

	/**
	 * Moves the placeholder for this category at the position of the overlapped category.
	 * @param {Category} overlappedCategory the category which overlaps with this category
	 */
	movePlaceholder(overlappedCategory) {
		if (this._container.isChildBeforeOtherChild(this._placeholder, overlappedCategory)) {
			this._container.moveChildAfterOtherChild(this._placeholder, overlappedCategory);
		} else {
			this._container.moveChildBeforeOtherChild(this._placeholder, overlappedCategory);
		}
	}

	/**
	 * Determines if a given HTML object overlaps with the HTML object of a note of this category and returns this note.
	 * @param {HTMLElement} object the HTML object to test the overlapping with a note
	 * @returns a note which overlaps with the HTML object or undefined if no note overlaps
	 */
	getOverlappingNote(object) {
		// first try to find in this.#notesWithDueDate
		let result = this.#notesWithDueDate.find((note) => {
			return (object != note.getHTMLObject())
				&& !(note instanceof Placeholder)
				&& note.doesOverlap(object);
		});

		if (result) {
			return result;
		}

		// try to find in this.#notesWithoutDueDate
		return this.#notesWithoutDueDate.find((note) => {
			return (object != note.getHTMLObject())
				&& !(note instanceof Placeholder)
				&& note.doesOverlap(object);
		});
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

	/**
	 * Returns the container in which a given element is located.
	 * @param {Element} element the element to find the container for
	 * @returns the container of the element or undefined if the element is not part of this category
	 */
	#getContainer(element) {
		let container = this.#notesWithDueDate;
		let index = container.indexOf(element);
		
		// if element is not part of this.#notesWithDueDate, look for it in this.#notesWithoutDueDate
		if (index == -1) {
			container = this.#notesWithoutDueDate;
			index = container.indexOf(element);
		}

		// if element is not part of any containers, return undefined
		if (index == -1) {
			return undefined;
		}

		return container;
	}

	/**
	 * Returns the HTML element for a given container.
	 * @param {array} container the container to retrieve the HTML element for
	 * @returns the HTML element which represents the container in the HTML page or undefined if the container does not have a representation in HTML
	 */
	#getHTMLElementContainer(container) {
		switch (container) {
			case this.#newNotes:
				return this._htmlObject.querySelector(".newNotesContainer");
			case this.#notesWithDueDate:
				return this._htmlObject.querySelector(".notesWithDueDateContainer");
			case this.#notesWithoutDueDate:
				return this._htmlObject.querySelector(".notesWithoutDueDateContainer");
			case this.#notesWithPlaceholder:
				return this._htmlObject.querySelector(".notesWithPlaceholderContainer");
			default:
				return undefined;
		}
	}

	/**
	 * Returns the name of this category.
	 * @returns the current name
	 */
	getName() {
		return this.#name;
	}

	/**
	 * Sets a new name for this category.
	 * @param {string} name the new name
	 */
	setName(name) {
		this.#name = name;
	}
}