import { Category } from "./Category.js";
import { Element } from "./Element.js";

/**
 * @author Ganko Pi
 */
export class Note extends Element {
	private content: string;
	private dueDate: Date;
	private doneDate: Date;

	/**
	 * Constructor for a new note without content and due date which will be displayed in the HTML page.
	 * @param {Date} creationDate the date on which the category was first created
	 * @param {Category} category the category which contains this note
	 * @param {Date} doneDate the date when this note was finished, pass null if it is not finished yet
	 */
	constructor(creationDate: Date, category: Category, doneDate: Date) {
		super(creationDate);
		this.htmlObject = this.createNoteInHTML();
		this.container = category;
		this.content = "";
		this.dueDate = null;
		this.doneDate = doneDate;

		this.makeDraggable();
	}

	/**
	 * Creates a new note without content and due date.
	 * @returns the newly created note
	 */
	createNoteInHTML(): HTMLElement {
		// create container which contains all elements of a note
		let note: HTMLElement = document.createElement("div");
		note.classList.add("note");
		note.classList.add("draggable");

		// create area with which the note can be moved around
		let dragArea: HTMLElement = document.createElement("div");
		dragArea.classList.add("dragArea");
		for (let i: number = 0; i < 3; ++i) {
			let dot: HTMLElement = document.createElement("span");
			dot.classList.add("dot");
			dragArea.appendChild(dot);
		}
		note.appendChild(dragArea);

		// create a container for buttons edit, done, save and cancel
		let buttonsContainerNote: HTMLElement = document.createElement("div");
		buttonsContainerNote.classList.add("buttonsContainerNote");
		note.appendChild(buttonsContainerNote);

		// create a divider to seperate the dragArea and the buttons from the content and the due date
		let divider: HTMLHRElement = document.createElement("hr");
		note.appendChild(divider);

		// create a area to display the content
		let textArea: HTMLElement = document.createElement("p");
		textArea.classList.add("textArea");
		note.appendChild(textArea);

		// create an input to set the due date and make it immutable
		let dueDate: HTMLElement = document.createElement("div");
		dueDate.classList.add("dueDate");
		dueDate.classList.add("noDueDate");
		dueDate.innerHTML = "F&auml;llig am: ";
		let dueDatePicker: HTMLInputElement = document.createElement("input");
		dueDatePicker.type = "date";
		dueDatePicker.classList.add("dueDatePicker");
		dueDatePicker.disabled = true;
		dueDate.appendChild(dueDatePicker);
		note.appendChild(dueDate);

		return note;
	}

