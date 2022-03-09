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

function makeAbsoluteAndSetPlaceholder(element) {
	element.style.left = element.getBoundingClientRect().left + "px";
	element.style.top = element.getBoundingClientRect().top + "px";
	element.style.height = getHeight(element, false, false);
	element.style.width = getWidth(element, false, false);

	let placeholder = getPlaceholder(element);
	element.parentNode.insertBefore(placeholder, element.nextSibling);

	element.style.position = "fixed";
	element.style.zIndex = "10";

	// move element at the end
	let parent = element.parentNode;
	parent.removeChild(element);
	parent.appendChild(element);

	return placeholder;
}

function setElementAtPositionOfPlaceholder(element, placeholder) {
	// reset everything
	element.style.position = "";
	element.style.top = "";
	element.style.left = "";
	element.style.height = "";
	element.style.zIndex = "";

	// insert ele at right position
	element.parentNode.removeChild(element);
	placeholder.parentNode.insertBefore(element, placeholder);
	placeholder.parentNode.removeChild(placeholder);
}

function getPlaceholder(element) {
	// create dummy element
	let placeholder = document.createElement("div");
	placeholder.classList.add("placeholder");
	placeholder.style.height = getHeight(element, true, true);
	placeholder.style.width = getWidth(element, true, true);

	return placeholder;
}

function getHeight(ele, withPadding, withBorder) {
	let styleEle = getComputedStyle(ele);

	let height = parseFloat(styleEle.height);
	if (withPadding) {
		height += parseFloat(styleEle.paddingTop) + parseFloat(styleEle.paddingBottom);
	}
	if (withBorder) {
		height += parseFloat(styleEle.borderTopWidth) + parseFloat(styleEle.borderBottomWidth);
	}

	return height + "px";

	// return ele.getBoundingClientRect().height + "px";
}

function getWidth(ele, withPadding, withBorder) {
	let styleEle = getComputedStyle(ele);

	let height = parseFloat(styleEle.width);
	if (withPadding) {
		height += parseFloat(styleEle.paddingLeft) + parseFloat(styleEle.paddingRight);
	}
	if (withBorder) {
		height += parseFloat(styleEle.borderLeftWidth) + parseFloat(styleEle.borderRightWidth);
	}

	return height + "px";

	// return ele.getBoundingClientRect().width + "px";
}

function addContainer() {
	let container = document.createElement("div");
	container.classList.add("container");
	container.classList.add("draggable");

	let dragArea = document.createElement("div");
	dragArea.classList.add("dragArea");
	dragArea.innerHTML = ".&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;.";
	container.appendChild(dragArea);

	let containerHeader = document.createElement("div");
	containerHeader.classList.add("containerHeader");
	let containerHeaderText = document.createElement("p");
	containerHeaderText.classList.add("containerHeaderText");
	containerHeaderText.innerHTML = "";
	containerHeader.appendChild(containerHeaderText);

	let buttonsContainerContainerHeader = document.createElement("div");
	buttonsContainerContainerHeader.classList.add("buttonsContainerContainerHeader");
	containerHeader.appendChild(buttonsContainerContainerHeader);
	container.appendChild(containerHeader);

	let addButton = document.createElement("div");
	addButton.classList.add("button");
	addButton.classList.add("addElement");
	addButton.innerHTML = "Neue Notiz";
	addButton.addEventListener("click", () => checkForDisabledAndRun(addButton, () => addElement(container)));
	container.appendChild(addButton);

	let newElements = document.createElement("div");
	newElements.classList.add("newElements");
	container.appendChild(newElements);

	let elementsWithDueDate = document.createElement("div");
	elementsWithDueDate.classList.add("elementsWithDueDate");
	container.appendChild(elementsWithDueDate);

	let elementsWithoutDueDate = document.createElement("div");
	elementsWithoutDueDate.classList.add("elementsWithoutDueDate");
	container.appendChild(elementsWithoutDueDate);

	document.getElementsByTagName("main")[0].appendChild(container);

	editContainer(container);
}

function addElement(container /*, text */ ) {
	let element = document.createElement("div");
	element.classList.add("element");
	element.classList.add("draggable");

	let dragArea = document.createElement("div");
	dragArea.classList.add("dragArea");
	dragArea.innerHTML = ".&nbsp;&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;&nbsp;.";
	element.appendChild(dragArea);

	let buttonsContainerElements = document.createElement("div");
	buttonsContainerElements.classList.add("buttonsContainerElements");
	element.appendChild(buttonsContainerElements);

	let divider = document.createElement("hr");
	element.appendChild(divider);

	let textArea = document.createElement("p");
	textArea.classList.add("textArea");
	element.appendChild(textArea);

	let newElements = container.getElementsByClassName("newElements")[0];
	newElements.insertBefore(element, newElements.firstChild);

	editElement(element);

	makeDraggable(element);
}

