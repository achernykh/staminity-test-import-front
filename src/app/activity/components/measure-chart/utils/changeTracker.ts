
export class ChangeTracker {

    private userSelection;

    isFirstChange(changes): boolean {
        let isFirstChange = true;
        for (const item in changes) {
            isFirstChange = isFirstChange && changes[item].isFirstChange();
        }
        return isFirstChange;
    };

    isZoomOnlyChange(changes): boolean {
        const zoomChanges = ["autoZoom", "zoomInClick", "zoomOutClick"];
        return Object.keys(changes).every((c) => zoomChanges.indexOf(c) !== -1);
    };

    isSelectsOnlyChange(changes): boolean {
        return !!(changes.select) && ((Object.keys(changes).length === 1) || (Object.keys(changes).length === 0));
    };

    areSelectsUpdated(changes): boolean {
        if (!changes.select) {
            return false;
        }
        const prev = changes.select.previousValue || [];
        const curr = changes.select.currentValue || [];
        // check if it's a user selection
        if (this.isUserSelection(curr)) {
            return false;
        }
        if (curr.length === 0 && !this.userSelection) {
            return true; //false;
        }
        if (prev.length !== curr.length) {
            return true;
        }
        // compare selected intervals one by one
        // assume that all intervals are ordered by time
        for (let i = 0; i < prev.length; i++) {
            if (!this.isEqualIntervals(prev[i], curr[i])) {
                return true;
            }
        }
        return false;
    };

    isUserSelection(select): boolean {
        if (select && select.length === 1) {
            return this.isEqualIntervals(select[0], this.userSelection);
        }
        return false;
    }

    storeUserSelection(intervals): void {
        this.userSelection = (!intervals || !intervals.length) ? null : intervals[0];
    };

    resetUserSelection(): void {
        this.userSelection = null;
    }

    private isEqualIntervals(first, second): boolean {
        if (!first && !second) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        return (first.startTimestamp === second.startTimestamp) &&
            (first.endTimestamp === second.endTimestamp);
    }

};

export default ChangeTracker;
