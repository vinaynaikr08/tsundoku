describe("Sign in screen", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.uninstallApp();
    await device.installApp();
    await device.launchApp();

    // Navigate to sign-in screen
    await element(by.id("initial-launch-screen-launch-start-arrow")).tap();
  });

  it("should have sign in screen", async () => {
    await expect(element(by.id("sign-in-view"))).toBeVisible();
  });

  it("try sign in with demo credentials", async () => {
    await clearSignInFields();
    await typeLoginCredentials(
      "detoxtest@example.com",
      "testing-purposes-only!@!",
    );
    await dismissKeyboard();

    await element(by.id("sign-in-signin-arrow")).tap();

    await expect(element(by.id("library-screen-view"))).toBeVisible();
  });

  it("try sign in with bad credentials", async () => {
    await clearSignInFields();
    await typeLoginCredentials(
      "detoxtest@example.com",
      "intentionally-wrong-password",
    );
    await dismissKeyboard();

    await element(by.id("sign-in-signin-arrow")).tap();

    await expect(element(by.id("sign-in-error-modal"))).toBeVisible();
    await expect(element(by.id("sign-in-error-modal-message"))).toHaveText(
      "Invalid credentials. Please check the email and password.",
    );
  });
});

async function clearSignInFields() {
  await element(by.id("sign-in-email-field")).clearText();
  await element(by.id("sign-in-password-field")).clearText();
}

async function typeLoginCredentials(email, password) {
  await element(by.id("sign-in-email-field")).typeText(email);
  await element(by.id("sign-in-password-field")).typeText(password);
}

async function dismissKeyboard() {
  // Dismiss keyboard (or else Detox (and the user) cannot see the sign in arrow)
  await element(by.id("sign-in-password-field")).tapReturnKey();

  // Tap on header to delay (workaround for issue #111)
  // TODO: remove this once the sync issue upstream is fixed!
  await element(by.text("Sign in")).tap();
}
