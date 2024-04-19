import {Locator} from "@playwright/test";
import {BaseEl} from "../../base/comp/BaseEl";
import {TextInput} from "../../base/comp/TextInput";

export class LoginForm extends BaseEl {
    readonly login: TextInput;
    readonly password: TextInput;
    readonly loginBtn: BaseEl;
    readonly forgotYourPasswordLink: BaseEl;

    constructor(locator: Locator) {
        super(locator);
        this.login = new TextInput(this.locator.locator('//div[@data-test-component="loginPage__email field"]'))
        this.password = new TextInput(this.locator.locator('//div[@data-test-component="loginPage__password field"]'))
        this.loginBtn = new BaseEl(this.locator.locator('//button[contains(@data-test-component,"loginPage__loginButton")]'))
        this.forgotYourPasswordLink = new BaseEl(this.locator.locator('//a[contains(@data-test-component,"loginPage__passwordRecovery")]'))
    }


    async fillWith(login: string, password: string) {
        await this.login.sendText(login);
        await this.password.sendText(password);
    }

    async submit() {
        await this.loginBtn.locator.click()
    }
}