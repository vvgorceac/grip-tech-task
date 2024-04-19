import {BasePage} from "../base/BasePage";
import {Page} from "@playwright/test";
import {BaseEl} from "../base/comp/BaseEl";

export class PasswordRecoveryConfirmationPage extends BasePage {
    readonly header: BaseEl;
    readonly backToLogin: BaseEl;

    constructor(page: Page) {
        super(page);
        this.header = new BaseEl(this.page.locator("//h1[@data-test-component='text text--type-heading1']"));
        this.backToLogin = new BaseEl(this.page.locator("//a[contains(@data-test-component,'passwordRecoveryPage__goBack')]"));
    }
}