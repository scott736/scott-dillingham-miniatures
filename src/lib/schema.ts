import {
  CONTACT_TO_EMAIL,
  GALLERY_ITEMS,
  GALLERY_STATUS,
  SITE_DESCRIPTION,
  SITE_URL,
  SOCIAL_LINKS,
} from '@/consts';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/about/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const KSB_MUSEUM_ID = `${SITE_URL}/#ksb-miniatures-collection`;

export const IMAGE_LICENSE_URL = `${SITE_URL}/image-license/`;
export const IMAGE_ACQUIRE_LICENSE_URL = `${SITE_URL}/contact/`;
export const IMAGE_COPYRIGHT_NOTICE = `© ${new Date().getFullYear()} Scott Dillingham Miniatures. All rights reserved.`;
export const IMAGE_CREDIT_TEXT = 'Scott Dillingham Miniatures';

type ImageObjectOpts = {
  url: string;
  caption?: string;
};

/** Google Image License metadata (Search Console ImageObject fields). */
export function imageObject({ url, caption }: ImageObjectOpts) {
  return {
    '@type': 'ImageObject',
    url,
    contentUrl: url,
    ...(caption ? { caption } : {}),
    creditText: IMAGE_CREDIT_TEXT,
    creator: personRef(),
    copyrightHolder: personRef(),
    copyrightNotice: IMAGE_COPYRIGHT_NOTICE,
    license: IMAGE_LICENSE_URL,
    acquireLicensePage: IMAGE_ACQUIRE_LICENSE_URL,
  };
}

const PERSON_KNOWS_ABOUT = [
  'Miniature Furniture',
  '1/12 Scale Miniatures',
  'Traditional Woodworking',
  'Period Furniture Reproductions',
  'Dollhouse Furniture',
  'Miniature Woodworking',
];

export function personRef() {
  return { '@id': PERSON_ID };
}

export function organizationRef() {
  return { '@id': ORGANIZATION_ID };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Scott Dillingham',
    url: `${SITE_URL}/about/`,
    jobTitle: 'Museum-Exhibited Master Miniature Furniture Craftsman',
    knowsAbout: PERSON_KNOWS_ABOUT,
    sameAs: SOCIAL_LINKS.map((s) => s.href),
    worksFor: organizationRef(),
  };
}

export function organizationNode() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    name: 'Scott Dillingham Miniatures',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: imageObject({ url: `${SITE_URL}/layout/sdmlogo.webp` }),
    image: imageObject({ url: `${SITE_URL}/og-image.jpg` }),
    email: CONTACT_TO_EMAIL,
    founder: personRef(),
    sameAs: SOCIAL_LINKS.map((s) => s.href),
    knowsAbout: [
      'Miniature Furniture',
      '1/12 Scale Miniatures',
      'Dollhouse Furniture',
      'Miniature Woodworking',
      'Handcrafted Miniatures',
      'Period Furniture Reproductions',
      'Museum-Quality Miniatures',
      'Custom Miniature Furniture Commissions',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Miniature furniture commissions and available work',
      itemListElement: [
        {
          '@type': 'Offer',
          url: `${SITE_URL}/contact/`,
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Miniature Furniture Commissions',
            description:
              'Commission a custom handcrafted 1/12 scale miniature furniture piece. Period reproductions, family heirloom replicas, or custom designs. Museum-held uniques are not for sale.',
            provider: organizationRef(),
          },
        },
        ...GALLERY_ITEMS.filter((item) => item.availability === 'available').map(
          (item) => ({
            '@type': 'Offer',
            url: `${SITE_URL}/gallery/#${item.id}`,
            availability: 'https://schema.org/LimitedAvailability',
            itemOffered: {
              '@type': 'Product',
              name: item.title,
              description: stripHtml(item.description),
              image: `${SITE_URL}${item.images[0]}`,
            },
          }),
        ),
      ],
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Scott Dillingham Miniatures',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: organizationRef(),
  };
}

export function ksbMuseumNode() {
  return {
    '@type': 'Museum',
    '@id': KSB_MUSEUM_ID,
    name: 'KSB Miniatures Collection',
    url: 'https://www.ksbminiaturescollection.com/',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Maysville',
      addressRegion: 'KY',
      addressCountry: 'US',
    },
  };
}

type GalleryItem = (typeof GALLERY_ITEMS)[number];

