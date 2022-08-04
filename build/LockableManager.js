/**
 * @author Ganko Pi
 */
class LockableManager {
    static htmlObjectsLockable = [];
    /**
     * Adds an event listener which can be disabled.
     * @param {HTMLElement} htmlObject HTML object to which an event listener should be added
     * @param {string} type type of event listener
     * @param {Function} functionToRun function which will be executed if the element is enabled
     */
    static makeLockable(htmlObject, type, functionToRun) {
        this.htmlObjectsLockable.push(htmlObject);
        htmlObject.addEventListener(type, () => {
            if (htmlObject.classList.contains("disabled")) {
                return;
            }
            functionToRun();
        });
    }
    /**
     * Disables all lockable elements.
     */
    static lockElements() {
        this.htmlObjectsLockable.forEach((element) => element.classList.add("disabled"));
    }
    /**
     * Enables all lockable elements.
     */
    static unlockElements() {
        this.htmlObjectsLockable.forEach((element) => element.classList.remove("disabled"));
    }
}
//# sourceMappingURL=LockableManager.js.map