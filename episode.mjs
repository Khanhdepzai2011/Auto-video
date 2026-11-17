export function validateEpisode(episode) {
  if (!Array.isArray(episode?.scenes) || episode.scenes.length !== 7) {
    throw new Error('Provide exactly 7 scenes: opening, five examples, closing.');
  }
  for (const [index, scene] of episode.scenes.entries()) {
    const fields = index === 0 || index === 6
      ? ['headline', 'subtitle', 'narration']
      : ['title', 'headline', 'input', 'output', 'narration'];
    for (const field of fields) {
      if (typeof scene?.[field] !== 'string' || !scene[field].trim()) {
        throw new Error('Scene ' + (index + 1) + ' requires ' + field);
      }
    }
  }
}

