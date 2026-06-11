export type EngagementTopic = {
  id: string;
  contentType: string;
  prompt: string;
  verseReference?: string | null;
  verseText?: string | null;
  triviaAnswer?: string | null;
};

export type GeneratedEngagementPost = {
  content: string;
  firstComment?: string;
};

/**
 * Generate Facebook engagement post from a topic.
 * Unlike the 7am "Daily Prayer" post, these are template-based (no OpenAI calls)
 * and designed to maximize comments, reactions, and shares.
 */
export function generateEngagementPost(
  topic: EngagementTopic,
): GeneratedEngagementPost {
  switch (topic.contentType) {
    case 'one_word_prayer':
      // Simple question prompting one-word responses
      return { content: topic.prompt };

    case 'scripture_reflection':
      // Verse + question format
      if (!topic.verseText || !topic.verseReference) {
        throw new Error(
          'scripture_reflection requires verseText and verseReference',
        );
      }
      return {
        content: [
          `"${topic.verseText}" — ${topic.verseReference} (ASV)`,
          '',
          topic.prompt,
        ].join('\n'),
      };

    case 'trivia':
      // Multiple choice question with answer in first comment
      return {
        content: topic.prompt,
        firstComment: topic.triviaAnswer ?? undefined,
      };

    case 'finish_verse':
      // Fill-in-the-blank verse completion
      return {
        content: topic.prompt,
        firstComment: topic.triviaAnswer ?? undefined,
      };

    case 'gratitude':
      // Gratitude fill-in-the-blank
      return { content: topic.prompt };

    case 'this_or_that':
      // React with emoji poll
      return { content: topic.prompt };

    case 'testimony':
      // Personal story prompt
      return { content: topic.prompt };

    default:
      throw new Error(`Unknown engagement type: ${topic.contentType}`);
  }
}
