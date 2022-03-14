/**
 * @author Ganko Pi
 */
class Note extends Element {
	#content;
	#dueDate;
	#doneDate;

	/**
	 * Constructor for a new note without content and due date which will be displayed at the HTML page.
	 * @param {Category} category the category which contains this note
	 * @param {Date} creationDate the date on which the category was first created
	 */
	constructor(category, creationDate) {
		super(category, creationDate);
		this._htmlObject = this.createNoteInHTML();
		this.#content = "";
		this.#dueDate = null;
		this.#doneDate = null;
		this._remapKeysRef = this.remapKeys.bind(this);
	}

	/**
	 * Creates a new note without content and due date.
	 * @returns the newly created note
	 */
	createNoteInHTML() {
		// create container which contains all elements of a note
		let note = document.createElement("div");
		note.classList.add("note");
		note.classList.add("draggable");

		// create area with which the note can be moved around
		let dragArea = document.createElement("div");
		dragArea.classList.add("dragArea");
		dragArea.innerHTML = ".&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;.";
		note.appendChild(dragArea);

		// create a container for buttons edit, done, save and cancel
		let buttonsContainerNote = document.createElement("div");
		buttonsContainerNote.classList.add("buttonsContainerNote");
		note.appendChild(buttonsContainerNote);

		// create a divider to seperate the dragArea and the buttons from the content and the due date
		let divider = document.createElement("hr");
		note.appendChild(divider);

		// create a area to display the content
		let textArea = document.createElement("p");
		textArea.classList.add("textArea");
		note.appendChild(textArea);

		// create an input to set the due date and make it immutable
		let dueDate = document.createElement("div");
		dueDate.classList.add("dueDate");
		dueDate.classList.add("noDueDate");
		dueDate.innerHTML = "F&auml;llig am: ";
		let dueDatePicker = document.createElement("input");
		dueDatePicker.type = "date";
		dueDatePicker.classList.add("dueDatePicker");
		dueDatePicker.disabled = true;
		dueDate.appendChild(dueDatePicker);
		note.appendChild(dueDate);

		// TODO: makeDraggable(note);

		return note;
	}

	/**
	 * Makes the HTML element of the content of this note editable and locks all lockable elements.
	 */
	editContent() {	
		LockableManager.lockElements();
	
		// remove all buttons from the note
		let buttonsContainerNote = this._htmlObject.querySelector(".buttonsContainerNote");
		this.removeAllChildren(buttonsContainerNote);
	
		// add buttons cancel and save
		let buttonCancel = document.createElement("img");
		buttonCancel.classList.add("button");
		buttonCancel.src = "img/cross.svg";
		buttonCancel.alt = "Abbrechen";
		buttonCancel.addEventListener("click", this.cancelEditContent.bind(this));
		buttonsContainerNote.appendChild(buttonCancel);
	
		let buttonSave = document.createElement("img");
		buttonSave.classList.add("button");
		buttonSave.src = "img/tick_green.svg";
		buttonSave.alt = "Speichern";
		buttonSave.addEventListener("click", this.saveContent.bind(this));
		buttonsContainerNote.appendChild(buttonSave);
	
		let dueDate = this._htmlObject.querySelector(".dueDate");
		if (dueDate.classList.contains("noDueDate")) {
			dueDate.classList.remove("noDueDate");
		}

		let dueDatePicker = dueDate.querySelector(".dueDatePicker");
		dueDatePicker.disabled = false;
	
		// remap ctrl+s and esc
		window.addEventListener("keydown", this._remapKeysRef);
	
		let textArea = this._htmlObject.querySelector(".textArea");
		textArea.contentEditable = true;
		textArea.focus();
	
		// set cursor at end of text
		if (textArea.innerHTML.length > 0) {
			window.getSelection().setBaseAndExtent(textArea, 1, textArea, 1)
		}
	}

