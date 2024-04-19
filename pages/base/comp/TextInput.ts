import {BaseEl} from "./BaseEl";
import {Locator} from "@playwright/test";

export class TextInput extends BaseEl {
    readonly input: BaseEl;
    readonly errorMessage: BaseEl;

    constructor(locator: Locator) {
        super(locator);
        this.input = new BaseEl(this.locator.locator("//input"));
        this.errorMessage = new BaseEl(this.locator.locator("//div[contains(@data-test-component,'field__error')]"));
    }

    async sendText(validLogin: string) {
        await this.input.locator.fill(validLogin);
    }

    async clear() {
        await this.input.locator.clear()
    }
}