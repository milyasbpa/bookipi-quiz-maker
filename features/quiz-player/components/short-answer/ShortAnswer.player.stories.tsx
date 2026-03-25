import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { ShortAnswer } from './ShortAnswer.player';

const meta = {
  title: 'Features/Quiz Player/Components/ShortAnswer',
  component: ShortAnswer,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-150">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    onChange: () => {},
  },
} satisfies Meta<typeof ShortAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'Enter your answer here...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    placeholder: 'Type your detailed answer here. You have unlimited space.',
  },
};

export const WithText: Story = {
  args: {
    value: 'This is a sample answer that the user has typed in.',
    placeholder: 'Enter your answer...',
  },
};

export const LongText: Story = {
  args: {
    value: `This is a much longer answer that spans multiple lines. It demonstrates how the textarea handles larger amounts of text.

The answer can include multiple paragraphs and still be fully visible to the user.

This makes it suitable for essay-style questions or detailed explanations.`,
    placeholder: 'Enter your answer...',
  },
};

export const Disabled: Story = {
  args: {
    value: 'This answer is disabled and cannot be edited',
    placeholder: 'Enter your answer...',
    disabled: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <ShortAnswer {...args} value={value} onChange={setValue} />;
  },
  args: {
    value: '',
    placeholder: 'Start typing your answer... (interactive)',
  },
};
