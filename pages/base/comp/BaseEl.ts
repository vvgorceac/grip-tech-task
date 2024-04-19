import {Locator} from "@playwright/test";

export class BaseEl {
    readonly locator: Locator;

    constructor(locator: Locator) {
        this.locator = locator;
    }
}