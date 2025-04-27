import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Ashwagandha Root Powder',
    description: 'An adaptogenic herb that helps the body manage stress and promotes overall wellbeing.',
    price: 24.99,
    image: 'https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg',
    category: 'herbs',
    doshaBalancing: ['vata', 'kapha'],
    benefits: ['Reduces stress and anxiety', 'Boosts immunity', 'Improves sleep quality', 'Enhances energy levels'],
    ingredients: ['Organic Ashwagandha Root Powder (Withania somnifera)'],
    usage: 'Mix 1/2 teaspoon with warm milk or water, preferably before bedtime.',
    inStock: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: '2',
    name: 'Triphala Digestive Support',
    description: 'A traditional Ayurvedic formula that supports digestive health and gentle detoxification.',
    price: 19.99,
    image: 'https://images.pexels.com/photos/5938392/pexels-photo-5938392.jpeg',
    category: 'supplements',
    doshaBalancing: ['vata', 'pitta', 'kapha'],
    benefits: ['Supports healthy digestion', 'Promotes regular elimination', 'Gentle detoxification', 'Antioxidant properties'],
    ingredients: ['Organic Amalaki fruit (Emblica officinalis)', 'Organic Bibhitaki fruit (Terminalia bellirica)', 'Organic Haritaki fruit (Terminalia chebula)'],
    usage: 'Take 2 capsules with warm water before bedtime.',
    inStock: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Tranquil Mind Herbal Tea',
    description: 'A calming blend of herbs designed to quiet the mind and promote relaxation.',
    price: 16.99,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
    category: 'teas',
    doshaBalancing: ['vata', 'pitta'],
    benefits: ['Reduces stress and anxiety', 'Promotes mental clarity', 'Supports quality sleep', 'Calms nervous system'],
    ingredients: ['Organic Chamomile flowers', 'Organic Lemon balm', 'Organic Lavender flowers', 'Organic Passionflower', 'Organic Tulsi (Holy Basil)'],
    usage: 'Steep 1 teaspoon in hot water for 5-7 minutes. Enjoy 1-2 cups daily, especially in the evening.',
    inStock: true,
    rating: 4.9,
    reviewCount: 105
  },
  {
    id: '4',
    name: 'Balance Massage Oil',
    description: 'A warming massage oil blend that nourishes the skin and balances vata dosha.',
    price: 29.99,
    image: 'https://images.pexels.com/photos/3998000/pexels-photo-3998000.jpeg',
    category: 'oils',
    doshaBalancing: ['vata'],
    benefits: ['Reduces dryness', 'Calms nervous system', 'Promotes circulation', 'Grounds energy'],
    ingredients: ['Organic Sesame oil base', 'Essential oils of Sweet Orange', 'Frankincense', 'Lavender', 'Ginger', 'Infused with Ashwagandha and Bala herbs'],
    usage: 'Warm oil between palms and apply to body before shower or bath. For optimal results, leave on for 15-20 minutes.',
    inStock: true,
    rating: 4.6,
    reviewCount: 78
  },
  {
    id: '5',
    name: 'Cooling Pitta Face Cream',
    description: 'A lightweight, cooling moisturizer designed to soothe sensitive and pitta-prone skin.',
    price: 34.99,
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg',
    category: 'skincare',
    doshaBalancing: ['pitta'],
    benefits: ['Reduces redness and inflammation', 'Hydrates without oiliness', 'Soothes sensitive skin', 'Balances pH level'],
    ingredients: ['Organic Aloe Vera gel', 'Rose water', 'Sunflower oil', 'Coconut oil', 'Shea butter', 'Neem extract', 'Cucumber extract', 'Sandalwood oil', 'Vetiver oil'],
    usage: 'Apply to clean face and neck morning and evening, or as needed.',
    inStock: true,
    rating: 4.8,
    reviewCount: 93
  },
  {
    id: '6',
    name: 'Kapha Invigorating Body Scrub',
    description: 'An energizing scrub with warming spices to stimulate circulation and reduce kapha congestion.',
    price: 28.99,
    image: 'https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg',
    category: 'skincare',
    doshaBalancing: ['kapha'],
    benefits: ['Stimulates circulation', 'Removes dead skin cells', 'Reduces congestion', 'Promotes energy and vitality'],
    ingredients: ['Sea salt', 'Organic raw sugar', 'Sunflower oil', 'Ginger essential oil', 'Cinnamon essential oil', 'Organic coffee grounds', 'Lemon peel', 'Eucalyptus essential oil'],
    usage: 'Apply to damp skin in circular motions, focusing on areas of dryness. Rinse thoroughly. Use 1-2 times weekly.',
    inStock: true,
    rating: 4.7,
    reviewCount: 67
  },
  {
    id: '7',
    name: 'Clarity Mind Tincture',
    description: 'A concentrated herbal extract designed to enhance mental clarity and cognitive function.',
    price: 39.99,
    image: 'https://images.pexels.com/photos/5749142/pexels-photo-5749142.jpeg',
    category: 'supplements',
    doshaBalancing: ['vata', 'kapha'],
    benefits: ['Enhances mental clarity', 'Improves memory and concentration', 'Reduces mental fatigue', 'Supports brain health'],
    ingredients: ['Organic Brahmi (Bacopa monnieri)', 'Organic Gotu Kola (Centella asiatica)', 'Organic Shankhpushpi (Convolvulus pluricaulis)', 'Organic Licorice root', 'Alcohol base (30%)', 'Purified water'],
    usage: 'Take 30 drops (about 1 dropper) in water or juice 1-2 times daily.',
    inStock: true,
    rating: 4.8,
    reviewCount: 82
  },
  {
    id: '8',
    name: 'Digestive Harmony Tea',
    description: 'A warming digestive tea that helps soothe the digestive tract and promote healthy metabolism.',
    price: 18.99,
    image: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg',
    category: 'teas',
    doshaBalancing: ['vata', 'kapha'],
    benefits: ['Improves digestion', 'Reduces bloating', 'Alleviates gas', 'Supports nutrient absorption'],
    ingredients: ['Organic Ginger root', 'Organic Cinnamon bark', 'Organic Cardamom seed', 'Organic Fennel seed', 'Organic Licorice root', 'Organic Peppermint leaf'],
    usage: 'Steep 1 teaspoon in hot water for 5-7 minutes. Enjoy after meals to aid digestion.',
    inStock: true,
    rating: 4.9,
    reviewCount: 108
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductsByDosha = (dosha: DohaType): Product[] => {
  return products.filter(product => product.doshaBalancing.includes(dosha as any));
};

type DohaType = 'vata' | 'pitta' | 'kapha';