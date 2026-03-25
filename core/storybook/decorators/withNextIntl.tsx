import type { Decorator } from '@storybook/nextjs-vite';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';

// Add or remove namespace imports as new namespaces are added to core/i18n/json/.
import enQuizMaker from '../../i18n/json/en/quiz-maker.json';

const messages = {
  'quiz-maker': enQuizMaker,
};

export const withNextIntl: Decorator = (Story) => (
  <NextIntlClientProvider locale="en" messages={messages}>
    <Story />
  </NextIntlClientProvider>
);
