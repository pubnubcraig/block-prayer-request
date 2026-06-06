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
    description:
      'Free Scripture-based prayer responses. Share your concern and receive a Bible verse, interpretation, guidance, and prayer.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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

export function generateArticleSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  section?: string;
  keywords?: string[];
}) {
  return {
    '@type': 'Article',
    headline: options.title,
    description: options.description,
    url: options.url,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': options.url },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.section && { articleSection: options.section }),
    ...(options.keywords && { keywords: options.keywords }),
  };
}

export function generateHowToSchema(options: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    step: options.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
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
