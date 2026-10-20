import { useEffect } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { cn } from "../components/ui/cn";

const LEGAL_LINKS = [
  { to: "/legal/privacy-policy", label: "Privacy Policy" },
  { to: "/legal/terms-of-use", label: "Terms of Use" },
  { to: "/legal/dmca", label: "DMCA / Copyright" },
  { to: "/legal/contact", label: "Contact" },
  { to: "/legal/about", label: "About" },
  { to: "/legal/content-rights", label: "Content Rights" },
];

type LegalSection = {
  heading: string;
  body: string[];
};

type LegalPageContent = {
  title: string;
  kicker: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

const CONTACT_EMAIL = "contact@toxicreels.com";
const LAST_UPDATED = "September 15, 2026";

const sharedRightsNotice =
  "ToxicReels does not claim ownership of movies, series, artwork, names, logos, trailers, or other media properties shown on this site. Copyrights, trademarks, and related rights belong to their respective owners. ToxicReels is intended to help users discover titles and, where available, find ways to access them from their original or authorized sources.";

const pages: Record<string, LegalPageContent> = {
  "privacy-policy": {
    title: "Privacy Policy",
    kicker: "Privacy",
    updated: LAST_UPDATED,
    intro:
      "This Privacy Policy explains what information ToxicReels may collect, how it is used, and how you can contact us about privacy concerns.",
    sections: [
      {
        heading: "Information We Collect",
        body: [
          "When you create an account, contact us, use search, save a watchlist item, or interact with the site, we may collect account details, contact information, usage activity, device/browser data, and messages you send to us.",
          "We may also use cookies, analytics tools, ad partners, and similar technologies to operate the site, measure performance, prevent abuse, and support advertising eligibility.",
        ],
      },
      {
        heading: "How We Use Information",
        body: [
          "We use information to run ToxicReels, maintain accounts, improve browsing and discovery features, respond to requests, protect the service, show relevant ads, and comply with legal obligations.",
          "We do not sell your personal information as a standalone product. Some advertising and analytics partners may process limited data under their own privacy terms.",
        ],
      },
      {
        heading: "Content And Rights Notice",
        body: [sharedRightsNotice],
      },
      {
        heading: "Your Choices",
        body: [
          "You may avoid creating an account if you only want to browse public pages. You can also use browser settings to manage cookies and tracking preferences.",
          `For privacy questions, account concerns, or removal requests, contact us at ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  "terms-of-use": {
    title: "Terms of Use",
    kicker: "Terms",
    updated: LAST_UPDATED,
    intro:
      "By using ToxicReels, you agree to use the site lawfully, respect content owners, and understand the limits of the service.",
    sections: [
      {
        heading: "Service Purpose",
        body: [
          sharedRightsNotice,
          "ToxicReels may provide title information, images, summaries, categories, discovery tools, and links or references that point users toward sources where content may be available. We do not grant you rights to copy, download, redistribute, or publicly perform any third-party content.",
        ],
      },
      {
        heading: "User Responsibilities",
        body: [
          "You are responsible for following the laws in your location and the terms of any third-party platform, source, or rights holder you access through information found on ToxicReels.",
          "You must not abuse the site, attempt unauthorized access, upload unlawful material, interfere with security, scrape at harmful scale, or use ToxicReels to infringe anyone's rights.",
        ],
      },
      {
        heading: "Third-Party Sources",
        body: [
          "Links, names, artwork, embeds, or references to third-party services do not mean ToxicReels owns, controls, endorses, or is affiliated with those services or media owners.",
          "Availability, pricing, legality, and terms may change on third-party sources. Check the original source before relying on any information.",
        ],
      },
      {
        heading: "Changes And Contact",
        body: [
          "We may update these terms as the service changes. Continued use of ToxicReels after updates means you accept the revised terms.",
          `Questions about these Terms of Use can be sent to ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  "dmca": {
    title: "DMCA / Copyright Removal Policy",
    kicker: "Copyright",
    updated: LAST_UPDATED,
    intro:
      "ToxicReels respects intellectual property rights. If material on the site infringes your rights, send a detailed removal request and we will review it promptly.",
    sections: [
      {
        heading: "Rights Ownership Notice",
        body: [
          sharedRightsNotice,
          "If any listing, image, link, embed, description, or reference on ToxicReels infringes your copyright or other rights, please contact us so we can review, remove, disable, or correct it where appropriate.",
        ],
      },
      {
        heading: "What To Include",
        body: [
          "Identify the copyrighted work or protected material you believe has been infringed.",
          "Provide the exact ToxicReels URL where the material appears and explain what you want removed or corrected.",
          "Include your name, company if applicable, email address, phone number if available, and a statement that you own the rights or are authorized to act for the rights owner.",
          "Include a good-faith statement that the disputed use is not authorized by the rights owner, its agent, or the law.",
        ],
      },
      {
        heading: "Where To Send Notices",
        body: [
          `Send copyright removal notices to ${CONTACT_EMAIL}. Use the subject line "Copyright Removal Request" so the request can be handled quickly.`,
          "Incomplete notices may take longer to process. We may ask for more information if we cannot identify the material or verify the request.",
        ],
      },
      {
        heading: "Repeat Infringement",
        body: [
          "When appropriate, ToxicReels may remove or disable access to disputed material and may restrict accounts or contributors connected to repeated infringement.",
        ],
      },
    ],
  },
  contact: {
    title: "Contact Page",
    kicker: "Contact",
    updated: LAST_UPDATED,
    intro:
      "Use this page to reach ToxicReels about general questions, privacy concerns, copyright removals, or content rights issues.",
    sections: [
      {
        heading: "Contact Email",
        body: [
          `Email: ${CONTACT_EMAIL}`,
          "For copyright or DMCA requests, include the exact page URL, the work you own or represent, and the action you are requesting.",
        ],
      },
      {
        heading: "Rights Concerns",
        body: [
          "If any content, title page, image, source reference, or link appears to infringe your rights, contact us with enough detail to locate it. We will review the request and take appropriate action.",
          sharedRightsNotice,
        ],
      },
      {
        heading: "Response Time",
        body: [
          "We aim to review serious copyright, privacy, and safety messages as soon as reasonably possible. General feedback may take longer depending on volume.",
        ],
      },
    ],
  },
  about: {
    title: "About Page",
    kicker: "About",
    updated: LAST_UPDATED,
    intro:
      "ToxicReels is a movie and series discovery site built to help visitors browse titles, explore categories, and find information about where content may be available.",
    sections: [
      {
        heading: "What ToxicReels Does",
        body: [
          "ToxicReels organizes movie and series information for discovery. The site may show title details, posters, categories, ratings, episodes, search tools, and source references.",
          "Our goal is to make browsing easier while respecting the original creators, studios, distributors, platforms, and rights holders behind the content.",
        ],
      },
      {
        heading: "What ToxicReels Does Not Own",
        body: [
          sharedRightsNotice,
          "We are not the producer, studio, distributor, broadcaster, or copyright owner of third-party movies or series displayed on the site unless specifically stated otherwise.",
        ],
      },
      {
        heading: "Contact",
        body: [
          `For questions, corrections, business inquiries, or rights concerns, contact ${CONTACT_EMAIL}.`,
        ],
      },
    ],
  },
  "content-rights": {
    title: "Content Rights Statement",
    kicker: "Rights",
    updated: LAST_UPDATED,
    intro:
      "This statement explains how ToxicReels treats third-party movies, series, images, names, links, and source references.",
    sections: [
      {
        heading: "Ownership",
        body: [
          sharedRightsNotice,
          "All third-party copyrights, trademarks, service marks, logos, character names, images, video content, metadata, and related rights remain with their lawful owners.",
        ],
      },
      {
        heading: "Display And Source References",
        body: [
          "ToxicReels may display descriptive information or source references so users can discover content and locate it from original, official, licensed, or otherwise relevant third-party sources.",
          "A title appearing on ToxicReels does not mean ToxicReels owns that title, has produced it, or has been endorsed by its rights holder.",
        ],
      },
      {
        heading: "Removal Or Correction Requests",
        body: [
          `If our use of any material infringes your rights, please contact ${CONTACT_EMAIL} with the affected URL, proof or explanation of your rights, and the change you are requesting.`,
          "We will review credible requests and may remove, disable, update, or correct material as appropriate.",
        ],
      },
    ],
  },
};

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? pages[slug] : undefined;

  useEffect(() => {
    if (page) {
      document.title = `${page.title} | ToxicReels`;
    }
  }, [page]);

  if (!page) {
    return <Navigate to="/legal/content-rights" replace />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader kicker={page.kicker} title={page.title} description={page.intro}>
        <p className="text-xs font-medium text-fg-subtle">Last updated: {page.updated}</p>
      </PageHeader>

      <div className="page-x mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <nav
          aria-label="Legal pages"
          className="bleed-x flex gap-1 overflow-x-auto scrollbar-none lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
        >
          {LEGAL_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "relative shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium whitespace-nowrap transition",
                  isActive
                    ? "bg-white/[0.07] text-white lg:before:absolute lg:before:inset-y-2 lg:before:left-0 lg:before:w-0.5 lg:before:rounded-full lg:before:bg-accent"
                    : "text-fg-muted hover:bg-white/[0.04] hover:text-white",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <article className="max-w-3xl">
          {page.sections.map((section) => (
            <section key={section.heading} className="border-b border-white/[0.06] py-7 first:pt-0">
              <h2 className="font-display text-lg font-semibold text-white">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-7 text-fg-muted sm:text-[15px]">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <div className="mt-8 rounded-2xl bg-accent/[0.06] p-5 text-sm leading-relaxed text-fg-muted ring-1 ring-accent/20 ring-inset">
            <strong className="text-white">Rights holder notice:</strong> If anything on ToxicReels infringes your rights,
            contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-accent hover:text-accent-strong">
              {CONTACT_EMAIL}
            </a>{" "}
            with the relevant page URL and details of your request.
          </div>
        </article>
      </div>
    </div>
  );
};

export default LegalPage;
