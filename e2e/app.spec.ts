import { expect, test } from '@playwright/test';
import { GP_ID } from './fixtures/constants.ts';

// Matches IDs in e2e/fixtures/constants.ts. Each GP tile exposes a `data-testid`
// of `${gpId}-${sessionType}` (app/components/GPSummary.tsx), matching the
// URL key — so getByTestId() resolves to exactly one tile.
const RACE_TILE_ID = `${GP_ID}-race`;
const SPRINT_TILE_ID = `${GP_ID}-sprint`;

test('renders the seeded 1900 season GP tile', async ({ page }) => {
  await page.goto('/?year=1900');

  await expect(page.getByText('Test Grand Prix').first()).toBeVisible();
  await expect(page.getByText('Test Winner').first()).toBeVisible();
});

test('renders the race session weather (air, track, humidity)', async ({
  page,
}) => {
  await page.goto('/?year=1900');

  // Fixture's race session (e2e/fixtures/seed.ts): air_temp 22, track_temp 28,
  // humidity 45. Air/track render through `Number().toFixed(1)`; humidity
  // renders the raw NUMERIC(5,2) string as-is, hence the "45.00" not "45".
  const raceTile = page.getByTestId(RACE_TILE_ID);

  await expect(raceTile.getByText('22.0 C°')).toBeVisible();
  await expect(raceTile.getByText('28.0 C°')).toBeVisible();
  await expect(raceTile.getByText('45.00 %')).toBeVisible();
});

test('renders the sprint tile for the sprint weekend', async ({ page }) => {
  await page.goto('/?year=1900');

  const sprintTile = page.getByTestId(SPRINT_TILE_ID);
  await expect(sprintTile).toBeVisible();
  // Sprint winner is the runner-up (seeded as sprint P1).
  await expect(sprintTile.getByText('Test Runner Up')).toBeVisible();
});

test('renders the future GP tile (qualifying only, no race yet)', async ({
  page,
}) => {
  await page.goto('/?year=1900');

  await expect(page.getByText('Future Grand Prix')).toBeVisible();
  // No race session → no winner; pole comes from qualifying.
  await expect(page.getByText('Test Pole Sitter')).toBeVisible();
});

test('navigates to the GP detail page via the view link', async ({ page }) => {
  await page.goto('/?year=1900');

  await page.getByTestId(RACE_TILE_ID).getByText('View →').click();

  await expect(page).toHaveURL(new RegExp(`/gp/${GP_ID}-race$`));
  await expect(page.getByText('Test Grand Prix')).toBeVisible();
  // Race tab is the default (a race session exists), so the race results
  // table's driver names should be visible without any extra clicks.
  await expect(page.getByText('Test Winner').first()).toBeVisible();
  await expect(page.getByText('Test Runner Up').first()).toBeVisible();
});

test('shows driver and team standings on the race detail page', async ({
  page,
}) => {
  // Race-session standings are cumulative (sprint + race points).
  // Winner:      7 (sprint P2) + 25 (race P1) = 32 pts.
  // Runner-up:   8 (sprint P1) + 18 (race P2) = 26 pts.
  // Test Team:  32 + 26 = 58 pts.
  await page.goto(`/gp/${GP_ID}-race?tab=drivers`);
  await expect(page.getByText('32', { exact: true })).toBeVisible();
  await expect(page.getByText('26', { exact: true })).toBeVisible();

  await page.goto(`/gp/${GP_ID}-race?tab=teams`);
  await expect(page.getByText('58', { exact: true })).toBeVisible();
});

test('shows driver and team standings on the sprint detail page', async ({
  page,
}) => {
  // Sprint-session standings reflect the sprint only.
  // Runner-up (sprint P1):  8 pts.  Winner (sprint P2):  7 pts.
  // Test Team:  8 + 7 = 15 pts.
  await page.goto(`/gp/${GP_ID}-sprint?tab=drivers`);
  await expect(page.getByText('8', { exact: true })).toBeVisible();
  await expect(page.getByText('7', { exact: true })).toBeVisible();

  await page.goto(`/gp/${GP_ID}-sprint?tab=teams`);
  await expect(page.getByText('15', { exact: true })).toBeVisible();
});
