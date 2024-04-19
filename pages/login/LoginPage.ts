import {Page} from "@playwright/test";
import {LoginForm} from "./comp/LoginForm";
import {BasePage} from "../base/BasePage";
import {BaseEl} from "../base/comp/BaseEl";
import {CookiesBlock} from "./comp/CookiesBlock";

export class LoginPage extends BasePage {
    readonly logo: BaseEl;
    readonly caption: BaseEl;
    readonly loginForm: LoginForm;
    readonly signUpBtn: BaseEl;
    readonly cookiesBlock: CookiesBlock;


    constructor(page: Page) {
        super(page);
        this.logo = new BaseEl(page.locator("//div[contains(@data-test-component,'gripLogo')]"));
        this.caption = new BaseEl(page.locator("//div[contains(@data-test-component,'gripLogo')]//following-sibling::div"));
        this.loginForm = new LoginForm(page.locator('//form/parent::div'));
        this.signUpBtn = new BaseEl(page.locator('//button[contains(@data-test-component,"loginPage__signUpButton")]'));
        this.cookiesBlock = new CookiesBlock(page.locator('//div[@data-test-component="cookiesConsentBanner"]'));
    }

    async goto() {
        await this.page.goto("/login");
    }

    async logInWith(login: string, password: string) {
        const responsePromise = this.page.waitForResponse(resp => resp.url().includes('login'));
        await this.loginForm.fillWith(login, password);
        await this.loginForm.submit();
        await responsePromise;
    }
}



