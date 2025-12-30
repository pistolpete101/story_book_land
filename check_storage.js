// Quick script to check localStorage
if (typeof window !== 'undefined') {
  const keys = Object.keys(localStorage);
  console.log('All localStorage keys:', keys);
  const storyKeys = keys.filter(k => k.startsWith('stories_'));
  console.log('Story keys:', storyKeys);
  storyKeys.forEach(key => {
    const data = localStorage.getItem(key);
    console.log(`\n${key}:`, data ? JSON.parse(data).length + ' stories' : 'empty');
  });
}
