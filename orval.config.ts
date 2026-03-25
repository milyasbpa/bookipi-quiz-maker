import { defineConfig } from 'orval';

export default defineConfig({
  'quiz-maker': {
    input: './core/openapi/openapi.json',
    output: {
      mode: 'tags-split',
      target: './core/api/generated',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './core/api/axios.ts',
          name: 'axiosInstanceMutator',
        },
      },
    },
  },
});
