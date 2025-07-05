import { DoshaQuizQuestion, DoshaDescriptions } from '../types';

export const quizQuestions: DoshaQuizQuestion[] = [
  {
    id: 1,
    question: "What is your body frame like?",
    options: {
      vata: "I am thin and my bones are prominent. I find it difficult to gain weight.",
      pitta: "I have a medium build with moderate muscle development.",
      kapha: "I have a solid, heavy build and tend to gain weight easily."
    }
  },
  {
    id: 2,
    question: "How is your skin typically?",
    options: {
      vata: "My skin is dry, thin, or rough. It tends to crack easily.",
      pitta: "My skin is warm, fair or reddish, with freckles or acne. It's sensitive to the sun.",
      kapha: "My skin is thick, oily, cool, and smooth with good hydration."
    }
  },
  {
    id: 3,
    question: "How would you describe your hair?",
    options: {
      vata: "My hair is dry, frizzy, or brittle and breaks easily.",
      pitta: "My hair is fine, light, or prematurely gray/balding. It can be oily.",
      kapha: "My hair is thick, heavy, wavy, and oily. It tends to be very lustrous."
    }
  },
  {
    id: 4,
    question: "How would you describe your appetite?",
    options: {
      vata: "Variable and irregular. I can forget to eat or skip meals.",
      pitta: "Strong and predictable. I get irritable if I miss meals.",
      kapha: "Steady but can be slow. I can easily skip meals without much discomfort."
    }
  },
  {
    id: 5,
    question: "How would you describe your digestion?",
    options: {
      vata: "Irregular with bloating and gas. I can experience constipation.",
      pitta: "Quick and efficient, but I may experience heartburn or acid reflux.",
      kapha: "Slow but steady. I may feel heavy after eating."
    }
  },
  {
    id: 6,
    question: "How do you generally respond to weather?",
    options: {
      vata: "I dislike cold, windy weather and prefer warmth.",
      pitta: "I dislike hot weather and prefer cool environments.",
      kapha: "I dislike cold, damp weather but can tolerate other conditions well."
    }
  },
  {
    id: 7,
    question: "How would you describe your sleep patterns?",
    options: {
      vata: "Light and interrupted. I may have trouble falling asleep.",
      pitta: "Moderate and regular, but I can wake up if too hot.",
      kapha: "Deep and long. I may find it difficult to wake up in the morning."
    }
  },
  {
    id: 8,
    question: "How would you describe your natural energy level throughout the day?",
    options: {
      vata: "Variable with bursts of energy followed by fatigue.",
      pitta: "Strong and purposeful. I'm goal-oriented with good endurance.",
      kapha: "Steady and sustained, but it takes me time to get going."
    }
  },
  {
    id: 9,
    question: "How do you typically respond to stress?",
    options: {
      vata: "I get anxious, worried, or overwhelmed easily.",
      pitta: "I become irritable, angry, or overly critical.",
      kapha: "I withdraw or become stubborn, preferring to avoid conflict."
    }
  },
  {
    id: 10,
    question: "How would you describe your temperament?",
    options: {
      vata: "Creative, enthusiastic, and quick, but I can be indecisive.",
      pitta: "Focused, intelligent, and decisive, but I can be judgmental.",
      kapha: "Calm, steady, and compassionate, but I can be resistant to change."
    }
  },
  {
    id: 11,
    question: "How is your memory?",
    options: {
      vata: "I learn quickly but forget quickly too.",
      pitta: "I have a sharp, focused memory for details that matter to me.",
      kapha: "I learn slowly but retain information for a long time once learned."
    }
  },
  {
    id: 12,
    question: "How do you manage finances?",
    options: {
      vata: "Impulsive spending, often on multiple small purchases.",
      pitta: "Strategic spending on quality items, good at saving for goals.",
      kapha: "Cautious spender who saves consistently and dislikes financial risk."
    }
  },
  {
    id: 13,
    question: "How do you approach physical activity?",
    options: {
      vata: "I enjoy light activities like walking, dancing, or yoga.",
      pitta: "I enjoy challenging sports and competitive activities.",
      kapha: "I prefer gentle, steady exercise and need motivation to start."
    }
  },
  {
    id: 14,
    question: "How would you describe your communication style?",
    options: {
      vata: "Fast-paced, enthusiastic, sometimes jumping between topics.",
      pitta: "Direct, clear, and persuasive, sometimes confrontational.",
      kapha: "Thoughtful, supportive, and methodical, sometimes reserved."
    }
  },
  {
    id: 15,
    question: "What describes your work style best?",
    options: {
      vata: "Multi-tasker who enjoys variety and creativity but may leave tasks unfinished.",
      pitta: "Focused and efficient, goal-oriented with leadership qualities.",
      kapha: "Methodical, reliable, and patient, preferring routine and stability."
    }
  }
];

export const doshaDescriptions: DoshaDescriptions = {
  vata: {
    title: "Vata - Air & Space",
    shortDescription: "Quick, creative, and adaptive, but prone to anxiety when imbalanced.",
    longDescription: "Vata types are creative, quick-thinking, and adaptable. When in balance, they are energetic, enthusiastic, and imaginative. When out of balance, they may experience anxiety, insomnia, dry skin, and irregular digestion. Vata is balanced by routine, warmth, nourishing foods, and grounding practices.",
    characteristics: [
      "Creative and imaginative",
      "Quick to learn new information",
      "Light, thin physical frame",
      "Tendency toward dry skin and hair",
      "Variable energy and appetite",
      "Quick, adaptable movement"
    ],
    recommendations: [
      "Maintain regular daily routines",
      "Stay warm and avoid excessive cold",
      "Practice gentle, grounding exercises like yoga",
      "Eat warm, nourishing, cooked foods",
      "Use warming spices like ginger and cinnamon",
      "Practice meditation to calm the mind"
    ]
  },
  pitta: {
    title: "Pitta - Fire & Water",
    shortDescription: "Sharp, focused, and determined, but prone to irritability when imbalanced.",
    longDescription: "Pitta types are naturally focused, intelligent, and goal-oriented. When in balance, they are productive, decisive, and good leaders. When out of balance, they may experience inflammation, irritability, and digestive issues. Pitta is balanced by moderation, cooling activities, and a calm environment.",
    characteristics: [
      "Sharp intellect and good concentration",
      "Natural leaders with strong drive",
      "Medium, athletic build",
      "Warm skin that flushes easily",
      "Strong appetite and metabolism",
      "Precise, purposeful movement"
    ],
    recommendations: [
      "Avoid excessive heat and sun exposure",
      "Practice cooling, calming activities",
      "Maintain a regular eating schedule",
      "Choose cooling, fresh foods",
      "Practice non-competitive exercise",
      "Make time for relaxation and play"
    ]
  },
  kapha: {
    title: "Kapha - Earth & Water",
    shortDescription: "Stable, nurturing, and patient, but prone to stagnation when imbalanced.",
    longDescription: "Kapha types are naturally stable, compassionate, and strong. When in balance, they are nurturing, patient, and reliable. When out of balance, they may experience weight gain, lethargy, and emotional attachment. Kapha is balanced by stimulation, warmth, and regular exercise.",
    characteristics: [
      "Calm and grounded nature",
      "Excellent long-term memory",
      "Strong, solid physical frame",
      "Smooth, cool skin",
      "Steady energy levels",
      "Graceful, flowing movement"
    ],
    recommendations: [
      "Maintain an active lifestyle",
      "Practice energizing exercises",
      "Follow a light, warming diet",
      "Rise early with the sun",
      "Seek variety and new experiences",
      "Practice stimulating breathing exercises"
    ]
  }
};