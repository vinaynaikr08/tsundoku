describe("Delete screen", () => {
  beforeAll(async () => {
    //await device.uninstallApp();
    //await device.installApp();
    await device.launchApp();
  }, 60000)

    // Navigate to sign-in screen
    await element(by.id("initial-launch-screen-launch-start-arrow")).tap();
  });

  it("navigate to deletion screen, attempt delete without confirming", async () => {
    await clearSignInFields();
    await typeLoginCredentials(
      "detoxtest@example.com",
      "testing-purposes-only!@!",
    );
    await dismissKeyboard();

    await element(by.id("sign-in-signin-arrow")).tap();
    await element(by.id("navbar-profile-screen")).atIndex(0).tap();
    await element(by.id("profile-tab-scroll-view")).scrollTo("bottom");

    // Due to an upstream bug in Detox, the first tap action is ignored as Detox still scrolls (with the above `scrollTo`)
    // To mitigate this, try tapping on the button twice.
    // This may fail on iOS as the first tap might just go through.
    // TODO: fix this once upstream issue is resolved!
    await element(by.id("profile-tab-delete-account-button")).tap();
    await element(by.id("profile-tab-delete-account-button")).tap();

    // We expect this to do nothing since the confirm checkbox isn't checked
    await element(by.id("delete-account-button")).tap();

    // We should still be on the delete account view by this point
    await expect(element(by.id("delete-account-view"))).toBeVisible();
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