export function visualArtworkNode(item: GalleryItem) {
  const inKsb = item.availability === 'museum';
  const imageUrl = `${SITE_URL}${item.images[0]}`;
  const artwork: Record<string, unknown> = {
    '@type': 'VisualArtwork',
    name: item.title,
    description: stripHtml(item.description),
    url: `${SITE_URL}/gallery/#${item.id}`,
    identifier: item.id,
    artform: 'Miniature furniture',
    artMedium: item.wood,
    material: item.wood,
    creator: personRef(),
    copyrightHolder: personRef(),
    image: imageObject({
      url: imageUrl,
      caption: `${item.title} — handcrafted 1/12 scale miniature by Scott Dillingham`,
    }),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Scale',
        value: item.scale,
      },
      {
        '@type': 'PropertyValue',
        name: 'Category',
        value: item.category,
      },
      {
        '@type': 'PropertyValue',
        name: 'Availability',
        value: GALLERY_STATUS[item.availability].label,
      },
      {
        '@type': 'PropertyValue',
        name: 'Construction Method',
        value: 'Entirely handcrafted using traditional joinery',
      },
    ],
  };

  if (inKsb) {
    artwork.contentLocation = { '@id': KSB_MUSEUM_ID };
  }

  if (item.availability === 'available') {
    artwork.offers = {
      '@type': 'Offer',
      url: `${SITE_URL}/gallery/#${item.id}`,
      availability: 'https://schema.org/LimitedAvailability',
    };
  }

  return artwork;
}

export function galleryCollectionNode() {
  const hasKsb = GALLERY_ITEMS.some((item) => item.availability === 'museum');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...(hasKsb ? [ksbMuseumNode()] : []),
      {
        '@type': 'CollectionPage',
        name: 'Handcrafted 1/12 Scale Miniature Furniture Collection — Sam Maloof, Hepplewhite, Shaker & More',
        description:
          'Browse museum-exhibited 1/12 scale miniature furniture by Scott Dillingham. Pieces in the KSB Miniatures Collection are not for sale; other works are available or offered by commission. Built entirely by hand from fine hardwoods using traditional joinery.',
        url: `${SITE_URL}/gallery/`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: GALLERY_ITEMS.length,
          itemListElement: GALLERY_ITEMS.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: visualArtworkNode(item),
          })),
        },
      },
    ],
  };
}

export function aboutProfilePageNode() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about/#profile`,
    url: `${SITE_URL}/about/`,
    name: 'About Scott Dillingham',
    mainEntity: personRef(),
  };
}

type HowToSpec = {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
};

