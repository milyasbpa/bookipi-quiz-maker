import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { MCQAnswer } from './MCQAnswer.player';

const meta = {
  title: 'Features/Quiz Player/Components/MCQAnswer',
  component: MCQAnswer,
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
} satisfies Meta<typeof MCQAnswer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    selectedValue: '',
  },
};

export const WithSelection: Story = {
  args: {
    options: ['JavaScript', 'Python', 'Java', 'C++'],
    selectedValue: '1',
  },
};

export const TwoOptions: Story = {
  args: {
    options: ['True', 'False'],
    selectedValue: '0',
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      'Option A - This is a really long option text that might wrap to multiple lines',
      'Option B - Another long option  with detailed explanation',
      'Option C - Short',
      'Option D - Medium length option',
      'Option E - Final option',
    ],
    selectedValue: '2',
  },
};

export const Disabled: Story = {
  args: {
    options: ['Option A', 'Option B', 'Option C'],
    selectedValue: '1',
    disabled: true,
  },
};

export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <MCQAnswer {...args} selectedValue={value} onChange={setValue} />;
  },
  args: {
    options: ['React', 'Vue', 'Angular', 'Svelte'],
    selectedValue: '',
  },
};
