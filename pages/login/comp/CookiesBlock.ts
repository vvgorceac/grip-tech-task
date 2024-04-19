import {BaseEl} from "../../base/comp/BaseEl";
import {Locator} from "@playwright/test";

export class CookiesBlock extends BaseEl {
    readonly caption: BaseEl;
    readonly learnMore: BaseEl;
    readonly accept: BaseEl;

    constructor(locator: Locator) {
        super(locator);
        this.caption = new BaseEl(locator.locator("//div[contains(@data-test-component,' text--type-plain')]"))
        this.learnMore = new BaseEl(locator.locator("//a[contains(@data-test-component,'textLink')]"))
        this.accept = new BaseEl(locator.locator("//button[contains(@data-test-component,'cookiesConsentBanner__acceptButton')]"))
    }
}