	/**
	 * Makes the HTML element of the content of this note editable and locks all lockable elements.
	 */
	editContent(): void {	
		LockableManager.lockElements();
	
		// remove all buttons from the note
		let buttonsContainerNote: HTMLElement = this.htmlObject.querySelector(".buttonsContainerNote");
		this.removeAllChildren(buttonsContainerNote);
	
		// add buttons cancel and save
		let buttonCancel: HTMLImageElement = document.createElement("img");
		buttonCancel.classList.add("button");
		buttonCancel.src = "img/cross.svg";
		buttonCancel.alt = "Abbrechen";
		buttonCancel.addEventListener("click", this.cancelEditContent.bind(this));
		buttonsContainerNote.appendChild(buttonCancel);
	
		let buttonSave: HTMLImageElement = document.createElement("img");
		buttonSave.classList.add("button");
		buttonSave.src = "img/tick_green.svg";
		buttonSave.alt = "Speichern";
		buttonSave.addEventListener("click", this.saveContent.bind(this));
		buttonsContainerNote.appendChild(buttonSave);
	
		let dueDate: HTMLElement = this.htmlObject.querySelector(".dueDate");
		if (dueDate.classList.contains("noDueDate")) {
			dueDate.classList.remove("noDueDate");
		}

		let dueDatePicker: HTMLInputElement = dueDate.querySelector(".dueDatePicker");
		dueDatePicker.disabled = false;
	
		// remap ctrl+s and esc
		window.addEventListener("keydown", this.remapKeys);
	
		let textArea: HTMLElement = this.htmlObject.querySelector(".textArea");
		textArea.contentEditable = "true";
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
	saveContent(): void {	
		let textArea: HTMLElement = this.htmlObject.querySelector(".textArea");

		// if line breaks are at the end, remove them
		while (textArea.innerHTML.substring(textArea.innerHTML.length - 4) == "<br>") {
			textArea.innerHTML = textArea.innerHTML.substring(0, textArea.innerHTML.length - 4);
		}

		// if the note does not contain any content, remove the note
		if (textArea.innerHTML.trim().length == 0) {
			// remove remappings
			window.removeEventListener("keydown", this.remapKeys);
			LockableManager.unlockElements();

			this.container.removeChild(this);

			return;
		}

		this.content = textArea.innerHTML;

		// insert at new position if the due date has changed
		let dueDatePicker: HTMLInputElement = this.htmlObject.querySelector(".dueDatePicker");
		if (this.dueDate.getTime() != new Date(dueDatePicker.value).getTime()) {
			this.dueDate = new Date(dueDatePicker.value);
			this.container.removeChild(this);
			this.container.addChild(this);
		}

		this.removeEditState();
	}

	/**
	 * Restores the previous content and the previous due date in HTML, makes the HTML elements of content and due date immutable and unlocks all lockable elements.
	 */
	cancelEditContent(): void {
		if (this.content == "") {
			// remove remappings
			window.removeEventListener("keydown", this.remapKeys);
			LockableManager.unlockElements();

			this.container.removeChild(this);

			return;
		}

		let textArea: HTMLElement = this.htmlObject.querySelector(".textArea");
		textArea.innerHTML = this.content;

		let dueDatePicker: HTMLInputElement = this.htmlObject.querySelector(".dueDatePicker");
		dueDatePicker.value = this.dueDate.toString();

		this.removeEditState();
	}

	/**
	 * Makes the HTML elements of content and due date immutable, sets edit and done as the only buttons and unlocks all lockable elements.
	 */
	private removeEditState(): void {
		// remove remappings
		window.removeEventListener("keydown", this.remapKeys);

		let textArea: HTMLElement = this.htmlObject.querySelector(".textArea");
		textArea.contentEditable = "false";

		let dueDatePicker: HTMLInputElement = this.htmlObject.querySelector(".dueDatePicker");
		dueDatePicker.disabled = true;

		// remove all buttons from the note
		let buttonsContainerNote: HTMLElement = this.htmlObject.querySelector(".buttonsContainerNote");
		this.removeAllChildren(buttonsContainerNote);

		// add buttons to switch to edit mode or to set the state to done
		let buttonEdit: HTMLImageElement = document.createElement("img");
		buttonEdit.classList.add("button");
		buttonEdit.src = "img/pencil.svg";
		buttonEdit.alt = "Bearbeiten";
		LockableManager.makeLockable(buttonEdit, "click", this.editContent.bind(this));
		buttonsContainerNote.appendChild(buttonEdit);

		let buttonDone: HTMLImageElement = document.createElement("img");
		buttonDone.classList.add("button");
		buttonDone.src = "img/tick_yellow.svg";
		buttonDone.alt = "Erledigt";
		LockableManager.makeLockable(buttonDone, "click", () => alert("Done"));	// TODO: Implement proper action for done, mind bind(this)
		buttonsContainerNote.appendChild(buttonDone);

		// if no due date is selected, add a CSS class to handle it
		let dueDate: HTMLElement = this.htmlObject.querySelector(".dueDate");
		let dueDateString: string = (dueDate.querySelector(".dueDatePicker") as HTMLInputElement).value;
		if (!dueDateString) {
			dueDate.classList.add("noDueDate");
		}

		LockableManager.unlockElements();
	}

	/**
	 * Moves the placeholder for this note to the overlapped category.
	 * @param {Category} overlappedCategory the category which overlaps with this note
	 */
	movePlaceholder(overlappedCategory: Category): void {
		if (this.container == overlappedCategory) {

			let overlappedNote: Note = overlappedCategory.getOverlappingNote(this.htmlObject);
			if (!this.dueDate &&
				(overlappedNote && !overlappedNote.hasDueDate())) {

				let wasPlaceholderBeforeOverlappedNote: boolean = overlappedCategory.isChildBeforeOtherChild(this.placeholder, overlappedNote);

				overlappedCategory.removeChild(this.placeholder);
				
				if (wasPlaceholderBeforeOverlappedNote) {
					overlappedCategory.insertElementAfterChild(this.placeholder, overlappedNote);
				} else {
					overlappedCategory.insertElementBeforeChild(this.placeholder, overlappedNote);
				}
			}

			return;
		}

		// different this.container and overlappedCategory
		this.container.removeChild(this.placeholder);

		// needs to be before moving this note to overlappedCategory
		let overlappedNote: Note = overlappedCategory.getOverlappingNote(this.htmlObject);

		this.container.removeChild(this);
		overlappedCategory.addNoteWithPlaceholder(this);

		this.container = overlappedCategory;

		if (this.dueDate) {
			overlappedCategory.addElementWithDueDate(this.placeholder, this.dueDate);

			return;
		}
		
		if (!overlappedNote || overlappedNote.hasDueDate()) {
			overlappedCategory.addElementWithoutDueDate(this.placeholder);

			return;
		}

		overlappedCategory.insertElementBeforeChild(this.placeholder, overlappedNote);
	}

	/**
	 * Remaps Ctrl+S to save new content of this note and Escape to cancel the action of altering the content and keep the previous content.
	 * @param {Event} event the event which caused the call of this method
	 */
	remapKeys(event: Event): void {
		if (!event) {
			event = window.event;
		}

		if (!(event instanceof KeyboardEvent)) {
			return;
		}

		let keyboardEvent: KeyboardEvent = event as KeyboardEvent;

		// remap Ctrl+S to save new content of this note
		if (keyboardEvent.key === "s" && keyboardEvent.ctrlKey) {
			this.saveContent();
			keyboardEvent.preventDefault();
			return;
		}

		// remap Escape to cancel the action of altering the content and keep the previous content
		if (keyboardEvent.key === "Escape") {
			this.cancelEditContent();
			keyboardEvent.preventDefault();
			return;
		}
	}

	/**
	 * Returns the current due date of this note.
	 * @returns the current due date
	 */
	getDueDate(): Date {
		return this.dueDate;
	}

	/**
	 * Returns if the note has a due date.
	 * @returns if the note has a due date
	 */
	hasDueDate(): boolean {
		return (this.dueDate != null);
	}
}
