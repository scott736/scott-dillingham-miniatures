// Scott Dillingham Miniatures - Site Configuration
// Handcrafted 1/12 Scale Miniature Furniture

export const SITE_TITLE = 'Scott Dillingham Miniatures | Museum-Exhibited Handcrafted 1/12 Scale Miniature Furniture for Sale';
export const SITE_DESCRIPTION =
  'Museum-exhibited handcrafted 1/12 scale miniature furniture for sale by master craftsman Scott Dillingham. Buy heirloom-quality dollhouse furniture or commission custom pieces built entirely by hand from fine hardwoods using traditional woodworking techniques. No kits. No shortcuts. Pure craftsmanship.';

export const SITE_URL = 'https://scottdillinghamminiatures.com';

/** IndexNow verification key — served at /{INDEXNOW_KEY}.txt for Bing/Copilot. */
export const INDEXNOW_KEY = 'sdm-indexnow-20260823-a7f4c91e';

/** Contact form destination (Resend `to`). */
export const CONTACT_TO_EMAIL = 'sedminiatures@gmail.com';
/** Visitor-visible From. Override with RESEND_FROM_EMAIL if Resend uses another verified domain. */
export const CONTACT_FROM_EMAIL =
  'Scott Dillingham Miniatures <hello@scottdillinghamminiatures.com>';

export const SITE_METADATA = {
  title: {
    default: SITE_TITLE,
    template: '%s | Scott Dillingham Miniatures',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'miniature furniture',
    'miniature furniture for sale',
    'buy miniature furniture',
    '1/12 scale miniatures',
    'handcrafted miniature furniture',
    'dollhouse furniture',
    'miniature woodworking',
    'artisan miniatures',
    'museum quality miniatures',
    'museum exhibited miniatures',
    'commission miniature furniture',
    'miniature highboy',
    'miniature four poster bed',
    'miniature tall case clock',
    'miniature rocking chair',
    'Sam Maloof miniature rocking chair',
    'miniature Hepplewhite chair',
    'miniature shield back chair',
    'Thomas Moser miniature chair',
    'miniature continuous arm chair',
    'Shaker D-ring table miniature',
    'miniature Shaker furniture',
    'KSB Miniatures Collection',
    'fine scale miniatures',
    'dollhouse miniatures',
    'dollhouse furniture for sale',
    '1:12 scale furniture',
    'miniature furniture maker',
    'handmade dollhouse furniture',
    'miniature woodworking tools',
    'miniature furniture collector',
    'miniature Chippendale furniture',
    'miniature Queen Anne furniture',
    'miniature Hepplewhite furniture',
    'miniature Federal period furniture',
    'heirloom miniature furniture',
    'custom miniature furniture',
    'custom dollhouse furniture',
    'Scott Dillingham',
    'miniature furniture Canada',
    'miniature mahogany furniture',
    'miniature walnut furniture',
    'miniature cherry furniture',
    'miniature Brazilian Rosewood furniture',
    'block front secretary desk miniature',
    'John Goddard miniature',
    'period miniature furniture',
    'Victorian dollhouse furniture',
    'miniature furniture artisan',
    'collectible miniature furniture',
  ],
  authors: [{ name: 'Scott Dillingham' }],
  creator: 'Scott Dillingham',
  publisher: 'Scott Dillingham Miniatures',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Scott Dillingham Miniatures',
    images: [
      {
        url: '/og-image.jpg',
        width: 1800,
        height: 945,
        alt: 'Scott Dillingham Miniatures - Handcrafted 1/12 Scale Miniature Furniture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og-image.jpg'],
    creator: '@scottdminiatures',
  },
};

// Navigation items
export const NAV_ITEMS = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Workshop', href: '/workshop' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

// Footer links
export const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { name: 'Gallery', href: '/gallery' },
      { name: 'Workshop', href: '/workshop' },
      { name: 'About the Maker', href: '/about' },
      { name: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { name: 'Miniature Woodworking Guide', href: '/blog/complete-guide-1-12-scale-miniature-furniture' },
      { name: 'Choosing Wood for Miniatures', href: '/blog/how-to-choose-wood-for-miniature-furniture' },
      { name: 'Essential Tools', href: '/blog/essential-miniature-woodworking-tools' },
      { name: 'All Articles', href: '/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'Contact', href: '/contact' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
    ],
  },
];

// Social links
export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/scottdillinghamminiatures/',
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/scottdillinghamminiatures/',
  },
];

