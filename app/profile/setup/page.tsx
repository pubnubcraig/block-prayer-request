'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import {
  DENOMINATIONS,
  FAITH_STAGES,
  SEX_OPTIONS,
  MARITAL_STATUSES,
  EMPLOYMENT_STATUSES,
  PRAYER_TOPICS,
  BIBLE_VERSIONS,
  TIMEZONES,
} from '@/lib/constants/profile-options';

const inputClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] placeholder:text-[var(--ink-subtle)]';

const selectClass =
  'w-full font-[inherit] text-[var(--ink)] bg-[rgba(13,43,69,0.55)] border border-[var(--border)] rounded-[var(--radius-sm)] px-4 py-[0.85rem] transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-oceanblue focus:shadow-[0_0_0_3px_rgba(59,167,225,0.22)] cursor-pointer';

const labelClass =
  'block text-[0.78rem] font-semibold tracking-[0.04em] uppercase text-seateal mb-1.5';

export default function ProfileSetupPage() {
  const router = useRouter();

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
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleTopic(topic: string) {
    setPrayerTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic],
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

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
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save profile.');
        return;
      }

      router.push('/');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[560px] mx-auto px-5 pt-12 pb-16">
      <SiteHeader />

      <h1 className="font-serif font-semibold text-3xl mt-6 mb-2 tracking-tight">
        Welcome to GoFish
      </h1>
      <p className="text-[var(--ink-muted)] mb-8 text-[0.95rem]">
        Tell us a bit about yourself to personalize your experience. All fields
        are optional — you can always update these later in your profile
        settings.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-8">
        {/* Bible & Faith section */}
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
            <label htmlFor="bibleVersion" className={labelClass}>
              Preferred Bible version
            </label>
            <select
              id="bibleVersion"
              value={bibleVersion}
              onChange={(e) => setBibleVersion(e.target.value)}
              className={selectClass}
            >
              {BIBLE_VERSIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
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

        {/* Personal section */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Personal (optional)
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

        {/* Community section */}
        <fieldset className="card grid gap-5 border-0 p-6">
          <legend className="text-[0.72rem] font-bold tracking-[0.08em] uppercase text-seateal px-1">
            Community (optional)
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

        {error && (
          <p className="text-coral text-[0.88rem] m-0">{error}</p>
        )}

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="spinner" />
                Saving...
              </span>
            ) : (
              'Save & continue'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-[var(--ink-muted)] text-[0.9rem] hover:text-[var(--ink)] transition-colors bg-transparent border-0 cursor-pointer font-[inherit]"
          >
            Skip for now
          </button>
        </div>
      </form>

      <SiteFooter />
    </div>
  );
}
