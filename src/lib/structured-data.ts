// =====================================================================
// STRUCTURED DATA (JSON-LD) — for Google rich results
// ---------------------------------------------------------------------
// Helper functions that build schema.org objects for:
//   - Organization / WebSite (sitelinks, knowledge panel)
//   - Product (rich product results with price & availability)
//   - BreadcrumbList (breadcrumb trails in search results)
//   - FAQPage (FAQ rich results)
//   - Store (local business schema)
// =====================================================================

import { siteConfig } from "./site-config";
import type { Product, Category } from "./types";

// --- Organization + WebSite (used in root layout) ---
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legal.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: String(siteConfig.legal.registrationYear),
    founder: {
      "@type": "Person",
      name: siteConfig.founder,
      jobTitle: siteConfig.founderTitle,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressLocality: "Lagos",
      addressRegion: "Lagos",
      streetAddress: siteConfig.contact.address,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
        areaServed: "NG",
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.twitter,
      siteConfig.social.youtube,
      siteConfig.social.linkedin,
      siteConfig.social.telegram,
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/#/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// --- Product schema (used on each product page) ---
export function productSchema(product: Product) {
  const effectivePrice = product.salePrice ?? product.price;
  const availability = product.stock > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: product.brand?.name ?? siteConfig.name,
    },
    image: product.images,
    url: `${siteConfig.url}/#/product/${product.slug}`,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/#/product/${product.slug}`,
      price: effectivePrice,
      priceCurrency: product.currency,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${siteConfig.url}/#organization` },
    },
    ...(product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// --- Breadcrumb schema (used on product & category pages) ---
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}/${item.url}`,
    })),
  };
}

// --- FAQ schema (used on FAQ page) ---
export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

// --- Store / LocalBusiness schema (used in root layout) ---
export function storeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "@id": `${siteConfig.url}/#store`,
    name: siteConfig.name,
    image: `${siteConfig.url}/og-image.png`,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressLocality: "Lagos",
      streetAddress: siteConfig.contact.address,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "₦₦",
    paymentAccepted: ["Cash", "Credit Card", "Paystack", "Flutterwave", "Cash on Delivery"],
    currenciesAccepted: "NGN",
  };
}

// --- ItemList schema for category pages (helps products appear in carousels) ---
export function itemListSchema(products: Product[], categoryName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: categoryName ? `${categoryName} — ${siteConfig.name}` : `All Products — ${siteConfig.name}`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/#/product/${p.slug}`,
      name: p.name,
    })),
  };
}