/** Step-by-step posts only — headings and copy taken from the articles. */
const BLOG_HOWTO: Record<string, HowToSpec> = {
  'building-miniature-four-poster-bed': {
    name: 'How to Build a Miniature Four-Poster Bed at 1/12 Scale',
    description:
      'Major steps for a 1/12 scale four-poster: period style, post turning, headboard, rail joinery, canopy frame, and fabric draping.',
    steps: [
      {
        name: 'Choose a style and period',
        text: 'Decide the period before cutting wood. Queen Anne, Chippendale, Federal, and Victorian beds need different turning profiles, carving, and proportions. Start from reference images or measured drawings of a specific full-scale bed, then scale to 1/12.',
      },
      {
        name: 'Turn the four posts',
        text: 'Turn the posts on a miniature lathe from straight-grained hardwood blanks about 3/16 to 1/4 inch square. Rough to round, lay out the profile, and turn matching sections on all four posts before moving on. Carve fluting or acanthus after the post leaves the lathe.',
      },
      {
        name: 'Build the headboard',
        text: 'Connect the head posts with a headboard suited to the period: a scrolled Chippendale panel from thin stock, a Federal framed panel, or a simple curved board for earlier beds.',
      },
      {
        name: 'Join the rails',
        text: 'Join side and end rails to the posts with small mortise-and-tenon joints. Dry-fit for squareness, then glue in stages so the posts stand vertical and the frame sits flat.',
      },
      {
        name: 'Build the canopy frame',
        text: 'Make the tester from thin hardwood strips joined at the corners with half-laps. It sits on the posts and carries curtains and valances. Add a shaped cornice when the style calls for it.',
      },
      {
        name: 'Select fabric and drape',
        text: 'Use fine-pattern or solid fabrics that drape at 1/12 scale. Hem curtains, cut valances, and layer mattress, sheets, and coverlet so the bed reads as a complete piece.',
      },
    ],
  },
  'miniature-woodworking-joints': {
    name: 'How to Cut Miniature Dovetail and Mortise-and-Tenon Joints',
    description:
      'Methods for hand-cutting dovetails, mortise and tenon, and other joints at 1/12 scale.',
    steps: [
      {
        name: 'Cut miniature dovetails',
        text: 'Use a pin-to-tail ratio near 1:7 at this scale. Reduce the number of pins versus full size and slightly widen them so they stay visible and structurally sound. Cut tails and pins with miniature saws and chisels, then dry-fit before glue.',
      },
      {
        name: 'Cut mortise and tenon joints',
        text: 'Chop or drill miniature mortises, then cut matching tenons with crisp shoulder lines. Peg the joint when the original would have been pegged. This joint resists racking on chairs, rails, and frames.',
      },
      {
        name: 'Use other scale-appropriate joints',
        text: 'Add tongue-and-groove, half-laps, and bridle joints where the full-size original used them. Practice on scrap until the fit is tight without crushing the tiny parts.',
      },
    ],
  },
  'scaling-down-furniture-plans': {
    name: 'How to Scale Furniture Plans Down to 1/12',
    description:
      'Process for turning full-size furniture dimensions into a working 1/12 scale plan, including non-linear adjustments.',
    steps: [
      {
        name: 'Find source material',
        text: 'Start with measured drawings, photographs that include at least one known dimension, or direct measurements from the original piece.',
      },
      {
        name: 'Do the basic math',
        text: 'For 1/12 scale, divide every real-world measurement in inches by 12. Convert in decimal inches and fractions so the numbers stay usable at the bench.',
      },
      {
        name: 'Adjust what does not scale linearly',
        text: 'Thin edges, moldings, turnings, and joinery often look wrong if you only divide by twelve. Reduce edge thickness slightly, simplify tiny molding fillets, and widen miniature dovetail pins.',
      },
      {
        name: 'Draw the miniature plan',
        text: 'Draw at actual miniature size (1:1 of the finished piece). Note wood species, grain direction, joint types, and assembly sequence on the plan.',
      },
      {
        name: 'Make a prototype',
        text: 'For complex or unfamiliar designs, build a prototype from inexpensive wood to test proportion, fit, and assembly before cutting good stock.',
      },
      {
        name: 'Deal with grain scale',
        text: 'Grain does not shrink. Choose the tightest-grained stock, prefer quarter-sawn faces, and accept that grain will still read slightly coarse at 1/12.',
      },
    ],
  },
  'setting-up-miniature-woodworking-workshop': {
    name: 'How to Set Up a Miniature Woodworking Workshop',
    description:
      'How to arrange a small-scale furniture workshop: bench, lighting, magnification, dust control, storage, and a finishing area.',
    steps: [
      {
        name: 'Set up the workbench',
        text: 'Use a bench about 2 to 4 inches higher than a standard desk so forearms rest at roughly 90 degrees. Keep a smooth, light, uncluttered surface about 24–36 inches wide.',
      },
      {
        name: 'Invest in lighting',
        text: 'Put bright task light over the work, ideally two adjustable LED lamps with CRI 90 or above, plus ambient light so there are no dark pockets.',
      },
      {
        name: 'Add magnification',
        text: 'Use a magnifying headband, a swing-arm magnifier lamp, or clip-on lenses for joinery, carving, and finish inspection.',
      },
      {
        name: 'Control dust and air',
        text: 'Collect dust at the source, filter the room air, and use personal protection. Miniature work still makes fine dust.',
      },
      {
        name: 'Organize storage',
        text: 'Give components, tools, wood, and hardware dedicated storage so the bench stays clear.',
      },
      {
        name: 'Create a finishing area',
        text: 'Keep finishing away from the cutting zone so dust does not land in wet coats. Ventilate solvents.',
      },
    ],
  },
  'finishing-techniques-miniature-furniture': {
    name: 'How to Finish Miniature Furniture at 1/12 Scale',
    description:
      'Surface prep, staining, French polish, lacquer, wax, and oil — applied in thin films so carved detail stays sharp.',
    steps: [
      {
        name: 'Prepare the surface',
        text: 'Sand through 220, 320, and 400 grit (600 on dense woods), with the grain. Raise the grain with a light water wipe, resand, and inspect under raking light and magnification.',
      },
      {
        name: 'Stain if needed',
        text: 'Use a small artist brush or cloth stick. Prefer alcohol dyes for miniature work. Build color with diluted coats rather than one heavy coat.',
      },
      {
        name: 'French polish for museum-quality work',
        text: 'Apply thin shellac with a small rubber in long grain-wise strokes. Build several sessions of 10–15 passes, then spirit off. This is the method used for the highest-quality pieces.',
      },
      {
        name: 'Use lacquer when polish is impractical',
        text: 'Airbrush thin mist coats at low pressure, sand between coats, then rub out after the film cures.',
      },
      {
        name: 'Wax or oil for a natural look',
        text: 'Paste wax suits Shaker and rustic pieces. Penetrating oils enhance grain — apply a tiny amount and wipe all excess immediately.',
      },
    ],
  },
};

export function getBlogHowTo(
  slug: string,
  opts: { title: string; description: string; image?: string },
): Record<string, unknown> | null {
  const spec = BLOG_HOWTO[slug];
  if (!spec) return null;

  const image = opts.image
    ? imageObject({
        url: opts.image.startsWith('http')
          ? opts.image
          : `${SITE_URL}${opts.image}`,
      })
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: spec.name,
    description: spec.description,
    url: `${SITE_URL}/blog/${slug}/`,
    image,
    author: personRef(),
    step: spec.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      url: `${SITE_URL}/blog/${slug}/`,
    })),
  };
}
