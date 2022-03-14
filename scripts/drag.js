/**
 * @author Ganko Pi
 */

//Make the DIV element draggagle:
window.onload = function () {
	let array = document.getElementsByClassName("addContainer");
	for (let i = 0; i < array.length; ++i) {
		array[i].addEventListener("click", () => checkForDisabledAndRun(array[i], addContainer));
	}

	// addContainer();

	let eles = document.getElementsByClassName("draggable");
	// for (let i = 0; i < eles.length; ++i) {
	// 	makeDraggable(eles[i]);
	// }
}

// enum replacement
const mode = {
	ELEMENT_WITH_DUE_DATE_DRAGGED: "elementWithDueDateDragged",
	ELEMENT_WITHOUT_DUE_DATE_DRAGGED: "elementWithoutDueDateDragged",
	CONTAINER_DRAGGED: "containerDragged"
}

function makeDraggable(ele) {
	let pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;

	let placeholder;

	if (ele.classList.contains("dragArea")) {
		ele.onmousedown = dragMouseDown;
	} else if (ele.getElementsByClassName("dragArea")[0]) {
		/* if present, the header is where you move the DIV from:*/
		ele.getElementsByClassName("dragArea")[0].onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();

		placeholder = makeAbsoluteAndSetPlaceholder(ele);

		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		ele.style.top = (ele.offsetTop - pos2) + "px";
		ele.style.left = (ele.offsetLeft - pos1) + "px";

		// move placeholder
		let eleMiddleX = ele.offsetLeft + (ele.offsetWidth / 2);
		let eleMiddleY = ele.offsetTop + (ele.offsetHeight / 2);

		let currentMode = null;
		if (ele.parentNode.classList.contains("elementsWithDueDate")) {
			currentMode = mode.ELEMENT_WITH_DUE_DATE_DRAGGED;
		} else if (ele.parentNode.classList.contains("elementsWithoutDueDate")) {
			currentMode = mode.ELEMENT_WITHOUT_DUE_DATE_DRAGGED;
		} else {
			currentMode = mode.CONTAINER_DRAGGED;
		}



		let containers = document.getElementsByClassName("container");
		switch (currentMode) {
			case mode.ELEMENT_WITH_DUE_DATE_DRAGGED:
				for (let i = 0; i < containers.length; ++i) {
					let leftBorder = containers[i].offsetLeft;
					let rightBorder = leftBorder + containers[i].offsetWidth;
					let topBorder = containers[i].offsetTop;
					let bottomBorder = topBorder + containers[i].offsetHeight;

					// if placeholder is moved to new container: add element at end of this container

					// check if middle of element is over container
					if (eleMiddleX > leftBorder && eleMiddleX < rightBorder &&
						eleMiddleY > topBorder && eleMiddleY < bottomBorder) {

						let container = placeholder.parentNode.parentNode;
						if (container === containers[i]) {
							break;
						}

						let dueDate = ele.getElementsByClassName("dueDatePicker")[0].value;

						let elementsWithDueDate = containers[i].getElementsByClassName("elementsWithDueDate")[0];

						let dueDateDateFormat = new Date(dueDate);
						let nextToCompare = elementsWithDueDate.firstChild;
						while (nextToCompare && (dueDateDateFormat >= new Date(nextToCompare.getElementsByClassName("dueDatePicker")[0].value))) {
							nextToCompare = nextToCompare.nextSibling;
						}

						placeholder.parentNode.removeChild(placeholder);
						elementsWithDueDate.insertBefore(placeholder, nextToCompare);

						// insert placeholder

						// placeholder.parentNode.removeChild(placeholder);

						// if (isPlaceHolderBefore) {
						// 	nodesToIterate[i - 1].parentNode.insertBefore(placeholder, nodesToIterate[i - 1].nextSibling);
						// } else {
						// 	nodesToIterate[i].parentNode.insertBefore(placeholder, nodesToIterate[i]);
						// }
						//
						// break;
					}
				}

				break;
			case mode.ELEMENT_WITHOUT_DUE_DATE_DRAGGED:
				for (let i = 0; i < containers.length; ++i) {
					let leftBorderContainer = containers[i].offsetLeft;
					let rightBorderContainer = leftBorderContainer + containers[i].offsetWidth;
					let topBorderContainer = containers[i].offsetTop;
					let bottomBorderContainer = topBorderContainer + containers[i].offsetHeight;

					// check if middle of element is over container
					if (eleMiddleX > leftBorderContainer && eleMiddleX < rightBorderContainer &&
						eleMiddleY > topBorderContainer && eleMiddleY < bottomBorderContainer) {

						let elementsWithoutDueDate = containers[i].getElementsByClassName("elementsWithoutDueDate")[0];
						let nodesToIterate = elementsWithoutDueDate.children;
						let isPlaceHolderBefore = false;
						let breakApplied = false;
						// idea: ele is at last position, so length - 1
						// if placeholder is moved to new container: add element at end of this container
						for (let j = 0; j < nodesToIterate.length; ++j) {
							if (nodesToIterate[j] === ele) {
								continue;
							}

							let leftBorderElement = nodesToIterate[j].offsetLeft;
							let rightBorderElement = leftBorderElement + nodesToIterate[j].offsetWidth;
							let topBorderElement = nodesToIterate[j].offsetTop;
							let bottomBorderElement = topBorderElement + nodesToIterate[j].offsetHeight;

							if (eleMiddleX > leftBorderElement && eleMiddleX < rightBorderElement &&
								eleMiddleY > topBorderElement && eleMiddleY < bottomBorderElement) {

								if (nodesToIterate[j] === placeholder) {
									breakApplied = true;
									break;
								}

								placeholder.parentNode.removeChild(placeholder);

								if (isPlaceHolderBefore) {
									nodesToIterate[j - 1].parentNode.insertBefore(placeholder, nodesToIterate[j - 1].nextSibling);
								} else {
									nodesToIterate[j].parentNode.insertBefore(placeholder, nodesToIterate[j]);
								}

								breakApplied = true;
								break;
							}

							if (nodesToIterate[j] === placeholder) {
								isPlaceHolderBefore = true;
							}
						}

						if (!breakApplied && (placeholder.parentNode != elementsWithoutDueDate)) {
							console.log("Hi");
							placeholder.parentNode.removeChild(placeholder);
							elementsWithoutDueDate.appendChild(placeholder);
						}

						// placeholder.parentNode.removeChild(placeholder);

						// if (isPlaceHolderBefore) {
						// 	nodesToIterate[i].parentNode.insertBefore(placeholder, nodesToIterate[i - 1].nextSibling);
						// } else {
						// 	nodesToIterate[i].parentNode.insertBefore(placeholder, nodesToIterate[i]);
						// }
						break;
					}
				}

				break;
			case mode.CONTAINER_DRAGGED:
				let nodesToIterate = ele.parentNode.children;
				let isPlaceHolderBefore = false;
				// idea: ele is at last position, so length - 1
				for (let i = 0; i < nodesToIterate.length; ++i) {
					if (nodesToIterate === ele) {
						continue;
					}

					let leftBorderElement = nodesToIterate[i].offsetLeft;
					let rightBorderElement = leftBorderElement + nodesToIterate[i].offsetWidth;
					let topBorderElement = nodesToIterate[i].offsetTop;
					let bottomBorderElement = topBorderElement + nodesToIterate[i].offsetHeight;

					if (eleMiddleX > leftBorderElement && eleMiddleX < rightBorderElement &&
						eleMiddleY > topBorderElement && eleMiddleY < bottomBorderElement) {

						if (nodesToIterate[i] === placeholder) {
							break;
						}

						placeholder.parentNode.removeChild(placeholder);

						if (isPlaceHolderBefore) {
							nodesToIterate[i - 1].parentNode.insertBefore(placeholder, nodesToIterate[i - 1].nextSibling);
						} else {
							nodesToIterate[i].parentNode.insertBefore(placeholder, nodesToIterate[i]);
						}

						break;
					}

					if (nodesToIterate[i] === placeholder) {
						isPlaceHolderBefore = true;
					}
				}

				break;
		}
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;

		setElementAtPositionOfPlaceholder(ele, placeholder);
	}
}