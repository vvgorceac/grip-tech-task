import {expect, test as base} from '@playwright/test';
import {LoginPage} from "../pages/login/LoginPage";
import {PrivacyPolicyPage} from "../pages/privacypolicy/PrivacyPolicyPage";
import {HomePage} from "../pages/home/HomePage";
import {emailTestSet} from "../test-data/emailTestSet";
import {passwordTestSet} from "../test-data/passwordTestSet";
import {ForgotPasswordPage} from "../pages/forgot-password/ForgotPasswordPage";
import {PasswordRecoveryConfirmationPage} from "../pages/forgot-password/PasswordRecoveryConfirmationPage";
import {SignUpPage} from "../pages/sign-up/SignUpPage";

type PageFixture = {
    loginPage: LoginPage;
    homePage: HomePage;
    forgotPasswordPage: ForgotPasswordPage;
    passwordRecoveryConfirmationPage: PasswordRecoveryConfirmationPage;
    signUpPage: SignUpPage;
}

const test = base.extend<PageFixture>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({page}, use) => {
        await use(new HomePage(page));
    },
    forgotPasswordPage: async ({page}, use) => {
        await use(new ForgotPasswordPage(page));
    },
    passwordRecoveryConfirmationPage: async ({page}, use) => {
        await use(new PasswordRecoveryConfirmationPage(page));
    },
    signUpPage: async ({page}, use) => {
        await use(new SignUpPage(page));
    },
});


