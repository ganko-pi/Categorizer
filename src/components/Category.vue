<script lang="ts">
import type { CategorizerObject } from "../main";
import DraggableElement from "./DraggableElement.vue";
import type { Note } from "./Note.vue";
import Note from "./Note.vue";

export interface Category extends CategorizerObject {
	name: string,
	notes: Note[]
}

export default {
	name: "Category",
	components: {
		DraggableElement,
		Note
	},
	props: ["properties", "elementsLocked", "getNextId"],
	emits: ["lockElements", "unlockElements", "removeCategory"],
	data() {
		return {
			editActive: false,
			newName: this.properties.name,
			newNote: null
		}
	},
	methods: {
		resizeHeightToFitContent(event: Event) {
			// TODO finish
			// TODO bug: first character is not regocnized
			console.log("In resize");
			console.log(event.target.value);
			event.target.style.height = `${event.target.scrollHeight}px`;
		},

		// TODO update description
		/**
		 * Makes the HTML element of the name of this category editable and locks all lockable elements.
		 */
		editName() {
			this.$emit("lockElements");

			this.editActive = true;

			// TODO ctrl+s, esc, maybe with this.editActive?
			
			let categoryName: HTMLTextAreaElement = this.$refs.categoryName;
			categoryName.disabled = false;
			categoryName.focus();

			// set cursor at end of text
			categoryName.setSelectionRange(categoryName.value.length, categoryName.value.length);
		},

		// TODO update description
		/**
		 * Restores the previous name in HTML, makes the HTML element of name immutable and unlocks all lockable elements.
		 */
		cancelEditName() {
			this.newName = this.properties.name;

			this.removeEditState();
		},

		// TODO update description
		/**
		 * Stores the new name, makes the HTML element of name immutable and unlocks all lockable elements.
		 * If the name is empty and the category contains notes, the state does not change.
		 * If the name is empty and the category does not contain notes, the category will be removed.
		 */
		saveName() {
			// if name is blank and the category contains notes, saving is disallowed
			if ((this.newName.length == 0) && (this.properties.notes.length > 0)) {
				alert("Kategoriename darf nicht leer sein, wenn die Kategorie Notizen enthält.")
				return;
			}

			this.properties.name = this.newName;

			this.removeEditState();
		},

		// TODO update description
		/**
		 * Makes the HTML element of name immutable, sets edit as the only button and unlocks all lockable elements.
		 */
		removeEditState() {
			// TODO ctrl+s, esc, maybe with this.editActive?

			this.$emit("unlockElements");

			// if name is blank and the category does not contain notes, the category will be removed
			if (this.properties.name.length == 0) {
				this.$emit("removeCategory", this.properties.id);

				return;
			}

			let categoryName: HTMLTextAreaElement = this.$refs.categoryName;
			categoryName.disabled = true;

			this.editActive = false;
		},

		createNewNote(): void {
			let newNote: Note = {
				id: this.getNextId(),
				creationDate: new Date(),
				content: "",
				dueDate: null
			};
			this.newNote = newNote;
		},

		lockElements(): void {
			this.$emit("lockElements");
		},

		unlockElements(): void {
			this.$emit("unlockElements");
		},

		removeNote(noteId: number): void {

		}
	},
	mounted() {
		if (!this.properties.name) {
			this.editName();
		}
	}
}
</script>

<template>
	<DraggableElement class="category" :elementsLocked="elementsLocked">
		<div class="categoryHeader">
			<!-- <textarea class="categoryName" :value="name" @input="resizeHeightToFitContent"></textarea> -->
			<textarea
				class="categoryName"
				ref="categoryName"
				v-model.trim="newName"
				disabled>
			</textarea>
			<div class="buttonsContainerCategoryHeader">
				<img
					v-show="editActive"
					src="../assets/img/cross.svg"
					alt="Abbrechen"
					class="button"
					@click="cancelEditName">
				<img
					v-show="editActive"
					src="../assets/img/tick_green.svg"
					alt="Speichern"
					class="button"
					@click="saveName">
				<img
					v-show="!editActive"
					src="../assets/img/pencil.svg"
					alt="Bearbeiten"
					class="button"
					:class="{disabled: elementsLocked}"
					@click="editName">
			</div>
		</div>
		<div
			class="button addNote"
			:class="{disabled: elementsLocked}"
			@click="createNewNote">
				Neue Notiz
		</div>
		<div class="notesContainer">
			<Note
				v-if="newNote != null"
				:properties="newNote"
				:elementsLocked="elementsLocked"
				@lockElements="lockElements"
				@unlockElements="unlockElements"
				@removeNote="removeNote">
			</Note>
			<Note
				v-for="note in properties.notes"
				:key="note.id"
				:properties="note"
				:elementsLocked="elementsLocked"
				@lockElements="lockElements"
				@unlockElements="unlockElements"
				@removeNote="removeNote">
			</Note>
		</div>
		<div class="notesWithPlaceholderContainer"></div>
	</DraggableElement>
</template>

<style scoped>
/* structure */
.categoryHeader {
	display: flex;
}

.notesContainer {
	display: flex;
	flex-direction: column;
	overflow-wrap: break-word;
}

/* sizing */
.category {
	width: 20rem;
	min-height: 15rem;
	padding-bottom: 0.25rem;
	border-width: 0.05rem;
}

.categoryHeader {
	padding: 0.5rem;
}

.categoryName {
	margin: auto;
	height: var(--default-text-size);
	flex-grow: 1;
}

.buttonsContainerCategoryHeader {
	flex-shrink: 0;
}

.addNote {
	margin: 0.15rem;
	border-radius: 0.05rem;
}

.notesContainer {
	padding: 0.25rem 0.5rem;
	gap: 0.5rem;
}

/* TODO needed? */
/* .newNotesContainer:empty,
.notesContainer:empty {
	padding: 0 0.5rem;
} */

/* colors light theme */
.category {
	--category-background-color: bisque;
	--category-border-color: var(--header-background-color);
	--category-header-drag-area-background-color: hsl(231, 47%, 40%);
	--category-header-background-color: var(--header-background-color);
	--category-header-text-color: var(--header-text-color);
	--category-header-button-hovered-background-color: var(--header-button-hovered-background-color);

	background-color: var(--category-background-color);
	border-color: var(--header-background-color);
}

.category > :deep(.dragArea) {
	background-color: var(--category-header-drag-area-background-color);
}

.category > :deep(.dragArea) > .dot {
	background-color: var(--dot-color-light);
}

.categoryHeader {
	background-color: var(--category-header-background-color);
	color: var(--category-header-text-color);
}

.categoryName {
	background-color: inherit;
	color: inherit;
}

.buttonsContainerCategoryHeader img:hover:not(.disabled) {
	background-color: var(--category-header-button-hovered-background-color);
}

.addNote {
	background-color: var(--default-button-background-color);
}

.addNote:hover:not(.disabled) {
	background-color: var(--default-button-hovered-background-color);
}

/* other */
.category {
	border-style: solid;
}
</style>
