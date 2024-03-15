describe("Sign in screen", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();

    // Navigate to sign-in screen
    await element(by.id("initial-launch-screen-launch-start-arrow")).tap();
  });

  it("should have sign in screen", async () => {
    await expect(element(by.id("sign-in-view"))).toBeVisible();
  });

  it("try sign in with demo credentials", async () => {
    // Clear fields if populated
    await element(by.id("sign-in-email-field")).clearText();
    await element(by.id("sign-in-password-field")).clearText();

    await element(by.id("sign-in-email-field")).typeText(
      "detoxtest@example.com",
    );
    await element(by.id("sign-in-password-field")).typeText(
      "testing-purposes-only!@!",
    );

    // Dismiss keyboard (or else Detox (and the user) cannot see the sign in arrow)
    await element(by.id('sign-in-password-field')).tapReturnKey();

    await element(by.id("sign-in-signin-arrow")).tap();

    await expect(element(by.id("library-screen-view"))).toBeVisible();
  });
});
