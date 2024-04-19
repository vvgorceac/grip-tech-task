import {BasePage} from "../base/BasePage";
import {Page} from "@playwright/test";
import {TextInput} from "../base/comp/TextInput";
import {BaseEl} from "../base/comp/BaseEl";

export class ForgotPasswordPage extends BasePage {
    readonly email: TextInput;
    readonly header: BaseEl;
    readonly sendTheLinkBtn: BaseEl;
    readonly backToLogin: BaseEl;

    constructor(page: Page) {
        super(page);
        this.email = new TextInput(this.page.locator("//div[contains(@data-test-component,'passwordRecoveryPage__email')]"));
        this.header = new BaseEl(this.page.locator("//h1[@data-test-component='text text--type-heading1']"));
        this.sendTheLinkBtn = new BaseEl(this.page.locator("//button[contains(@data-test-component,'passwordRecoveryPage__sendButton')]"));
        this.backToLogin = new BaseEl(this.page.locator("//a[contains(@data-test-component,'passwordRecoveryPage__goBack')]"));
    }
}