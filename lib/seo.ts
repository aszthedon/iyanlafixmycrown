export const site = {
  name: "Iyanla Fix My Hair",
  tagline: "Adjust Your Crown & Walk Like Royalty",
  city: "Flint, MI",
  url: "https://example.com",
};

export function pageTitle(title?: string) {
  return title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
}

export function pageDescription(desc?: string) {
  return desc ?? "Luxury, approachable, empowering hair care and styling — a royal experience from booking to finish.";
}
