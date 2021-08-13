/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
import _ from 'lodash';

export class ActionFilter {

    public only;

    /**
     * @var array list of action IDs that this filter should not apply to.
     * @see only
     */
    public except = [];


    public init() {


    }

    public beforeFilter(action) {
        if (!this.isActive(action)) {
            return;
        }
    }

    protected isActive(action) {
        let id = action.id;
        let onlyMatch: boolean = false;
        let exceptMatch: boolean = false;
        if (_.isEmpty(this.only)) {
            onlyMatch = true;
        }

        for (const exceptKey in this.except) {
            let pattern = this.except[exceptKey];
            let match = id.match(pattern)
            if (match.length > 0) {
                exceptMatch = true;
            }
        }

        return !exceptMatch && onlyMatch;
    }
}