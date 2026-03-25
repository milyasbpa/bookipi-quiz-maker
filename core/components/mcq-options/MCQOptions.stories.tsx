import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { MCQOptions } from './MCQOptions';

const meta: Meta<typeof MCQOptions> = {
  title: 'Components/MCQOptions',
  component: MCQOptions,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MCQOptions>;

export const Default: Story = {
  render: () => {
    const [options, setOptions] = useState(['Option A', 'Option B', 'Option C']);
    const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(0);

    return (
      <MCQOptions
        options={options}
        onChange={setOptions}
        selectedCorrectIndex={selectedCorrectIndex}
        onSelectCorrect={setSelectedCorrectIndex}
        addOptionButtonLabel="Add Option"
        optionPlaceholder="Enter option text"
        selectCorrectHint="Select the correct answer by clicking the radio button"
      />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [options, setOptions] = useState(['', '']);
    const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(0);

    return (
      <MCQOptions
        options={options}
        onChange={setOptions}
        selectedCorrectIndex={selectedCorrectIndex}
        onSelectCorrect={setSelectedCorrectIndex}
        addOptionButtonLabel="Add Option"
        optionPlaceholder="Enter option text"
        selectCorrectHint="Select the correct answer"
      />
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [options, setOptions] = useState([
      'First option',
      'Second option',
      'Third option',
      'Fourth option',
      'Fifth option',
    ]);
    const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(2);

    return (
      <MCQOptions
        options={options}
        onChange={setOptions}
        selectedCorrectIndex={selectedCorrectIndex}
        onSelectCorrect={setSelectedCorrectIndex}
        addOptionButtonLabel="Add Option"
        optionPlaceholder="Enter option text"
        selectCorrectHint="Select the correct answer"
      />
    );
  },
};

export const MaximumOptions: Story = {
  render: () => {
    const [options, setOptions] = useState(['A', 'B', 'C', 'D', 'E', 'F']);
    const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(0);

    return (
      <MCQOptions
        options={options}
        onChange={setOptions}
        selectedCorrectIndex={selectedCorrectIndex}
        onSelectCorrect={setSelectedCorrectIndex}
        addOptionButtonLabel="Add Option"
        optionPlaceholder="Enter option text"
        selectCorrectHint="Maximum 6 options (add button disabled)"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [options, setOptions] = useState(['Option A', 'Option B']);
    const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(0);

    return (
      <MCQOptions
        options={options}
        onChange={setOptions}
        selectedCorrectIndex={selectedCorrectIndex}
        onSelectCorrect={setSelectedCorrectIndex}
        disabled={true}
        addOptionButtonLabel="Add Option"
        optionPlaceholder="Enter option text"
        selectCorrectHint="All controls are disabled"
      />
    );
  },
};
