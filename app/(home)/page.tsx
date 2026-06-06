'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import SiteHeader from '@/components/layout/site-header';
import SiteFooter from '@/components/layout/site-footer';
import HeroSection from '@/components/home/hero-section';
import PrayerFormSection from '@/components/home/prayer-form-section';
import CrisisBanner from '@/components/home/crisis-banner';
import ResultsSection from '@/components/home/results-section';
import HowItWorksSection from '@/components/home/how-it-works-section';
import WhySection from '@/components/home/why-section';
import AccountFeaturesSection from '@/components/home/account-features-section';
import PrayerTopicsSection from '@/components/home/prayer-topics-section';
import TrustSection from '@/components/home/trust-section';
import DonationSection from '@/components/home/donation-section';
import { PrayerResult } from '@/lib/types';

export default function HomePage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const [prayerCount, setPrayerCount] = useState(0);
  const [result, setResult] = useState<PrayerResult | null>(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [prefillText, setPrefillText] = useState('');
  const [requestText, setRequestText] = useState('');
  const [resultKey, setResultKey] = useState(0);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => setPrayerCount(data.prayers_served || 0))
      .catch(() => {});
  }, []);

  const handleResult = useCallback((newResult: PrayerResult, isCrisis: boolean, text: string) => {
    setResult(newResult);
    setShowCrisis(isCrisis);
    setRequestText(text);
    setResultKey((k) => k + 1);
  }, []);

  const handleTopicSelect = useCallback((prefill: string) => {
    setPrefillText(prefill);
    document.getElementById('prayer-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-5 pt-5 pb-12">
      <SiteHeader />

      <main>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <HeroSection
            prayerCount={prayerCount}
            isAuthenticated={isAuthenticated}
          />

          <PrayerFormSection
            prefillText={prefillText}
            onResult={handleResult}
            onPrayerCountIncrement={() => setPrayerCount((c) => c + 1)}
          />
        </div>

        <CrisisBanner visible={showCrisis} />
        <ResultsSection key={resultKey} result={result} requestText={requestText} />

        <HowItWorksSection />
        <WhySection />
        <AccountFeaturesSection isAuthenticated={isAuthenticated} />
        <PrayerTopicsSection onTopicSelect={handleTopicSelect} />
        <TrustSection />
        <DonationSection />
      </main>

      <SiteFooter />
    </div>
  );
}
