import {BasePage} from "../base/BasePage";
import {Page} from "@playwright/test";

//Abstract page that user should see when he is logged in
export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
}