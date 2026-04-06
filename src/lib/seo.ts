const BASE_URL = "https://www.sammorrispb.com";

export function breadcrumbJsonLd(
  crumbs: { name: string; href: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${BASE_URL}${crumb.href}`,
    })),
  };
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function eventJsonLd(event: {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location: { name: string; address: string; city: string; state: string; zip: string };
  price?: string;
  url?: string;
  organizer?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    ...(event.description && { description: event.description }),
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.location.address,
        addressLocality: event.location.city,
        addressRegion: event.location.state,
        postalCode: event.location.zip,
        addressCountry: "US",
      },
    },
    ...(event.organizer && {
      organizer: { "@type": "Person", name: event.organizer },
    }),
    ...(event.price && {
      offers: {
        "@type": "Offer",
        price: event.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        ...(event.url && { url: event.url }),
      },
    }),
  };
}