// Gallery items
export const GALLERY_ITEMS = [
  {
    id: 'tall-case-clock',
    title: 'Simon Willard Tall Case Clock Style',
    description: 'This exquisite 1/12 scale miniature Simon Willard Tall Case Clock (also known as a grandfather clock) faithfully captures the timeless elegance of the original late 18th-century Federal/Roxbury style pieces crafted by the renowned American clockmaker Simon Willard. Handmade from rich Honduras mahogany, it features a warm, deep reddish-brown finish that beautifully highlights the wood\'s natural grain and luster. The tall, slender case rises gracefully from a simple squared base with subtle bracket feet, flowing into a long, narrow trunk accented by delicate cross-band inlay. The hood is crowned with a gently arched pediment, an ornate pierced fretwork crest, and three gleaming brass finials for that classic period flourish. At the heart of the design is the arched dial with crisp black Roman numerals, elegant spade hands, and a finely rendered lunar calendar dial tracking the moon\'s cycle—every detail meticulously reproduced for historical accuracy. This is a true collector\'s gem that blends masterful miniature craftsmanship with authentic period charm. This particular piece resides in the <a href="https://www.ksbminiaturescollection.com/" target="_blank" rel="noopener noreferrer">KSB Miniatures Collection</a> (a premier museum of fine miniatures in Maysville, Kentucky), where it\'s proudly displayed among other exceptional works. It\'s a standout for serious collectors who value pieces with proven exhibition quality. Handmade one at a time in my workshop, it\'s ready to elevate any discerning miniature collection.',
    images: ['/images/gallery/tall-case-clock.webp'],
    category: 'Clocks',
    wood: 'Honduras Mahogany',
    scale: '1:12',
    relatedPost: '/blog/miniature-tall-case-clocks',
  },
  {
    id: 'highboy-dresser',
    title: 'Queen Anne Style Highboy',
    description: 'This 1/12 scale miniature Queen Anne style highboy (tall chest of drawers) is meticulously crafted from rich black walnut, showcasing warm, deep tones and beautiful grain. It features a classic bonnet top with graceful arched pediment and split scrolling crest, adding elegant height and period charm. The upper section has multiple graduated drawers with brass pulls, while the lower section includes a deep open drawer and additional drawers accented by a carved fan/shell motif on the central lower panel. Supported by graceful cabriole legs ending in detailed claw-and-ball feet, the piece exhibits precise dovetailed drawer construction for authenticity. The overall design captures the refined proportions and sophisticated curves of 18th-century American Queen Anne furniture, making it a stunning dollhouse collector\'s item.',
    images: ['/images/gallery/highboy-dresser.webp'],
    category: 'Dressers & Cabinets',
    wood: 'Black Walnut',
    scale: '1:12',
    relatedPost: '/blog/miniature-highboy-makers-guide',
  },
  {
    id: 'four-poster-bed',
    title: 'Shaker Style Pencil Post Bed',
    description: 'This 1/12 scale miniature Shaker style pencil post bed is handcrafted from warm cherry wood, embodying the simple, functional elegance of classic Shaker design. It features four slender, octagonal posts that gently taper toward the bottom, rising to support a clean canopy frame with precise mortise-and-tenon joinery for authentic strength and detail. The headboard is unadorned with a graceful, gently curved shape and a signature circular cutout, while the overall open, rectangular structure highlights the wood\'s natural grain and smooth finish against a neutral backdrop. A timeless, minimalist piece perfect for a period miniature bedroom, capturing Shaker restraint and craftsmanship in exquisite small scale.',
    images: ['/images/gallery/four-poster-bed.webp'],
    category: 'Beds',
    wood: 'Cherry',
    scale: '1:12',
    relatedPost: '/blog/building-miniature-four-poster-bed',
  },
  {
    id: 'maloof-rocking-chair',
    title: 'Sam Maloof Style Rocking Chair',
    description: 'This exquisite 1/12 scale miniature rocking chair is my handcrafted tribute to the timeless style pioneered by Sam Maloof—a design renowned for its elegant, organic curves, sculptural form, and masterful blend of comfort and artistry. Inspired by the flowing, hand-shaped lines of iconic mid-century rockers from the Studio Craft movement, this piece captures that signature sense of movement and warmth: sensuous contours that invite relaxation, subtle sculpting that feels alive to the touch, and an honest simplicity that honors traditional woodworking without unnecessary ornament. I built this one-of-a-kind miniature using Brazilian Rosewood, finished with a rich oil that deepens the wood\'s warm tones and reveals its natural grain. It was constructed exactly as the full-size originals would be—using traditional joinery techniques for lasting strength and authenticity, scaled down precisely to maintain the same proportional balance and rocking dynamics in miniature form. Give it a gentle push, and it rocks smoothly for a full 27 seconds—proof of the careful engineering and proportion poured into every detail. As a unique, personal interpretation rather than a direct copy, this chair stands as a singular homage to enduring craftsmanship. A true collector\'s gem in miniature form, handmade one at a time in my workshop. This particular piece resides in the <a href="https://www.ksbminiaturescollection.com/" target="_blank" rel="noopener noreferrer">KSB Miniatures Collection</a> (a premier museum of fine miniatures in Maysville, Kentucky), where it\'s proudly displayed among other exceptional works—further testament to its quality and appeal to serious collectors.',
    images: ['/images/gallery/windsor-chair.webp'],
    category: 'Chairs',
    wood: 'Brazilian Rosewood',
    scale: '1:12',
    relatedPost: '/blog/arts-and-crafts-miniature-furniture',
  },
  {
    id: 'hepplewhite-shield-back-chair',
    title: 'Hepplewhite Shield Back Style Chair',
    description: 'This exquisite 1/12 scale miniature Hepplewhite shield back chair (often called a "Hap White" style in miniature circles) is a handcrafted tribute to the graceful late 18th-century Hepplewhite dining chairs that defined Federal-era elegance. Made entirely from rich mahogany, it features a warm, deep finish that accentuates the wood\'s natural luster and fine grain. The highlight is the hand-carved shield back—a classic pierced splat with flowing, interlaced ribs and delicate central motifs, meticulously sculpted by hand for intricate detail, lightness, and that signature airy sophistication. Every joint uses traditional mortise and tenon construction for superior strength and authentic period authenticity in this tiny scale. The seat is upholstered in a soft, textured fabric (a subtle grayish-blue/green tone), providing beautiful contrast and comfort against the polished mahogany frame. The legs are elegant square-tapered forms, perfectly proportioned to capture Hepplewhite\'s refined simplicity and balance. This chair is a testament to masterful miniature woodworking: precise hand carving, flawless joinery, and historical accuracy that makes it feel like a genuine antique reduced to dollhouse perfection. This particular piece resides in the <a href="https://www.ksbminiaturescollection.com/" target="_blank" rel="noopener noreferrer">KSB Miniatures Collection</a> (a premier museum of fine miniatures in Maysville, Kentucky), where it\'s proudly displayed among other exceptional works. It\'s a standout for serious collectors who value pieces with proven exhibition quality. Handmade one at a time in my workshop, it\'s ready to elevate any discerning miniature collection.',
    images: ['/images/gallery/dining-table.webp'],
    category: 'Chairs',
    wood: 'Mahogany',
    scale: '1:12',
    relatedPost: '/blog/federal-period-miniature-furniture',
  },
  {
    id: 'moser-continuous-arm-chair',
    title: 'Thomas Moser Continuous Arm Style Chair',
    description: 'This exquisite 1/12 scale miniature Thomas Moser Continuous Arm style chair is a handcrafted homage to the iconic design by Thos. Moser—a modern evolution of the classic Windsor style, celebrated for its sweeping, fluid lines, simplicity, and exceptional comfort. Made with a beautiful combination of ash and cherry, it features an oil finish that enhances the natural warmth, grain, and subtle contrast between the woods. The signature continuous arm flows seamlessly in one graceful arc, hand-shaped for that distinctive, ergonomic sweep. Every joint is executed with traditional mortise and tenon construction, ensuring strength, precision, and authentic craftsmanship in miniature form. The spindled back and splayed legs capture the chair\'s lightweight yet sturdy character, while the contoured seat adds to its timeless appeal—distilling generations of woodworking know-how into a compact, collector-worthy piece. This is a true testament to masterful miniature artistry: clean lines, flawless joinery, and balanced proportion that echoes the original\'s enduring elegance. Handmade one at a time in my workshop.',
    images: ['/images/gallery/blanket-chest.webp'],
    category: 'Chairs',
    wood: 'Ash & Cherry',
    scale: '1:12',
    relatedPost: '/blog/shaker-style-miniature-furniture',
  },
  {
    id: 'shaker-d-ring-table',
    title: 'Shaker Style D-Ring Table',
    description: 'This exquisite 1/12 scale miniature Shaker-style D-ring table (a classic extension dining table with rounded D-shaped ends) is a handcrafted celebration of Shaker simplicity, functionality, and timeless proportion—perfectly suited for a miniature dining room or parlor setting. Built primarily from rich cherry wood, it features a warm, deep oil finish that enhances the natural grain and brings out the subtle reddish tones characteristic of the species. The distinctive D-shaped top includes two removable extension leaves that slide in and out for flexible sizing, allowing the table to collapse neatly into a compact four-seater when the leaves are stored—transforming it effortlessly for everyday use or larger gatherings. The leaves attach and extend via precisely crafted maple sliding dovetail mechanisms, enabling smooth, secure operation in miniature scale without any visible hardware or complexity. This traditional joinery method ensures durability and authentic Shaker craftsmanship: clean lines, honest construction, and no unnecessary ornamentation. The table stands on elegant, tapered legs that maintain perfect balance in any configuration—capturing the essence of Shaker design where form follows function with graceful restraint. A true collector\'s gem that blends masterful woodworking detail, practical ingenuity, and historical accuracy in tiny form. Handmade one at a time in my workshop, it\'s ready to enhance any discerning miniature collection.',
    images: ['/images/gallery/corner-cupboard.webp'],
    category: 'Tables',
    wood: 'Cherry',
    scale: '1:12',
    relatedPost: '/blog/shaker-style-miniature-furniture',
  },
];

