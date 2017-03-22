﻿
export class ChangeTracker {

    private userSelection;

    public isFirstChange(changes): boolean {
        let isFirstChange = true;
        for (let item in changes) {
            isFirstChange = isFirstChange && changes[item].isFirstChange();
        }
        return isFirstChange;
    };

    public isSelectsOnlyChange(changes): boolean {
        return !!(changes.select) && (Object.keys(changes).length === 1);
    };

    public areSelectsUpdated(changes): boolean {
        if (!changes.select) {
            return false;
        }
        let prev = changes.select.previousValue || [];
        let curr = changes.select.currentValue || [];
        // check if it's a user selection
        if (curr.length === 1 && this.isEqualIntervals(curr[0], this.userSelection)) {
            return false;
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

    public storeUserSelection(intervals): void {
        this.userSelection = (!intervals || !intervals.length) ? null : intervals[0];
    };

    private isEqualIntervals(first, second): boolean {
        if (!first || !second) {
            return false;
        }
        return (first.startTimestamp === second.startTimestamp) &&
            (first.endTimestamp === second.endTimestamp);
    }

};

export default ChangeTracker;