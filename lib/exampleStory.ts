// Example story: "The Witch in the Forest"
// This is a read-only example story to help kids learn how to write stories

import { Story } from '@/types/Story';

export const exampleStory: Story = {
  id: 'example-story-witch',
  title: 'The Witch in the Forest',
  description: 'A magical adventure about a kind witch who lives in an enchanted forest and helps lost animals find their way home.',
  genre: 'fantasy',
  ageRange: { min: 6, max: 10 },
  coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM4YjVjZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2MzM4ODAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+OsiBXaXRjaCBpbiB0aGUgRm9yZXN0PC90ZXh0Pjwvc3ZnPg==',
  coverImageBack: '',
  pages: [
    // Chapter 1: The Discovery (Pages 1-4)
    {
      id: 'ex-ch1-p1',
      pageNumber: 1,
      title: 'Chapter 1: The Discovery',
      content: 'Once upon a time, in a deep, dark forest filled with tall trees and singing birds, there lived a kind witch named Luna. Unlike other witches you might have heard about, Luna was gentle and loved helping others.\n\nLuna had lived in the forest for many, many years. She knew every tree, every path, and every creature that called the forest home. The animals trusted her completely because she had never done anything to hurt them. Instead, she spent her days making sure everyone was safe and happy.\n\nHer cottage was hidden deep in the woods, surrounded by ancient oak trees that whispered secrets in the wind. The forest was her home, and she was its protector.',
      image: undefined,
      layout: 'text-image',
      characters: ['luna'],
      settings: {
        location: 'Enchanted Forest',
        timeOfDay: 'Morning',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch1-p2',
      pageNumber: 2,
      title: 'Chapter 1: The Discovery',
      content: 'Luna lived in a cozy cottage made of gingerbread and candy, with a roof of chocolate shingles. Her garden was filled with magical flowers that glowed in the moonlight. Every morning, she would wake up early to tend to her plants and help any animals that needed her.\n\nThe cottage was small but warm, with windows that let in the morning sunlight. Inside, Luna had shelves filled with jars of magical ingredients - sparkling powders, colorful potions, and dried herbs that smelled like cinnamon and honey. Her favorite place was her garden, where she grew flowers that changed colors depending on the weather.\n\nEvery morning, before the sun was fully up, Luna would put on her purple robes and go outside to water her plants. The flowers would sing soft melodies as she worked, and butterflies would dance around her head.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna'],
      settings: {
        location: 'Luna\'s Cottage',
        timeOfDay: 'Morning',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch1-p3',
      pageNumber: 3,
      title: 'Chapter 1: The Discovery',
      content: 'One sunny morning, as Luna was watering her magical flowers, she heard a small, sad cry coming from the edge of the forest. She followed the sound and discovered a little bunny who had lost its way home. The bunny was scared and couldn\'t find its family.\n\nThe bunny was small and fluffy, with soft brown fur and big, worried eyes. It was sitting under a large fern, shivering slightly even though the sun was warm. When Luna approached, the bunny looked up at her with hope in its eyes.\n\n"Hello there, little one," Luna said softly, kneeling down so she wouldn\'t seem so tall. "What\'s wrong? Are you lost?" The bunny nodded, its little nose twitching. "Don\'t worry," Luna smiled, "I\'ll help you find your way home. That\'s what I do best."',
      image: undefined,
      layout: 'text-image',
      characters: ['luna', 'bunny'],
      settings: {
        location: 'Forest Edge',
        timeOfDay: 'Morning',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch1-p4',
      pageNumber: 4,
      title: 'Chapter 1: The Discovery',
      content: 'Luna smiled warmly and said, "Don\'t worry, little one. I\'ll help you find your family." She waved her magic wand, and a trail of glowing footprints appeared on the ground, leading straight to the bunny\'s burrow. The bunny hopped happily along the trail and was reunited with its family.\n\nThe magic footprints glowed with a soft golden light, making a clear path through the forest. The bunny\'s eyes widened with wonder as it saw the trail appear. It hopped carefully at first, then more confidently as it recognized the way home.\n\nWhen they reached the burrow, the bunny\'s family was waiting anxiously. The mother bunny rushed forward to hug her little one, and the bunny\'s siblings gathered around excitedly. Luna watched with a warm heart as the family was reunited. "Thank you, kind witch!" the mother bunny called out. Luna simply smiled and waved her wand, making the footprints fade away gently.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna', 'bunny'],
      settings: {
        location: 'Forest Path',
        timeOfDay: 'Morning',
        weather: 'Sunny'
      }
    },
    // Chapter 2: The Magic Spell (Pages 5-8)
    {
      id: 'ex-ch2-p1',
      pageNumber: 5,
      title: 'Chapter 2: The Magic Spell',
      content: 'Word spread quickly through the forest about Luna\'s kindness. Soon, more animals came to her for help. A family of squirrels needed help finding their lost acorns, and a little bird had broken its wing.\n\nNews traveled fast among the forest creatures. The birds sang songs about Luna\'s helpfulness, and the rabbits told stories of her magic. Before long, animals from all over the forest began making their way to Luna\'s cottage.\n\nOne day, a family of squirrels arrived looking worried. "We\'ve lost all our acorns!" the father squirrel explained. "We gathered them for winter, but now we can\'t find them anywhere!" Luna listened carefully and promised to help them find their precious acorns.',
      image: undefined,
      layout: 'text-image',
      characters: ['luna'],
      settings: {
        location: 'Luna\'s Cottage',
        timeOfDay: 'Afternoon',
        weather: 'Cloudy'
      }
    },
    {
      id: 'ex-ch2-p2',
      pageNumber: 6,
      title: 'Chapter 2: The Magic Spell',
      content: 'Luna used her magic to help everyone. For the squirrels, she created a magical map that showed exactly where their acorns were hidden. For the bird, she brewed a special healing potion that made its wing strong again.\n\nLuna went to her workbench and pulled out a large piece of parchment. She waved her wand over it, and a beautiful map appeared, showing every tree and path in the forest. Tiny golden dots marked where the acorns were hidden. "Here they are!" she said, pointing to the map. The squirrels were amazed and quickly found all their acorns.\n\nFor the little bird with the broken wing, Luna mixed special herbs and flowers in her cauldron. The potion glowed with a soft blue light. She carefully applied it to the bird\'s wing, and within moments, the wing was as good as new. The bird chirped happily and flew around Luna\'s head in circles.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna'],
      settings: {
        location: 'Luna\'s Cottage',
        timeOfDay: 'Afternoon',
        weather: 'Cloudy'
      }
    },
    {
      id: 'ex-ch2-p3',
      pageNumber: 7,
      title: 'Chapter 2: The Magic Spell',
      content: 'But one day, a big problem came to the forest. A terrible storm had destroyed many of the animals\' homes. The forest creatures were sad and didn\'t know what to do. They all came to Luna for help.\n\nThe storm had been fierce, with howling winds and heavy rain that lasted for three days. When it finally stopped, the animals emerged from their hiding places to find their homes in ruins. Trees had fallen, burrows were flooded, and nests were scattered on the ground.\n\nAll the forest creatures gathered at Luna\'s cottage, looking worried and sad. The rabbits had lost their burrow, the birds had lost their nests, and even the squirrels\' tree had been damaged. "What will we do?" they asked Luna. "We have nowhere to live!"',
      image: undefined,
      layout: 'text-image',
      characters: ['luna'],
      settings: {
        location: 'Forest',
        timeOfDay: 'Evening',
        weather: 'Stormy'
      }
    },
    {
      id: 'ex-ch2-p4',
      pageNumber: 8,
      title: 'Chapter 2: The Magic Spell',
      content: 'Luna knew she needed to use her most powerful magic. She gathered all the animals together and chanted a special spell. "By the magic of friendship and kindness, let new homes grow strong and true!" A bright light filled the forest, and new homes appeared for all the animals.\n\nLuna stood in the center of the clearing, surrounded by all her forest friends. She raised her wand high above her head and began to chant. The words were ancient and powerful, filled with love and care for the forest and its creatures.\n\nAs she spoke, a warm golden light spread from her wand, touching every part of the forest. The light was gentle and kind, and wherever it touched, new homes began to grow. A beautiful new burrow appeared for the rabbits, complete with soft grass inside. New nests appeared in the trees for the birds, stronger than before. And the squirrels\' tree was repaired, with a cozy new hollow for them to live in.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna'],
      settings: {
        location: 'Forest',
        timeOfDay: 'Evening',
        weather: 'Sunny'
      }
    },
    // Chapter 3: The Celebration (Pages 9-12)
    {
      id: 'ex-ch3-p1',
      pageNumber: 9,
      title: 'Chapter 3: The Celebration',
      content: 'All the animals were so grateful to Luna for her help. They decided to throw a big celebration in her honor. The forest was decorated with beautiful flowers and colorful ribbons. Everyone was excited!\n\nThe animals worked together to prepare the celebration. The birds gathered the most beautiful flowers from all over the forest and arranged them in colorful patterns. The rabbits helped hang ribbons between the trees, creating a festive canopy. The squirrels collected the best nuts and berries to share.\n\nEveryone was busy and happy, preparing for the big party. They wanted to show Luna how much they appreciated everything she had done for them. The forest had never looked so beautiful, and the animals had never been so excited.',
      image: undefined,
      layout: 'text-image',
      characters: ['luna'],
      settings: {
        location: 'Forest Clearing',
        timeOfDay: 'Evening',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch3-p2',
      pageNumber: 10,
      title: 'Chapter 3: The Celebration',
      content: 'The celebration was wonderful! The birds sang beautiful songs, the rabbits danced, and the squirrels shared their favorite nuts. Luna felt so happy seeing everyone together, safe and happy in their new homes.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna'],
      settings: {
        location: 'Forest Clearing',
        timeOfDay: 'Evening',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch3-p3',
      pageNumber: 11,
      title: 'Chapter 3: The Celebration',
      content: 'As the sun set, Luna stood with all her forest friends. "The real magic," she said, "is not in spells or potions. The real magic is in helping others and being kind." All the animals agreed and promised to always help each other.\n\nLuna stood up and all the animals gathered around her. The forest was quiet except for the gentle rustling of leaves. "You know," Luna said softly, "I\'ve learned something important. My wand and my spells are helpful, but they\'re not what makes the real difference."\n\nShe looked around at all her friends. "The real magic," she continued, "comes from caring about each other. It comes from helping when someone needs help, and from being kind even when it\'s hard. That\'s the most powerful magic of all."\n\nThe animals nodded in agreement. They understood what Luna meant. From that day forward, they all promised to help each other, just like Luna had helped them.',
      image: undefined,
      layout: 'text-image',
      characters: ['luna'],
      settings: {
        location: 'Forest Clearing',
        timeOfDay: 'Dusk',
        weather: 'Sunny'
      }
    },
    {
      id: 'ex-ch3-p4',
      pageNumber: 12,
      title: 'Chapter 3: The Celebration',
      content: 'From that day on, Luna continued to help anyone who needed her in the forest. The animals learned that kindness and friendship are the most powerful magic of all. And they all lived happily ever after in their beautiful enchanted forest.\n\nLuna\'s cottage remained a place of hope and help for all the forest creatures. Whenever an animal was in trouble, they knew they could come to Luna, and she would always be there with a kind word and a helping hand.\n\nThe forest flourished under Luna\'s care. The trees grew tall and strong, the flowers bloomed brighter than ever, and all the animals lived in peace and harmony. They had learned that by helping each other and being kind, they could create their own magic.\n\nAnd so, Luna the kind witch and all her forest friends lived happily ever after, in a forest filled with love, kindness, and the most wonderful magic of all - the magic of friendship.',
      image: undefined,
      layout: 'image-text',
      characters: ['luna'],
      settings: {
        location: 'Enchanted Forest',
        timeOfDay: 'Night',
        weather: 'Clear'
      }
    }
  ],
  characters: [
    {
      id: 'luna',
      name: 'Luna',
      description: 'A kind and gentle witch who lives in the enchanted forest. She loves helping animals and uses her magic for good.',
      image: '',
      personality: {
        traits: ['Kind', 'Helpful', 'Wise', 'Gentle', 'Caring'],
        likes: ['Helping animals', 'Gardening', 'Magic spells'],
        dislikes: []
      },
      appearance: {
        hairColor: 'Silver',
        eyeColor: 'Purple',
        clothing: 'Purple robes with stars',
        accessories: ['Magic wand', 'Pointed hat']
      },
      role: 'protagonist',
      age: 200,
      species: 'Witch',
      powers: ['Magic', 'Healing', 'Creating paths']
    }
  ],
  settings: {
    location: 'Enchanted Forest',
    timePeriod: 'Fantasy',
    mood: 'Magical and Happy'
  },
  status: 'published',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  publishedAt: new Date('2024-01-01'),
  author: {
    id: 'example-author',
    name: 'Story Book Land'
  },
  isShared: false,
  isExample: true // Flag to mark this as an example story
};