// FAQ data for miniature furniture
export const FAQ_DATA = [
  {
    question: 'What scale are your miniature furniture pieces?',
    answer:
      'All pieces are built in <a href="/blog/complete-guide-1-12-scale-miniature-furniture">1:12 scale</a> (also known as one-inch scale), which is the most popular scale for dollhouse collectors. This means one inch in the miniature equals one foot in real life. A six-foot tall highboy becomes a six-inch masterpiece. For a deeper dive, see our <a href="/blog/understanding-dollhouse-scales">understanding dollhouse scales guide</a>.',
  },
  {
    question: 'Are these made from kits?',
    answer:
      'Absolutely not. Every piece is built entirely from scratch using fine hardwoods like mahogany, cherry, walnut, and maple. I use the same <a href="/blog/miniature-woodworking-joints">traditional woodworking techniques</a> as full-size furniture makers: <a href="/blog/miniature-woodworking-joints">hand-cut dovetails</a>, mortise and tenon joints, and hand-carved details. No kits, no laser cuts, no shortcuts. Learn more about the difference in our article on <a href="/blog/handcrafted-vs-kit-built-miniatures">handcrafted vs kit-built miniatures</a>.',
  },
  {
    question: 'What types of wood do you use?',
    answer:
      'I work primarily with mahogany, cherry, walnut, maple, and oak. Each wood is selected for its grain pattern, workability at small scale, and historical accuracy to the period of furniture being reproduced. I also use exotic woods when a piece calls for it. Read our complete <a href="/blog/how-to-choose-wood-for-miniature-furniture">guide to choosing wood for miniatures</a>.',
  },
  {
    question: 'How long does it take to build a single piece?',
    answer:
      'Depending on complexity, a single piece can take anywhere from 40 to over 200 hours. A simple <a href="/gallery">rocking chair</a> might take 40-60 hours, while a complex piece like the <a href="/blog/john-goddard-block-front-secretary-desk-miniature">John Goddard block-front secretary desk</a> can take 200+ hours due to the intricate shell carvings and dozens of tiny drawers.',
  },
  {
    question: 'Do you take custom commissions?',
    answer:
      'Yes, I welcome commission requests. Whether you want a specific period piece, a replica of a family heirloom, or a custom design, I am happy to discuss your vision. Please use the <a href="/contact">contact form</a> to describe what you have in mind and I will get back to you with details. You can also browse our <a href="/gallery">gallery</a> for inspiration.',
  },
  {
    question: 'How should I care for and display my miniature furniture?',
    answer:
      'Miniature furniture should be kept out of direct sunlight to prevent fading. Display cases with UV-protective glass are ideal. Handle pieces by their base or sturdiest parts, and keep them in a climate-controlled environment. Each piece is finished with museum-quality lacquer or French polish for lasting protection. For detailed display and care tips, read our <a href="/blog/displaying-protecting-miniature-furniture-collection">complete display guide</a>.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes. Each piece is carefully packed in custom-fitted foam and shipped in a rigid box to ensure safe arrival anywhere in the world. Full insurance is included with every shipment.',
  },
  {
    question: 'What makes your miniatures different from mass-produced dollhouse furniture?',
    answer:
      'The difference is night and day. Mass-produced miniatures are typically made from resin, plastic, or laser-cut MDF. My pieces are hand-built from solid hardwoods using the same joinery techniques as full-size <a href="/blog/history-miniature-furniture-royal-courts-modern">period furniture</a>. Every drawer opens, every door swings on hand-made hinges, and every detail is historically accurate. Learn more in our <a href="/blog/handcrafted-vs-kit-built-miniatures">handcrafted vs kit-built miniatures</a> comparison. See the difference for yourself in our <a href="/gallery">gallery</a>.',
  },
];
