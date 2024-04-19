import {Page} from "@playwright/test";
import {BasePage} from "../base/BasePage";
import {BaseEl} from "../base/comp/BaseEl";

export class PrivacyPolicyPage extends BasePage {
    readonly header: BaseEl;

    constructor(page: Page) {
        super(page);
        this.header = new BaseEl(page.locator("//h1[@data-test-component='text text--type-heading0']"));
    }
}



