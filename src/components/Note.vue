<script lang="ts">
import type { CategorizerObject } from '../main';
import DraggableElement from './DraggableElement.vue';

export interface Note extends CategorizerObject {
	content: string,
	dueDate: Date
}

export default {
	name: "Note",
	components: {
		DraggableElement
	},
	props: ["properties", "elementsLocked"],
	emits: ["lockElements", "unlockElements", "removeNote"],
	data() {
		return {
			editActive: false,
			newContent: this.properties.content,
			newDueDate: this.properties.dueDate,
			dueDateSet: (this.properties.dueDate as boolean)
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
		 * Makes the HTML element of the content of this note editable and locks all lockable elements.
		 */
		editContent() {
			this.$emit("lockElements");

			this.editActive = true;

			// TODO ctrl+s, esc, maybe with this.editActive?
			
			let dueDatePicker: HTMLInputElement = this.$refs.dueDatePicker;
			dueDatePicker.disabled = false;

			let contentNote: HTMLInputElement = this.$refs.contentNote;
			contentNote.disabled = false;
			contentNote.focus();

			// set cursor at end of text
			contentNote.setSelectionRange(contentNote.value.length, contentNote.value.length);
		},

		// TODO update description
		/**
		 * Restores the previous content and the previous due date in HTML, makes the HTML elements of content and due date immutable and unlocks all lockable elements.
		 */
		cancelEditContent() {
			this.newContent = this.properties.content;
			this.newDueDate = this.properties.dueDate;

			this.removeEditState();
		},

		// TODO update description
		/**
		 * Stores the new content and due date, makes the HTML elements of content and due date immutable and unlocks all lockable elements.
		 * If the note does not contain any content, the note will be removed.
		 */
		saveContent() {
			this.properties.content = this.newContent;

			// TODO remove, only for debugging
			console.log(`Old due date: ${this.properties.dueDate}`);
			console.log(`New due date: ${this.newDueDate}`);

			if (this.properties.dueDate != this.newDueDate) {
				if (this.newDueDate) {
					this.dueDateSet = true;
				}

				this.properties.dueDate = this.newDueDate;
				// TODO add at right position
			}

			this.removeEditState();
		},

		// TODO update description
		/**
		 * Makes the HTML elements of content and due date immutable, sets edit and done as the only buttons and unlocks all lockable elements.
		 */
		removeEditState() {
			// TODO ctrl+s, esc, maybe with this.editActive?

			this.$emit("unlockElements");

			// if name is blank and the category does not contain notes, the category will be removed
			if (this.properties.content.length == 0) {
				this.$emit("removeNote", this.properties.id);

				return;
			}

			let dueDatePicker: HTMLInputElement = this.$refs.dueDatePicker;
			dueDatePicker.disabled = true;

			let contentNote: HTMLInputElement = this.$refs.contentNote;
			contentNote.disabled = true;

			this.editActive = false;
		}
	},
	mounted() {
		this.editContent();
	}
}
</script>

<template>
	<DraggableElement class="note" :elementsLocked="elementsLocked">
		<div class="buttonsContainerNote">
			<img
				v-show="editActive"
				src="../assets/img/cross.svg"
				alt="Abbrechen"
				class="button"
				@click="cancelEditContent">
			<img
				v-show="editActive"
				src="../assets/img/tick_green.svg"
				alt="Speichern"
				class="button"
				@click="saveContent">
			<img
				v-show="!editActive"
				src="../assets/img/pencil.svg"
				alt="Bearbeiten"
				class="button"
				:class="{disabled: elementsLocked}"
				@click="editContent">
			<img
				v-show="!editActive"
				src="../assets/img/tick_yellow.svg"
				alt="Erledigt"
				class="button"
				:class="{disabled: elementsLocked}"
				@click="() => alert('Done')">
		</div>
		<hr>
		<!-- <textarea class="categoryName" :value="name" @input="resizeHeightToFitContent"></textarea> -->
		<textarea
			class="contentNote"
			ref="contentNote"
			v-model.trim="newContent"
			disabled>
		</textarea>
		<div v-show="editActive || dueDateSet" class="dueDate">
			F&auml;llig am:
			<input
				type="date"
				class="dueDatePicker"
				ref="dueDatePicker"
				v-model="newDueDate"
				disabled>
		</div>
	</DraggableElement>
</template>

<style scoped>
/* structure */
.buttonsContainerNote {
	display: flex;
	justify-content: space-between;
}

/* sizing */
.note {
	border-width: 0.25rem;
	border-radius: 0.15rem;
}

.note > hr {
	margin: 0;
}

.buttonsContainerNote img {
	width: 1rem;
	padding: 0.3rem 1rem;
}

.contentNote {
	margin: 0;
	padding: 0.25rem;

	height: var(--default-text-size);
	width: 100%;
}

.dueDate {
	padding: 0.25rem;
}

.dueDatePicker {
	border-width: 1px;
	border-radius: 0.1rem;
}

/* colors light theme */
.note {
	--note-background-color: navajowhite;
	--note-border-color: hsl(36, 77%, 73%);
	--note-button-hovered-background-color: hsl(34, 72%, 79%);
	--note-due-date-background-color: white;
	--note-due-date-text-color: black;
	--note-due-date-border-color: var(--note-due-date-text-color);
	--note-disabled-due-date-background-color: hsl(0, 0%, 90%);
	--note-disabled-due-date-text-color: hsl(0, 0%, 20%);
	--note-disabled-due-date-border-color: var(--note-disabled-due-date-text-color);

	background-color: var(--note-background-color);
	border-color: var(--note-border-color);
}

.note > :deep(.dragArea) {
	background-color: var(--note-border-color);
}

.note > hr {
	border-color: var(--note-border-color);
}

.buttonsContainerNote img:hover:not(.disabled) {
	background-color: var(--note-button-hovered-background-color);
}

.contentNote {
	background-color: inherit;
	color: inherit;
}

.dueDatePicker {
	background-color: var(--note-due-date-background-color);
	color: var(--note-due-date-text-color);
	border-color: var(--note-due-date-border-color);
}

.dueDatePicker:disabled {
	background-color: var(--note-disabled-due-date-background-color);
	color: var(--note-disabled-due-date-text-color);
	border-color: var(--note-disabled-due-date-border-color);
}

/* other */
.note {
	border-style: solid;
	text-align: left;
}

.note > hr {
	border-style: solid;
}

.dueDatePicker {
	border-style: solid;
}
</style>
