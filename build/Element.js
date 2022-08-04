import { getHeight, getOverlappingCategory, getWidth } from "./functions.js";
import { Placeholder } from "./Placeholder.js";
/**
 * @author Ganko Pi
 */
export class Element {
    creationDate;
    htmlObject;
    placeholder;
    container;
    relativeMouseOffsetX;
    relativeMouseOffsetY;
    /**
     * Constructor for an element which manages a HTML object with a custom date of creation.
     * @param {Date} creationDate the date on which the element was first created
     */
    constructor(creationDate) {
        this.creationDate = creationDate;
        this.htmlObject = null;
        this.placeholder = null;
        this.container = null;
        this.relativeMouseOffsetX = 0;
        this.relativeMouseOffsetY = 0;
    }
    /**
     * Makes this element follow the cursor in the HTML page if a dragArea of this element is held.
     */
    makeDraggable() {
        let dragAreas = this.htmlObject.querySelectorAll(".dragArea");
        dragAreas.forEach((dragArea) => LockableManager.makeLockable(dragArea, "mousedown", this.initDraggable));
    }
    /**
     * Changes the state of this element that it can be moved in the HTML page and replaces the previous position with a placeholder.
     * @param {Event} event the event which caused the call of this method
     */
    initDraggable(event) {
        if (!event) {
            event = window.event;
        }
        if (!(event instanceof MouseEvent)) {
            return;
        }
        let mouseEvent = event;
        mouseEvent.preventDefault();
        this.relativeMouseOffsetX = mouseEvent.pageX - this.htmlObject.getBoundingClientRect().left;
        this.relativeMouseOffsetY = mouseEvent.pageY - this.htmlObject.getBoundingClientRect().top;
        LockableManager.lockElements();
        this.makeElementAbsoluteAndSetPlaceholder();
        document.addEventListener("mousemove", this.drag);
        document.addEventListener("mouseup", this.endDragging);
    }
    /**
     * Updates the position of this element and changes the position of the placeholder if needed.
     * @param {Event} event the event which caused the call of this method
     */
    drag(event) {
        if (!event) {
            event = window.event;
        }
        if (!(event instanceof MouseEvent)) {
            return;
        }
        let mouseEvent = event;
        mouseEvent.preventDefault();
        // set position of object dependent to mouse position
        this.htmlObject.style.left = (mouseEvent.pageX - this.relativeMouseOffsetX) + "px";
        this.htmlObject.style.top = (mouseEvent.pageY - this.relativeMouseOffsetY) + "px";
        let category = getOverlappingCategory(this.htmlObject);
        // end early if the object does not overlap with a category
        if (!category) {
            return;
        }
        this.movePlaceholder(category);
    }
    /**
     * Sets this element at the position of the placeholder and ends the ability to move.
     */
    endDragging() {
        document.removeEventListener("mousemove", this.drag);
        document.removeEventListener("mouseup", this.endDragging);
        this.resetElementAndSetAtPositionOfPlaceholder();
        LockableManager.unlockElements();
    }
    /**
     * Sets a placeholder at the position of this.htmlObject and makes this.htmlObject absolute so it can be moved around without affecting other elements.
     */
    makeElementAbsoluteAndSetPlaceholder() {
        // get position on screen
        this.htmlObject.style.left = this.htmlObject.getBoundingClientRect().left + "px";
        this.htmlObject.style.top = this.htmlObject.getBoundingClientRect().top + "px";
        // get current dimensions
        this.htmlObject.style.height = getHeight(this.htmlObject, false, false, false) + "px";
        this.htmlObject.style.width = getWidth(this.htmlObject, false, false, false) + "px";
        // replace this.htmlObject with a placeholder
        this.placeholder = new Placeholder(this);
        this.container.replaceElementWithPlaceholder(this, this.placeholder);
        // make this.htmlObject absolute to move it around without affecting other elements
        this.htmlObject.style.position = "absolute";
        this.htmlObject.style.zIndex = "10";
    }
    /*
     * Sets this.htmlObject at the position of this.placeholder and removes this.placeholder.
     */
    resetElementAndSetAtPositionOfPlaceholder() {
        // reset inline style
        this.htmlObject.style.left = "";
        this.htmlObject.style.top = "";
        this.htmlObject.style.height = "";
        this.htmlObject.style.width = "";
        this.htmlObject.style.position = "";
        this.htmlObject.style.zIndex = "";
        if (this.placeholder) {
            this.container.setElementAtPositionOfPlaceholder(this, this.placeholder);
            this.placeholder = null;
        }
    }
    /**
     * Tests if the midpoint of a given HTML object is in the bounding box of the HTML object of this element.
     * @param {HTMLElement} object the HTML object which midpoint is tested
     * @returns if the given HTML object overlaps with this element
     */
    doesOverlap(object) {
        // calculate midpoint of the passed object
        let midpointObjectX = object.getBoundingClientRect().left + (getWidth(object, false, false, false) / 2);
        let midpointObjectY = object.getBoundingClientRect().top + (getHeight(object, false, false, false) / 2);
        // calculate positions of the borders of this element
        let leftBorderThis = this.htmlObject.getBoundingClientRect().left;
        let rightBorderThis = leftBorderThis + getWidth(this.htmlObject, true, true, false);
        let topBorderThis = this.htmlObject.getBoundingClientRect().top;
        let bottomBorderThis = topBorderThis + getHeight(this.htmlObject, true, true, false);
        // return if midpoint lies in between the borders
        return (midpointObjectX > leftBorderThis && midpointObjectX < rightBorderThis &&
            midpointObjectY > topBorderThis && midpointObjectY < bottomBorderThis);
    }
    /**
     * Removes all children from a given HTML element
     * @param {HTMLElement} element the element from which all children should be removed
     */
    removeAllChildren(element) {
        while (element.firstChild) {
            element.firstChild.remove();
        }
    }
    /**
     * Returns the managed HTML object.
     * @returns the managed HTML object
     */
    getHTMLObject() {
        return this.htmlObject;
    }
}
//# sourceMappingURL=Element.js.map