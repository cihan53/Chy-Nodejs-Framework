/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */
// @ts-ignore
import {NextFunction, Request, Response} from "express";
import Utils from "../requiments/Utils";
import {Behavior} from "./Behavior";

export class ActionFilter extends Behavior {

    public only: any;

    /**
     * @var array list of action IDs that this filter should not apply to.
     * @see only
     */
    public except = [];


    public init() {

    }

    public async beforeFilter(route: any, req: Request, res: Response) {
        if (!this.isActive(route)) {
            return;
        }

        await this.beforeAction(route, req, res)
    }

    protected isActive(action: any) {
        let id = action.id;
        let onlyMatch: boolean = false;
        let exceptMatch: boolean = false;
        if (Utils.isEmpty(this.only)) {
            onlyMatch = true;
        } else {
            onlyMatch = false;
            for (const onlyKey of this.only) {
                if (Utils.matchWildcard(action.id, onlyKey)) {
                    onlyMatch = true;
                    break;
                }
            }
        }

        for (const exceptKey in this.except) {
            let pattern = this.except[exceptKey];
            let match = id.match(pattern)
            if (match && match.length > 0) {
                exceptMatch = true;
            }
        }

        return !exceptMatch && onlyMatch;
    }

    /**
     * This method is invoked right before an action is to be executed (after all possible filters.)
     * You may override this method to do last-minute preparation for the action.
     * @param Action $action the action to be executed.
     * @return bool whether the action should continue to be executed.
     */
    public async beforeAction(route: any, req: Request, res: Response) {
        return true;
    }
}