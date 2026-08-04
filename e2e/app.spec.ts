import { expect, test } from '@playwright/test';

// Matches GP_ID in e2e/fixtures/seed.ts.
const GP_ID = 1900000001;

test('renders the seeded 1900 season GP tile', async ({ page }) => {
  await page.goto('/?year=1900');

  await expect(page.getByText('Test Grand Prix')).toBeVisible();
  await expect(page.getByText('Test Winner').first()).toBeVisible();
});

test('renders the race session weather (air, track, humidity)', async ({
  page,
}) => {
  await page.goto('/?year=1900');

  // Fixture's race session (e2e/fixtures/seed.ts): air_temp 22, track_temp 28,
  // humidity 45. Air/track render through `Number().toFixed(1)`; humidity
  // renders the raw NUMERIC(5,2) string as-is, hence the "45.00" not "45".
  await expect(page.getByText('22.0 C°')).toBeVisible();
  await expect(page.getByText('28.0 C°')).toBeVisible();
  await expect(page.getByText('45.00 %')).toBeVisible();
});

test('navigates to the GP detail page via the view link', async ({ page }) => {
  await page.goto('/?year=1900');

  await page.getByText('View →').click();

  await expect(page).toHaveURL(new RegExp(`/gp/${GP_ID}-race$`));
  await expect(page.getByText('Test Grand Prix')).toBeVisible();
  // Race tab is the default (a race session exists), so the race results
  // table's driver names should be visible without any extra clicks.
  await expect(page.getByText('Test Winner').first()).toBeVisible();
  await expect(page.getByText('Test Runner Up').first()).toBeVisible();
});
