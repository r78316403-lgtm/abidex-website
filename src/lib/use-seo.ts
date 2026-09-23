"use client";

// =====================================================================
// CLIENT-SIDE SEO HOOK
// ---------------------------------------------------------------------
// Updates document.title, meta description, canonical URL, and
// Open Graph tags when the hash-based route changes. This is critical
// for the SPA architecture — without it, every "page" would share the
// same metadata from the server-rendered HTML.
// =====================================================================

import { useEffect } from "react";
import { siteConfig } from "@/lib/site-config";

type SeoOptions = {
  title: string;
  description?: string;
  canonicalPath?: string;  // e.g. "/#/product/reishi-herbal-capsules"
  image?: string;
  type?: "website" | "article" | "product";
  jsonLd?: object | object[];
  noIndex?: boolean;
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: object | object[]) {
  // Remove any previous dynamic JSON-LD with this id
  const existing = document.head.querySelectorAll(`script[data-seo-id="${id}"]`);
  existing.forEach((e) => e.remove());

  const arr = Array.isArray(data) ? data : [data];
  for (const item of arr) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
      script.setAttribute("data-seo-id", id);
      script.textContent = JSON.stringify(item);
      document.head.appendChild(script);
    }
}

function removeJsonLd(id: string) {
  document.head.querySelectorAll(`script[data-seo-id="${id}"]`).forEach((e) => e.remove());
}

export function useSeo(opts: SeoOptions) {
  const { title, description, canonicalPath, image, type = "website", jsonLd, noIndex } = opts;

  useEffect(() => {
    const fullTitle = title.includes(siteConfig.name)
      ? title
      : `${title} | ${siteConfig.name}`;
    document.title = fullTitle;

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", siteConfig.name);
    upsertMeta("property", "og:locale", "en_NG");

    if (image) {
      upsertMeta("property", "og:image", image.startsWith("http") ? image : `${siteConfig.url}${image}`);
      upsertMeta("name", "twitter:image", image.startsWith("http") ? image : `${siteConfig.url}${image}`);
      upsertMeta("name", "twitter:card", "summary_large_image");
    }

    // Canonical URL
    const canonicalUrl = canonicalPath
      ? `${siteConfig.url}/${canonicalPath.startsWith("#") ? canonicalPath : `#${canonicalPath}`}`
      : siteConfig.url;
    upsertLink("canonical", canonicalUrl);
    upsertMeta("property", "og:url", canonicalUrl);

    // noindex for cart/checkout/account
    if (noIndex) {
      upsertMeta("name", "robots", "noindex, nofollow");
    } else {
      upsertMeta("name", "robots", "index, follow");
    }

    // JSON-LD structured data
    if (jsonLd) {
      upsertJsonLd("page", jsonLd);
    } else {
      removeJsonLd("page");
    }

    return () => {
      // Clean up dynamic JSON-LD when leaving the page
      removeJsonLd("page");
    };
  }, [title, description, canonicalPath, image, type, jsonLd, noIndex]);
}
