<script lang="ts">
export default {
	name: "DraggableElement",
	props: ["elementsLocked"],
	methods: {
		
	}
}
</script>

<template>
	<div class="draggable">
		<div class="dragArea" :class="{disabled: elementsLocked}">
			<span v-for="n in 3" class="dot"></span>
		</div>
		<slot></slot>
	</div>
</template>

<style scoped>
/* structure */
.dot {
	display: inline-block;
}

/* sizing */
.dragArea {
	font-size: 0;
	padding: 0.4rem 0;
}

.dot {
	--dot-size: 0.2rem;

	width: var(--dot-size);
	height: var(--dot-size);
	margin: 0 0.2rem;
	border-radius: 100%;
}

/* colors light theme */
.dot {
	--dot-color-dark: black;
	--dot-color-light: white;

	background-color: var(--dot-color-dark);
}

/* other */
.draggable .dragArea:not(.disabled) {
	cursor: move;
}

.dragArea {
	text-align: center;
}

.category > .dragArea > .dot {
	background-color: var(--dot-color-light);
}
</style>
