/**
 * Centralized Carousel Slide Configuration
 *
 * ============================================================================
 * HOW TO CHANGE A CARD'S IMAGE:
 * ============================================================================
 * 1. Place your image file inside the `/public/images/` directory:
 *    Example: `/public/images/my-new-photo.jpg`
 *
 * 2. In the `carouselSlides` array below, update ONLY the `image` property:
 *    image: "/images/my-new-photo.jpg"
 *
 * 3. Optional: Adjust `imagePosition` if the subject is not centered:
 *    imagePosition: "center 35%" or "50% 20%"
 * ============================================================================
 */

export interface CarouselSlide {
  id: string | number;
  // CHANGE SLIDE IMAGE HERE:
  image: string;
  fallbackImage?: string;
  imagePosition?: string;
  title: string;
  description: string;
  secondaryText?: string;
  buttonText: string;
  buttonLink: string;
  badge?: string;
}

export const carouselSlides: CarouselSlide[] = [
  {
    id: "live",
    // CHANGE SLIDE IMAGE HERE
    image: "/images/slide-1.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
    imagePosition: "center 40%",
    title: "OVO Live. For the Atmosphere.",
    description: "Exclusive ticket access for all our customers at OVO Hydro, The O2 arena and Co-op Live.",
    secondaryText: "Because atmosphere is everything.",
    buttonText: "Join for free",
    buttonLink: "#",
    badge: "VIP Access",
  },
  {
    id: "app",
    // CHANGE SLIDE IMAGE HERE
    image: "/images/slide-2.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&auto=format&fit=crop&q=80",
    imagePosition: "center 30%",
    title: "It's easy on the app",
    description: "Keep an eye on your balance, get home energy insights, and manage your account on the go.",
    secondaryText: "Rated 4.8★ by over 150,000 customers.",
    buttonText: "Download now",
    buttonLink: "#",
    badge: "Smart Mobile",
  },
  {
    id: "beyond",
    // CHANGE SLIDE IMAGE HERE
    image: "/images/slide-3.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
    imagePosition: "center center",
    title: "Beyond. Rewards for cleaner living.",
    description: "Unlock discounts, free treats, and exclusive eco-friendly rewards as you save energy.",
    secondaryText: "Green living made genuinely rewarding.",
    buttonText: "Explore rewards",
    buttonLink: "#",
    badge: "Green Rewards",
  },
  {
    id: "charge-anytime",
    // CHANGE SLIDE IMAGE HERE
    image: "/images/slide-4.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1200&auto=format&fit=crop&q=80",
    imagePosition: "center 45%",
    title: "Charge Anytime. Smart EV Charging.",
    description: "Charge your electric vehicle at ultra-low green off-peak rates anytime day or night.",
    secondaryText: "Save up to £300 a year on your driving costs.",
    buttonText: "See EV savings",
    buttonLink: "#",
    badge: "EV Charging",
  },
  {
    id: "careers",
    // CHANGE SLIDE IMAGE HERE
    image: "/images/slide-5.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
    imagePosition: "center 35%",
    title: "Build Skills & Launch Your Career",
    description: "Discover verified internships, real-world project portfolios, and certified training programs.",
    secondaryText: "Connect with 500+ top hiring partners.",
    buttonText: "Explore internships",
    buttonLink: "#",
    badge: "Career Launch",
  },
];
