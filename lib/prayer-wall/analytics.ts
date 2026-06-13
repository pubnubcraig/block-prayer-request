type PrayerWallEvent =
  | { event: 'prayer_wall_share'; slug: string; displayNameType: string }
  | { event: 'prayer_wall_prayed'; slug: string }
  | { event: 'prayer_wall_share_click'; slug: string; platform: string }
  | { event: 'prayer_wall_view'; slug: string };

export function logPrayerWallEvent(data: PrayerWallEvent): void {
  console.log('[prayer-wall]', JSON.stringify(data));
}
