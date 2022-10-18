<script lang="ts">
import CategoryVue, { type Category } from "./components/Category.vue";
import DraggableElement from "./components/DraggableElement.vue";
import type { Note } from "./components/Note.vue";

export default {
	components: {
		CategoryVue,
		DraggableElement
	},
	data() {
		return {
			currentId: 0,
			categories: [
				{
					id: 3,
					creationDate: new Date(),
					name: "3",
					notes: []
				},
				{
					id: 2,
					creationDate: new Date(),
					name: "2",
					notes: []
				},
				{
					id: 1,
					creationDate: new Date(),
					name: "1",
					notes: []
				}
			],
			elementsLocked: false
		}
	},
	methods: {
		createNewCategory(): void {
			// this.categories.push({ id: this.currentId++, content: "" })
			let newCategory: Category = {
				id: this.getNextId(),
				creationDate: new Date(),
				name: "",
				notes: []
			};
			this.categories.push(newCategory);

			console.log(this.categories);
		},

		removeCategory(categoryId: number): void {
			let index: number = this.categories.indexOf(this.getCategory(categoryId));

			this.categories.splice(index, 1);
		},

		getCategory(categoryId: number): Category {
			return this.categories.find((category: Category) => (category.id === categoryId));
		},

		addNote(categoryId: number): void {
			let category: Category = this.getCategory(categoryId);

			// TODO move note to last position after initial editing if no due date
			let newNote: Note = {
				id: this.getNextId(),
				content: "",
				dueDate: null
			};
			category.notes.push(newNote);
		},

		log(obj: any): void {
			 console.log(obj);
		},

		lockElements(): void {
			this.elementsLocked = true;
		},

		unlockElements(): void {
			this.elementsLocked = false;
		},

		getNextId(): number {
			return this.currentId++;
		}
	}
}
</script>

<template>
	<header>
		<div
			class="button newCategoryButton"
			:class="{disabled: elementsLocked}"
			@click="createNewCategory">
				Neue Kategorie
		</div>
		<div
			class="button doneButton"
			:class="{disabled: elementsLocked}">
				Erledigte
		</div>
	</header>
	<main>
		<CategoryVue
			v-for="category in categories"
			:key="category.id"
			:properties="category"
			:elementsLocked="elementsLocked"
			:getNextId="getNextId"
			@lockElements="lockElements"
			@unlockElements="unlockElements"
			@removeCategory="removeCategory">
		</CategoryVue>
	</main>
</template>

<style scoped>
/* structure */
header {
	display: flex;
	justify-content: space-between;
}

main {
	display: flex;
	flex-wrap: wrap;
}

/* sizing */
header {
	padding: 0.5rem 3rem;
}

header .button {
	width: fit-content;
}

main {
	padding: 2rem 1rem;
	gap: 4rem 2rem;
}

/* colors light theme */
header {
	background-color: var(--header-background-color);
	color: var(--header-text-color);
}

header .button:hover:not(.disabled) {
	background-color: var(--header-button-hovered-background-color);
}
</style>