function addElementWithDueDate(element) {
	let dueDate = element.getElementsByClassName("dueDatePicker")[0].value;
	if (!dueDate) {
		return;
	}

	let container = element.parentNode.parentNode;
	let elementsWithDueDate = container.getElementsByClassName("elementsWithDueDate")[0];

	element.parentNode.removeChild(element);
	let dueDateDateFormat = new Date(dueDate);
	let nextToCompare = elementsWithDueDate.firstChild;
	while (nextToCompare && (dueDateDateFormat >= new Date(nextToCompare.getElementsByClassName("dueDatePicker")[0].value))) {
		nextToCompare = nextToCompare.nextSibling;
	}
	elementsWithDueDate.insertBefore(element, nextToCompare);
}

function addElementWithoutDueDate(element) {
	let dueDate = element.getElementsByClassName("dueDatePicker")[0].value;
	if (dueDate) {
		return;
	}

	let container = element.parentNode.parentNode;
	let elementsWithoutDueDate = container.getElementsByClassName("elementsWithoutDueDate")[0];

	if (element.parentNode === elementsWithoutDueDate) {
		return;
	}

	element.parentNode.removeChild(element);
	elementsWithoutDueDate.appendChild(element);
}

function editContainer(container) {
	if (!container) {
		return;
	}

	lockElements();

	let containerHeaderText = container.getElementsByClassName("containerHeaderText")[0];
	let contentOld = container.getElementsByClassName("containerHeaderText")[0].innerHTML;

	let buttonsContainerContainerHeader = container.getElementsByClassName("buttonsContainerContainerHeader")[0];
	while (buttonsContainerContainerHeader.firstChild) {
		buttonsContainerContainerHeader.firstChild.remove();
	}

	let buttonCancel = document.createElement("img");
	buttonCancel.classList.add("button");
	buttonCancel.src = "img/cross.svg";
	buttonCancel.alt = "Cancel"
	buttonsContainerContainerHeader.appendChild(buttonCancel);

	let buttonConfirm = document.createElement("img");
	buttonConfirm.classList.add("button");
	buttonConfirm.src = "img/tick_green.svg";
	buttonConfirm.alt = "Save";
	buttonsContainerContainerHeader.appendChild(buttonConfirm);

	buttonConfirm.addEventListener("click", () => checkForDisabledAndRun(buttonConfirm, () => saveContainer(container, null)));
	buttonCancel.addEventListener("click", () => checkForDisabledAndRun(buttonCancel, () => saveContainer(container, contentOld)));

	// remap ctrl+s and esc
	window.addEventListener("keydown", remapKeys);

	containerHeaderText.contentEditable = true;
	containerHeaderText.focus();

	// set cursor at end of text
	if (containerHeaderText.innerHTML.length > 0) {
		window.getSelection().setBaseAndExtent(containerHeaderText, 1, containerHeaderText, 1)
	}

	function remapKeys(e) {
		if (e.key === "s" && e.ctrlKey) {
			saveContainer(container, null);
			e.preventDefault();
			return;
		}

		if (e.key === "Escape") {
			saveContainer(container, contentOld);
			e.preventDefault();
			return;
		}
	}

	function saveContainer(container, text) {
		if (!container) {
			return;
		}

		// remove remappings
		window.removeEventListener("keydown", remapKeys);

		let containerHeaderText = container.getElementsByClassName("containerHeaderText")[0];

		if (text != null) {
			containerHeaderText.innerHTML = text;
		}

		if (containerHeaderText.innerHTML.substring(containerHeaderText.innerHTML.length - 4) == "<br>") {
			containerHeaderText.innerHTML = containerHeaderText.innerHTML.substring(0, containerHeaderText.innerHTML.length - 4);
		}

		if (containerHeaderText.innerHTML.trim().length > 0) {
			containerHeaderText.contentEditable = false;

			let buttonsContainerContainerHeader = container.getElementsByClassName("buttonsContainerContainerHeader")[0];
			while (buttonsContainerContainerHeader.firstChild) {
				buttonsContainerContainerHeader.firstChild.remove();
			}

			let buttonEdit = document.createElement("img");
			buttonEdit.classList.add("button");
			buttonEdit.src = "img/pencil.svg";
			buttonEdit.alt = "Edit"
			buttonsContainerContainerHeader.appendChild(buttonEdit);

			buttonEdit.addEventListener("click", () => checkForDisabledAndRun(buttonEdit, () => editContainer(container)));
		} else {
			container.parentNode.removeChild(container);
		}

		unlockElements();
	}
}

