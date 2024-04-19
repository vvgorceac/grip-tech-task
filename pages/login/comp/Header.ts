import {Locator} from "@playwright/test";
import {BaseEl} from "../../base/comp/BaseEl";

export class Header extends BaseEl {
    readonly logo: Locator;
    readonly search: Locator;
    // readonly menu: Menu;

    constructor(locator: Locator) {
        super(locator);
        this.logo = this.locator.locator('.logo');
        this.search = this.locator.locator('.search-field');
        // this.menu = new Menu(this.locator.locator('.nav_menu'));
    }


}

// class Menu {
//     readonly menu: Locator;
//     readonly docs: Locator;
//     readonly api: Locator;
//
//     constructor(locator: Locator) {
//         this.menu = locator;
//         this.docs = this.menu.locator('.docs');
//         this.api = this.menu.locator('.api');
//     }
// }