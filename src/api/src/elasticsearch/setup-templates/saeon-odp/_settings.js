export default {
  index: {
    analysis: {
      normalizer: {
        keyword_trimmed_lower: {
          type: 'custom',
          char_filter: [],
          filter: ['lowercase', 'asciifolding', 'trim'],
        },
      },
      filter: {
        vocabulary_mapping: {
          type: 'synonym',
          synonyms: ['bryan, rainfall', 'zach, rainfall'],
        },
      },
      analyzer: {
        saeon_text_fields: {
          filter: ['vocabulary_mapping'],
          tokenizer: 'lowercase',
        },
      },
    },
  },
}