function editElement(element) {
	if (!element) {
		return;
	}

	lockElements();

	let textArea = element.getElementsByClassName("textArea")[0];
	let contentOld = textArea.innerHTML;

	let buttonsContainerElements = element.getElementsByClassName("buttonsContainerElements")[0];
	while (buttonsContainerElements.firstChild) {
		buttonsContainerElements.firstChild.remove();
	}

	let buttonCancel = document.createElement("img");
	buttonCancel.classList.add("button");
	buttonCancel.src = "img/cross.svg";
	buttonCancel.alt = "Cancel"
	buttonsContainerElements.appendChild(buttonCancel);

	let buttonConfirm = document.createElement("img");
	buttonConfirm.classList.add("button");
	buttonConfirm.src = "img/tick_green.svg";
	buttonConfirm.alt = "Save";
	buttonsContainerElements.appendChild(buttonConfirm);

	buttonConfirm.addEventListener("click", () => checkForDisabledAndRun(buttonConfirm, () => saveElement(element, null)));
	buttonCancel.addEventListener("click", () => checkForDisabledAndRun(buttonCancel, () => saveElement(element, contentOld)));

	if (!element.getElementsByClassName("dueDate")[0]) {
		let dueDate = document.createElement("p");
		dueDate.classList.add("dueDate");
		dueDate.innerHTML = "F&auml;llig am: ";
		let dueDatePicker = document.createElement("input");
		dueDatePicker.type = "date";
		dueDatePicker.classList.add("dueDatePicker");
		dueDate.appendChild(dueDatePicker);
		element.appendChild(dueDate);
	}

	// remap ctrl+s and esc
	window.addEventListener("keydown", remapKeys);

	let dueDatePicker = element.getElementsByClassName("dueDatePicker")[0];
	dueDatePicker.disabled = false;

	textArea.contentEditable = true;
	textArea.focus();

	// set cursor at end of text
	if (textArea.innerHTML.length > 0) {
		window.getSelection().setBaseAndExtent(textArea, 1, textArea, 1)
	}

	function remapKeys(e) {
		if (e.key === "s" && e.ctrlKey) {
			saveElement(element, null);
			e.preventDefault();
			return;
		}

		if (e.key === "Escape") {
			saveElement(element, contentOld);
			e.preventDefault();
			return;
		}
	}

	function saveElement(element, text) {
		if (!element) {
			return;
		}

		// remove remappings
		window.removeEventListener("keydown", remapKeys);

		let textArea = element.getElementsByClassName("textArea")[0];

		if (text != null) {
			textArea.innerHTML = text;
		}

		if (textArea.innerHTML.substring(textArea.innerHTML.length - 4) == "<br>") {
			textArea.innerHTML = textArea.innerHTML.substring(0, textArea.innerHTML.length - 4);
		}

		if (textArea.innerHTML.trim().length > 0) {
			textArea.contentEditable = false;

			let dueDatePicker = element.getElementsByClassName("dueDatePicker")[0];
			dueDatePicker.disabled = true;

			let buttonsContainerElements = element.getElementsByClassName("buttonsContainerElements")[0];
			while (buttonsContainerElements.firstChild) {
				buttonsContainerElements.firstChild.remove();
			}

			let buttonEdit = document.createElement("img");
			buttonEdit.classList.add("button");
			buttonEdit.src = "img/pencil.svg";
			buttonEdit.alt = "Edit"
			buttonsContainerElements.appendChild(buttonEdit);

			let buttonDone = document.createElement("img");
			buttonDone.classList.add("button");
			buttonDone.src = "img/tick_yellow.svg";
			buttonDone.alt = "Done";
			buttonsContainerElements.appendChild(buttonDone);

			buttonEdit.addEventListener("click", () => checkForDisabledAndRun(buttonEdit, () => editElement(element)));
			buttonDone.addEventListener("click", () => console.log("Done"));

			// only if not cancel
			if (text == null) {
				addElementWithDueDate(element);
				addElementWithoutDueDate(element);
			}

			// remove dueDate
			let dueDate = element.getElementsByClassName("dueDatePicker")[0].value;
			if (!dueDate) {
				element.getElementsByClassName("dueDate")[0].remove();
			}
		} else {
			element.parentNode.removeChild(element);
		}

		unlockElements();
	}
}

function lockElements() {
	let buttons = document.getElementsByClassName("button");
	for (let i = buttons.length - 1; i >= 0; --i) {
		// needs to be done
		buttons[i].classList.add("disabled");
	}
}

function unlockElements() {
	let buttons = document.getElementsByClassName("button");
	for (let i = buttons.length - 1; i >= 0; --i) {
		buttons[i].classList.remove("disabled");
	}
}

function checkForDisabledAndRun(element, functionToRun) {
	if (element.classList.contains("disabled")) {
		return;
	}

	functionToRun();
}