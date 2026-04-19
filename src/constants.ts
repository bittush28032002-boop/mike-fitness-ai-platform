import { TrainingPlan, Testimonial } from './types';

export const BRAND_NAME = "Mike Johnson Fitness";
export const TRAINER_NAME = "Mike Johnson";
export const LOCATION = "Los Angeles, California";

export const TRAINING_PLANS: TrainingPlan[] = [
  {
    id: 'quick-start',
    name: "Quick Start",
    price: 49,
    duration: "7 Days",
    features: [
      "Basic Workout Routine",
      "Simple Meal Guide",
      "Entry-level Orientation",
      "Quick Results Protocol"
    ],
    description: "Perfect for beginners. Start your transformation with this foundational 7-day protocol."
  },
  {
    id: 'weight-loss',
    name: "Weight Loss",
    price: 99,
    duration: "30 Days",
    features: [
      "Custom Diet Plan",
      "HIIT Workout Routine",
      "Weekly Progress Check-in",
      "Email Support"
    ],
    description: "Shred fat and get lean with our science-backed protocol."
  },
  {
    id: 'muscle-gain',
    name: "Muscle Gain",
    price: 149,
    duration: "45 Days",
    features: [
      "Hypertrophy Program",
      "Protein Optimization Guide",
      "Progress Tracking App",
      "Video Form Analysis"
    ],
    description: "Build serious lean mass with optimized resistance training."
  },
  {
    id: 'online-coaching',
    name: "Online Coaching",
    price: 199,
    duration: "60 Days",
    features: [
      "Bi-Weekly Zoom Sessions",
      "Daily Message Support",
      "Dynamic Meal Planning",
      "Full Lifestyle Audit"
    ],
    description: "Elite 1-on-1 guidance from anywhere in the world."
  },
  {
    id: 'personal-training',
    name: "1-on-1 Personal Training",
    price: 299,
    duration: "Per Session",
    features: [
      "Exclusive LA Gym Access",
      "Hands-on Form Correction",
      "In-person Motivation",
      "Nutritional Supplement Guide"
    ],
    description: "Premium in-person experience in our luxury LA facility."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "David",
    review: "Lost 12kg in 3 months with Mike. The methodology is unmatched and the support is constant.",
    rating: 5
  },
  {
    id: '2',
    name: "Sophia",
    review: "Best trainer in LA. Amazing results and a complete shift in my relationship with fitness.",
    rating: 5
  }
];

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/mikefitness",
  youtube: "https://youtube.com/mikefitness",
  tiktok: "https://tiktok.com/@mikefitness",
  whatsapp: "https://wa.me/13235551234"
};
