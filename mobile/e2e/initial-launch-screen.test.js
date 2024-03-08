describe('Initial launch screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have initial launch screen', async () => {
    await expect(element(by.id('initial-launch-screen-view'))).toBeVisible();
  });

  it('should show sign in screen after arrow tap', async () => {
    await element(by.id('initial-launch-screen-launch-start-arrow')).tap();
    await expect(element(by.text('Sign in'))).toBeVisible();
  });
});
