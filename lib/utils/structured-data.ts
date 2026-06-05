const SITE_URL = 'https://gofish.life';

export function generateOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'GoFish.Life',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/gofish-logo-white-bg.png`,
    },
    sameAs: ['https://www.facebook.com/gofishlife'],
    description:
      'Scripture-based prayer responses for everyday life. Free, private, and always available.',
  };
}

export function generateWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'GoFish.Life',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function generateWebApplicationSchema() {
  return {
    '@type': 'WebApplication',
    name: 'GoFish.Life Prayer Request',
    url: SITE_URL,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI-powered Bible verse matching',
      'Personalized prayer generation',
      'Scripture interpretation',
      'Prayer history (account required)',
    ],
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Wrap one or more schema objects in a JSON-LD @graph.
 */
export function wrapInGraph(schemas: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
