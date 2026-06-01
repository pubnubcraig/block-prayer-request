'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useSession, signOut } from 'next-auth/react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  DENOMINATIONS,
  FAITH_STAGES,
  SEX_OPTIONS,
  MARITAL_STATUSES,
  EMPLOYMENT_STATUSES,
  PRAYER_TOPICS,
  PRAYER_HISTORY_MODES,
  BIBLE_VERSIONS,
  TIMEZONES,
} from '@/lib/constants/profile-options';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

const selectClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] cursor-pointer';

const labelClass =
  'block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5';

const HISTORY_MODE_LABELS: Record<string, string> = {
  'save-all': 'Save all prayers automatically',
  'save-per-request': 'Ask me each time',
  'do-not-save': 'Do not save prayer history',
};

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();

  const [favoriteVerse, setFavoriteVerse] = useState('');
  const [bibleVersion, setBibleVersion] = useState('NIV');
  const [denomination, setDenomination] = useState('');
  const [faithStage, setFaithStage] = useState('');
  const [prayerTopics, setPrayerTopics] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [churchName, setChurchName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [prayerHistoryMode, setPrayerHistoryMode] = useState('save-per-request');

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Profile picture state
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) return;
        const data = await res.json();
        if (data.profile) {
          setFavoriteVerse(data.profile.favoriteVerse || '');
          setBibleVersion(data.profile.bibleVersion || 'NIV');
          setDenomination(data.profile.denomination || '');
          setFaithStage(data.profile.faithStage || '');
          setPrayerTopics(data.profile.prayerTopics || []);
          setDateOfBirth(data.profile.dateOfBirth || '');
          setSex(data.profile.sex || '');
          setMaritalStatus(data.profile.maritalStatus || '');
          setOccupation(data.profile.occupation || '');
          setChurchName(data.profile.churchName || '');
          setTimezone(data.profile.timezone || '');
          setPrayerHistoryMode(
            data.profile.prayerHistoryMode || 'save-per-request',
          );
        }
      } catch {
        // Silently fail — user sees empty form
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (session?.user?.image) {
      setAvatarUrl(session.user.image);
    }
  }, [session?.user?.image]);

  function toggleTopic(topic: string) {
    setPrayerTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic],
    );
  }

  async function handleAvatarUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be under 2 MB.');
      return;
    }

    setUploadingAvatar(true);
    setAvatarError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setAvatarError(data.error || 'Failed to upload image.');
        return;
      }

      const data = await res.json();
      setAvatarUrl(data.url);
      await updateSession({ image: data.url });
    } catch {
      setAvatarError('Network error. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    setUploadingAvatar(true);
    setAvatarError('');
    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setAvatarError(data.error || 'Failed to remove image.');
        return;
      }
      setAvatarUrl('');
      await updateSession({ image: null });
    } catch {
      setAvatarError('Network error. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favoriteVerse: favoriteVerse || null,
          bibleVersion,
          denomination: denomination || null,
          faithStage: faithStage || null,
          prayerTopics: prayerTopics.length > 0 ? prayerTopics : null,
          dateOfBirth: dateOfBirth || null,
          sex: sex || null,
          maritalStatus: maritalStatus || null,
          occupation: occupation || null,
          churchName: churchName || null,
          timezone: timezone || null,
          prayerHistoryMode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save profile.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      setPasswordError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError('Password must contain at least one number.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || 'Failed to change password.');
        return;
      }

      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch {
      setPasswordError('Network error. Please try again.');
    } finally {
      setSavingPassword(false);
    }
  }

  if (loadingProfile) {
    return (
      <div className="max-w-[560px] mx-auto px-5 pt-12 pb-16 text-center">
        <span className="spinner" />
      </div>
    );
  }

  const initials = (session?.user?.name || session?.user?.email || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-[560px] mx-auto px-5 pt-12 pb-16">
      <SiteHeader />

      <div className="mb-8">
        <h1 className="font-serif font-semibold text-3xl mt-6 mb-1 tracking-tight">
          Profile settings
        </h1>
        <p className="text-[var(--ink-muted)] text-[0.9rem]">
          {session?.user?.email}
        </p>
      </div>

      {/* Profile Picture */}
      <div className="card p-6 mb-8">
        <span className={labelClass}>Profile picture</span>
        <div className="flex items-center gap-5 mt-3">
          <div className="w-16 h-16 rounded-full bg-seateal/20 border border-seateal/40 text-seateal text-xl font-bold flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
                e.target.value = '';
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="text-oceanblue text-[0.85rem] bg-transparent border border-oceanblue/35 rounded-[var(--radius-sm)] px-3 py-1.5 cursor-pointer font-[inherit] hover:bg-oceanblue/10 transition-colors disabled:opacity-50"
              >
                {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  disabled={uploadingAvatar}
                  onClick={handleRemoveAvatar}
                  className="text-coral text-[0.85rem] bg-transparent border-0 cursor-pointer font-[inherit] hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[0.75rem] text-[var(--ink-subtle)] m-0">
              JPG, PNG or WebP. Max 2 MB.
            </p>
            {avatarError && (
              <p className="text-coral text-[0.8rem] m-0">{avatarError}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="grid gap-8">
        {/* Bible & Faith */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Bible &amp; Faith
          </legend>

          <div>
            <label htmlFor="favoriteVerse" className={labelClass}>
              Favorite Bible verse
            </label>
            <input
              id="favoriteVerse"
              type="text"
              value={favoriteVerse}
              onChange={(e) => setFavoriteVerse(e.target.value)}
              placeholder="e.g. John 3:16"
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Bible version</span>
            <p className="text-[0.82rem] text-[var(--ink-subtle)] italic mt-1">
              ASV (American Standard Version) — more options coming soon.
            </p>
          </div>

          <div>
            <label htmlFor="denomination" className={labelClass}>
              Denomination
            </label>
            <select
              id="denomination"
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {DENOMINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="faithStage" className={labelClass}>
              Faith stage
            </label>
            <select
              id="faithStage"
              value={faithStage}
              onChange={(e) => setFaithStage(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {FAITH_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelClass}>Prayer topics of interest</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {PRAYER_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-[0.82rem] font-medium border transition-colors ${
                    prayerTopics.includes(topic)
                      ? 'bg-seateal/20 border-seateal text-seateal'
                      : 'bg-transparent border-[var(--border)] text-[var(--ink-muted)] hover:border-[var(--ink-subtle)]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Personal */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Personal
          </legend>

          <div>
            <label htmlFor="dateOfBirth" className={labelClass}>
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="sex" className={labelClass}>
              Sex
            </label>
            <select
              id="sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {SEX_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="maritalStatus" className={labelClass}>
              Marital status
            </label>
            <select
              id="maritalStatus"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {MARITAL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="occupation" className={labelClass}>
              Employment status
            </label>
            <select
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {EMPLOYMENT_STATUSES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Community */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Community
          </legend>

          <div>
            <label htmlFor="churchName" className={labelClass}>
              Church name
            </label>
            <input
              id="churchName"
              type="text"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              placeholder="e.g. Grace Community Church"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="timezone" className={labelClass}>
              Timezone
            </label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={selectClass}
            >
              <option value="">Select...</option>
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Preferences */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Preferences
          </legend>

          <div>
            <span className={labelClass}>Prayer history</span>
            <div className="grid gap-2 mt-2">
              {PRAYER_HISTORY_MODES.map((mode) => (
                <label
                  key={mode}
                  className="flex items-center gap-3 cursor-pointer text-[0.9rem] text-[var(--ink-muted)]"
                >
                  <input
                    type="radio"
                    name="prayerHistoryMode"
                    value={mode}
                    checked={prayerHistoryMode === mode}
                    onChange={(e) => setPrayerHistoryMode(e.target.value)}
                    className="accent-seateal"
                  />
                  {HISTORY_MODE_LABELS[mode]}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {error && (
          <p className="text-coral text-[0.88rem] m-0">{error}</p>
        )}

        {saved && (
          <p className="text-seateal text-[0.88rem] m-0">
            Profile saved successfully.
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-submit w-full">
          {saving ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="spinner" />
              Saving...
            </span>
          ) : (
            'Save profile'
          )}
        </button>
      </form>

      {/* Change Password */}
      <div className="mt-10">
        <h2 className="font-serif font-semibold text-xl mb-4 tracking-tight">
          Change password
        </h2>
        <form onSubmit={handleChangePassword} className="card grid gap-5 p-6">
          <div>
            <label htmlFor="currentPassword" className={labelClass}>
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelClass}>
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className={labelClass}>
              Confirm new password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className={inputClass}
            />
          </div>

          {passwordError && (
            <p className="text-coral text-[0.88rem] m-0">{passwordError}</p>
          )}
          {passwordSaved && (
            <p className="text-seateal text-[0.88rem] m-0">
              Password changed successfully.
            </p>
          )}

          <button
            type="submit"
            disabled={savingPassword}
            className="btn-submit w-full"
          >
            {savingPassword ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="spinner" />
                Changing...
              </span>
            ) : (
              'Change password'
            )}
          </button>
        </form>
      </div>

      {/* Sign Out */}
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-coral text-[0.9rem] bg-transparent border-0 cursor-pointer font-[inherit] hover:underline"
        >
          Sign out
        </button>
      </div>

      <SiteFooter />
    </div>
  );
}
