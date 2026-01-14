// Simple spelling and grammar checker using browser's built-in spellcheck
// For more advanced checking, we can integrate with an API later

export interface SpellCheckResult {
  word: string;
  suggestions: string[];
  isMisspelled: boolean;
}

// Common misspellings dictionary for kids
const commonMisspellings: Record<string, string> = {
  'teh': 'the',
  'adn': 'and',
  'taht': 'that',
  'hte': 'the',
  'nad': 'and',
  'wihch': 'which',
  'woudl': 'would',
  'coudl': 'could',
  'shoudl': 'should',
  'becuase': 'because',
  'becasue': 'because',
  'recieve': 'receive',
  'seperate': 'separate',
  'occured': 'occurred',
  'begining': 'beginning',
  'enviroment': 'environment',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'embarass': 'embarrass',
  'existance': 'existence',
  'occassion': 'occasion',
  'seige': 'siege',
  'thier': 'their',
  'there': 'their', // Context-dependent, but common mistake
  'theyre': 'they\'re',
  'your': 'you\'re', // Context-dependent
  'its': 'it\'s', // Context-dependent
  'dont': 'don\'t',
  'wont': 'won\'t',
  'cant': 'can\'t',
  'isnt': 'isn\'t',
  'wasnt': 'wasn\'t',
  'didnt': 'didn\'t',
  'doesnt': 'doesn\'t',
  'havent': 'haven\'t',
  'hasnt': 'hasn\'t',
  'hadnt': 'hadn\'t',
  'wouldnt': 'wouldn\'t',
  'couldnt': 'couldn\'t',
  'shouldnt': 'shouldn\'t',
};

// Simple grammar rules for common mistakes
export function checkGrammar(text: string): { issues: string[]; suggestions: string[] } {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check for double spaces
  if (text.includes('  ')) {
    issues.push('Double spaces found');
    suggestions.push('Remove extra spaces');
  }
  
  // Check for missing spaces after punctuation
  const missingSpacePattern = /[.!?][A-Za-z]/g;
  if (missingSpacePattern.test(text)) {
    issues.push('Missing space after punctuation');
    suggestions.push('Add a space after periods, exclamation marks, and question marks');
  }
  
  // Check for capitalization after sentence endings
  const sentences = text.split(/[.!?]\s+/);
  sentences.forEach((sentence, index) => {
    if (index > 0 && sentence.length > 0 && sentence[0] === sentence[0].toLowerCase()) {
      issues.push('Sentence should start with a capital letter');
      suggestions.push('Capitalize the first letter of each sentence');
    }
  });
  
  // Check for common word mistakes
  Object.keys(commonMisspellings).forEach(misspelling => {
    const regex = new RegExp(`\\b${misspelling}\\b`, 'gi');
    if (regex.test(text)) {
      issues.push(`Possible misspelling: "${misspelling}"`);
      suggestions.push(`Did you mean "${commonMisspellings[misspelling]}"?`);
    }
  });
  
  return { issues, suggestions };
}

// Check spelling for a word
export function checkSpelling(word: string): SpellCheckResult {
  const lowerWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
  
  if (commonMisspellings[lowerWord]) {
    return {
      word,
      suggestions: [commonMisspellings[lowerWord]],
      isMisspelled: true,
    };
  }
  
  return {
    word,
    suggestions: [],
    isMisspelled: false,
  };
}

// Get writing tips
export function getWritingTips(): string[] {
  return [
    'Start each sentence with a capital letter',
    'End sentences with punctuation (. ! ?)',
    'Use descriptive words to make your story interesting',
    'Show, don\'t tell - describe what characters see, hear, and feel',
    'Use dialogue to make characters come alive',
    'Create a beginning, middle, and end to your story',
    'Add details about the setting (where and when)',
    'Describe your characters\' feelings and actions',
    'Use transition words like "then", "next", "finally"',
    'Read your story out loud to check if it sounds good',
  ];
}
