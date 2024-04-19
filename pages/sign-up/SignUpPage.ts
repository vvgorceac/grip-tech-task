import {BasePage} from "../base/BasePage";
import {Page} from "@playwright/test";

export class SignUpPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
}