test.describe('Log in page', () => {

    test.beforeEach(async ({loginPage}) => {
        await test.step("Open login page", async () => {
            await loginPage.goto();
        });
    });

    test('has title', async ({loginPage}) => {
        await expect(loginPage.page).toHaveTitle(/Grip/);
    });

    test('has all elements', async ({loginPage}) => {
        await expect(loginPage.logo.locator).toBeVisible();
        await expect(loginPage.caption.locator).toBeVisible();
        await expect(loginPage.loginForm.locator).toBeVisible();
    });

    test('has cookies banner', async ({loginPage}) => {
        await expect(loginPage.cookiesBlock.caption.locator).toBeVisible();
        await expect(loginPage.cookiesBlock.learnMore.locator).toBeVisible();
        await expect(loginPage.cookiesBlock.accept.locator).toBeVisible();
    });


    test('accept cookies', async ({loginPage}) => {

        await test.step('Click accept cookies', async () => {
            await expect(loginPage.cookiesBlock.accept.locator).toBeVisible();
            await loginPage.cookiesBlock.accept.locator.click();
        })

        await test.step('Check banner is not displayed', async () => {
            await expect(loginPage.cookiesBlock.accept.locator).not.toBeVisible();
        })
        await test.step('Check cookies value is correct', async () => {
            let cookies = await loginPage.page.context().cookies()
            let cookieValue = cookies.find(cookie => cookie.name === 'grip-cookiesConsent').value;
            expect(cookieValue).toBe('accepted');
        })
    });

    test('cookies learn more link', async ({loginPage, context}) => {

        await test.step('Click learn more link on cookies bar', async () => {
            await expect(loginPage.cookiesBlock.learnMore.locator).toBeVisible();
            await loginPage.cookiesBlock.learnMore.locator.click();
        })

        await test.step('Check user is navigated to the learn more page', async () => {
            const newPage = await context.waitForEvent('page');
            await newPage.waitForLoadState();
            let privacyPolicyPage = new PrivacyPolicyPage(newPage);
            await expect(privacyPolicyPage.header.locator).toHaveText('Privacy Policy');
            await expect(privacyPolicyPage.page).toHaveURL(`${process.env.baseURL}/privacy-policy`);
        })
    });

    test('Log in with valid credentials', async ({loginPage, homePage}) => {

        await test.step('Enter valid credentials', async () => {
            let validLogin = "valid@email.com"; //just a plain example
            let validPassword = "secret1!#$%"; //just a plain example

            await expect(loginPage.loginForm.locator).toBeVisible();
            await loginPage.logInWith(validLogin, validPassword);
        })

        await test.step('Check user is logged in', async () => {
            await expect(homePage.page).toHaveTitle("Home page"); //forcing failure, since we don't know how real page would look like
        })
    });


    test('Log in with sql injection', async ({loginPage}) => {

        await test.step('Enter credentials with sql injection', async () => {
            let validLogin = "admin@admin.com"; //just a plain example
            let validPassword = "\"x or \"\"x=x\""; //just a plain example

            await expect(loginPage.loginForm.locator).toBeVisible();
            await loginPage.logInWith(validLogin, validPassword);
        })

        await test.step('Check user is not logged in', async () => {
            await expect(loginPage.loginForm.password.errorMessage.locator).toBeVisible();
            await expect(loginPage.loginForm.password.errorMessage.locator).toHaveText("Invalid email or password");
        })
    });

    test('Log in & Password with leading and trailing spaces', async ({loginPage, homePage}) => {
        const reqPromise = loginPage.page.waitForRequest(resp => resp.url().includes('v3/auth/login'));
        let validLogin = " valid@email.com ";
        let validPassword = " secret1!#$% ";
        let request;
        await test.step('Enter log in and password with spaces', async () => {
            await expect(loginPage.loginForm.locator).toBeVisible();
            await loginPage.logInWith(validLogin, validPassword);
        })

        await test.step('Check email is trimmed', async () => {
            request = await reqPromise;
            expect(request.postDataJSON()).toHaveProperty('email', validLogin.trim())
        })

        await test.step('Check password is not changed', async () => {
            console.log(request.postDataJSON())
            expect(request.postDataJSON()).toHaveProperty('password', validPassword)
        })
    });

    test('Log in with wrong credentials', async ({loginPage}) => {

        await test.step('Enter wrong credentials', async () => {
            let validLogin = "invalid@email.com";
            let validPassword = "secret1!#$%";

            await expect(loginPage.loginForm.locator).toBeVisible();
            await loginPage.logInWith(validLogin, validPassword);
        })

        await test.step('Check user is not logged in', async () => {
            await expect(loginPage.loginForm.password.errorMessage.locator).toBeVisible();
            await expect(loginPage.loginForm.password.errorMessage.locator).toHaveText("Invalid email or password");
        })
    });

    emailTestSet.forEach(row => {
        test(`Email ${row.testName}`, async ({loginPage}) => {
            if (row.email.length == 0) {
                //Triggering validation for empty email
                await loginPage.loginForm.login.sendText("this will be removed");
                await loginPage.loginForm.login.clear();
            }
            await loginPage.loginForm.login.sendText(row.email);
            await loginPage.loginForm.password.locator.click(); //to remove focus from email field and trigger validation
            if (row.errorMessage.length == 0) {
                await expect(loginPage.loginForm.login.errorMessage.locator).not.toBeVisible();
                await expect(loginPage.loginForm.login.errorMessage.locator).toBeEmpty();
            } else {
                await expect(loginPage.loginForm.login.errorMessage.locator).toBeVisible();
                await expect(loginPage.loginForm.login.errorMessage.locator).toHaveText(row.errorMessage);
            }
        });
    })

    passwordTestSet.forEach(row => {
        test(`Password ${row.testName}`, async ({loginPage}) => {
            if (row.password.length == 0) {
                //Triggering validation for empty email
                await loginPage.loginForm.password.sendText("this will be removed");
                await loginPage.loginForm.password.clear();
            }
            await loginPage.loginForm.password.sendText(row.password);
            await loginPage.loginForm.login.locator.click(); //to remove focus from email field and trigger validation
            if (row.errorMessage.length == 0) {
                await expect(loginPage.loginForm.password.errorMessage.locator).not.toBeVisible();
                await expect(loginPage.loginForm.password.errorMessage.locator).toBeEmpty();
            } else {
                await expect(loginPage.loginForm.password.errorMessage.locator).toBeVisible();
                await expect(loginPage.loginForm.password.errorMessage.locator).toHaveText(row.errorMessage);
            }
        });
    })


    test('Forgot your password back to log in', async ({loginPage, forgotPasswordPage}) => {
        let email = "some@email.com";
        await test.step('Fill in email in the log in form', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible();
            await loginPage.loginForm.login.sendText(email);
        })
        await test.step('Switch to Forgot your password form', async () => {
            await loginPage.loginForm.forgotYourPasswordLink.locator.click();
        })

        await test.step('Switch back to log in form', async () => {
            await expect(forgotPasswordPage.backToLogin.locator).toBeVisible();
            await forgotPasswordPage.backToLogin.locator.click();
        })


        await test.step('Check email input is still populated', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible()
            await expect(loginPage.loginForm.login.input.locator).toHaveText(email)
        })
    });


    test('Forgot your password - default flow', async ({
                                                           loginPage,
                                                           forgotPasswordPage,
                                                           passwordRecoveryConfirmationPage
                                                       }) => {
        let email = "some@email.com";
        await test.step('Fill in email in the log in form', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible();
            await loginPage.loginForm.login.sendText(email);
        })
        await test.step('Switch to Forgot your password form', async () => {
            await loginPage.loginForm.forgotYourPasswordLink.locator.click();
        })
        await test.step('Click send the link', async () => {
            await expect(forgotPasswordPage.sendTheLinkBtn.locator).toBeVisible();
            await forgotPasswordPage.sendTheLinkBtn.locator.click();
        })

        let restorePasswordRequest = forgotPasswordPage.page.waitForRequest(resp => resp.url().includes('restore_password'));

        await test.step('Restore password request contains entered email', async () => {
            let request = await restorePasswordRequest;
            expect(request.postDataJSON()).toHaveProperty('email', email)
        })

        await test.step('User is navigated to the password recovery confirmation page', async () => {
            await expect(passwordRecoveryConfirmationPage.header.locator).toBeVisible();
        })
        await test.step('Click back to log in', async () => {
            await expect(passwordRecoveryConfirmationPage.backToLogin.locator).toBeVisible();
            await passwordRecoveryConfirmationPage.backToLogin.locator.click();
        })

        await test.step('User is on log in page', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible()
        })
    });

    test('Forgot your password - update email', async ({
                                                           loginPage,
                                                           forgotPasswordPage,
                                                           passwordRecoveryConfirmationPage
                                                       }) => {
        let email = "some@email.com";
        await test.step('Fill in email in the log in form', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible();
            await loginPage.loginForm.login.sendText(email);
        })
        await test.step('Switch to Forgot your password form', async () => {
            await loginPage.loginForm.forgotYourPasswordLink.locator.click();
        })

        await test.step('Update email', async () => {
            await expect(forgotPasswordPage.email.locator).toBeVisible();
            email = "new_" + email;
            await forgotPasswordPage.email.clear();
            await forgotPasswordPage.email.sendText(email);
        })

        await test.step('Click send the link', async () => {
            await expect(forgotPasswordPage.sendTheLinkBtn.locator).toBeVisible();
            await forgotPasswordPage.sendTheLinkBtn.locator.click();
        })

        let restorePasswordRequest = forgotPasswordPage.page.waitForRequest(resp => resp.url().includes('restore_password'));

        await test.step('Restore password request contains entered email', async () => {
            let request = await restorePasswordRequest;
            expect(request.postDataJSON()).toHaveProperty('email', email)
        })

        await test.step('User is navigated to the password recovery confirmation page', async () => {
            await expect(passwordRecoveryConfirmationPage.header.locator).toBeVisible();
        })
        await test.step('Click back to log in', async () => {
            await expect(passwordRecoveryConfirmationPage.backToLogin.locator).toBeVisible();
            await passwordRecoveryConfirmationPage.backToLogin.locator.click();
        })

        await test.step('User is on log in page', async () => {
            await expect(loginPage.loginForm.login.locator).toBeVisible()
        })
    });

    emailTestSet.forEach(row => {
        test(`Restore password email ${row.testName}`, async ({loginPage, forgotPasswordPage}) => {

            await test.step('Switch to Forgot your password form', async () => {
                await expect(loginPage.loginForm.forgotYourPasswordLink.locator).toBeVisible();
                await loginPage.loginForm.forgotYourPasswordLink.locator.click();
            })

            await test.step('Switch to Forgot your password form', async () => {
                if (row.email.length == 0) {
                    //Triggering validation for empty email
                    await forgotPasswordPage.email.sendText("this will be removed");
                    await forgotPasswordPage.email.clear();
                }
                await forgotPasswordPage.email.sendText(row.email);
                await forgotPasswordPage.header.locator.click(); //to remove focus from email field and trigger validation
                if (row.errorMessage.length == 0) {
                    await expect(forgotPasswordPage.email.errorMessage.locator).not.toBeVisible();
                    await expect(forgotPasswordPage.email.errorMessage.locator).toBeEmpty();
                } else {
                    await expect(forgotPasswordPage.email.errorMessage.locator).toBeVisible();
                    await expect(forgotPasswordPage.email.errorMessage.locator).toHaveText(row.errorMessage);
                }
            })
        });
    })

    test('Sign up', async ({loginPage, signUpPage}) => {

        await test.step('Click sign up button', async () => {
            await expect(loginPage.signUpBtn.locator).toBeVisible();
            await loginPage.signUpBtn.locator.click();
        })

        await test.step('Check user is navigated to the sign up page', async () => {
            await expect(signUpPage.page).toHaveURL(`${process.env.baseURL}/sign-up`);
        })
    });
});