	/**
	 * Stores the new content and due date, makes the HTML elements of content and due date immutable and unlocks all lockable elements.
	 * If the note does not contain any content, the note will be removed.
	 */
	saveContent() {	
		let textArea = this._htmlObject.querySelector(".textArea");

		// if line breaks are at the end, remove them
		while (textArea.innerHTML.substring(textArea.innerHTML.length - 4) == "<br>") {
			textArea.innerHTML = textArea.innerHTML.substring(0, textArea.innerHTML.length - 4);
		}

		// if the note does not contain any content, remove the note
		if (textArea.innerHTML.trim().length == 0) {
			this._htmlObject.remove();
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeNote(this);

			return;
		}

		this.#content = textArea.innerHTML;

		// insert at new position if the due date has changed
		let dueDatePicker = this._htmlObject.querySelector(".dueDatePicker");
		if (this.#dueDate != dueDatePicker.value) {
			this.#dueDate = dueDatePicker.value;
			this._container.addNote(this);
		}

		this.#removeEditState();
	}

	/**
	 * Restores the previous content and the previous due date in HTML, makes the HTML elements of content and due date immutable and unlocks all lockable elements.
	 */
	cancelEditContent() {
		if (this.#content == "") {
			this._htmlObject.remove();
			// remove remappings
			window.removeEventListener("keydown", this._remapKeysRef);
			LockableManager.unlockElements();

			this._container.removeNote(this);

			return;
		}

		let textArea = this._htmlObject.querySelector(".textArea");
		textArea.innerHTML = this.#content;

		let dueDatePicker = this._htmlObject.querySelector(".dueDatePicker");
		dueDatePicker.value = this.#dueDate;

		this.#removeEditState();
	}

	/**
	 * Makes the HTML elements of content and due date immutable, sets edit and done as the only buttons and unlocks all lockable elements.
	 */
	#removeEditState() {
		// remove remappings
		window.removeEventListener("keydown", this._remapKeysRef);

		let textArea = this._htmlObject.querySelector(".textArea");
		textArea.contentEditable = false;

		let dueDatePicker = this._htmlObject.querySelector(".dueDatePicker");
		dueDatePicker.disabled = true;

		// remove all buttons from the note
		let buttonsContainerNote = this._htmlObject.querySelector(".buttonsContainerNote");
		this.removeAllChildren(buttonsContainerNote);

		// add buttons to switch to edit mode or to set the state to done
		let buttonEdit = document.createElement("img");
		buttonEdit.classList.add("button");
		buttonEdit.src = "img/pencil.svg";
		buttonEdit.alt = "Bearbeiten";
		LockableManager.makeLockable(buttonEdit, "click", this.editContent.bind(this));
		buttonsContainerNote.appendChild(buttonEdit);

		let buttonDone = document.createElement("img");
		buttonDone.classList.add("button");
		buttonDone.src = "img/tick_yellow.svg";
		buttonDone.alt = "Erledigt";
		LockableManager.makeLockable(buttonDone, "click", () => alert("Done"));	// TODO: Implement proper action for done, mind bind(this)
		buttonsContainerNote.appendChild(buttonDone);

		// if no due date is selected, add a CSS class to handle it
		let dueDate = this._htmlObject.querySelector(".dueDate");
		let dueDateString = dueDate.querySelector(".dueDatePicker").value;
		if (!dueDateString) {
			dueDate.classList.add("noDueDate");
		}

		LockableManager.unlockElements();
	}

	/**
	 * Returns if the note has a due date.
	 * @returns if the note has a due date
	 */
	hasDueDate() {
		return (this.#dueDate != null);
	}

	/**
	 * Returns the current due date of this note.
	 * @returns the current due date
	 */
	getDueDate() {
		return this.#dueDate;
	}

	/**
	 * Remaps Ctrl+S to save new content of this note and Escape to cancel the action of altering the content and keep the previous content.
	 * @param {Event} event the event which caused the call of this method
	 */
	 remapKeys(event) {
		// remap Ctrl+S to save new content of this note
		if (event.key === "s" && event.ctrlKey) {
			this.saveContent();
			event.preventDefault();
			return;
		}

		// remap Escape to cancel the action of altering the content and keep the previous content
		if (event.key === "Escape") {
			this.cancelEditContent();
			event.preventDefault();
			return;
		}
	}
}