import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Button } from '../button';

import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Dialog Title"
          description="This is a description of what this dialog does"
        >
          <div className="space-y-4">
            <p>Dialog content goes here</p>
            <Button onClick={() => setOpen(false)} variant="primary">
              Confirm
            </Button>
          </div>
        </Dialog>
      </>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Small Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Small Dialog"
          description="This dialog uses the sm size"
          size="sm"
        >
          <p>Compact content</p>
        </Dialog>
      </>
    );
  },
};

export const LargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Large Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Large Dialog"
          description="This dialog uses the lg size (default)"
          size="lg"
        >
          <div className="space-y-4">
            <p>More spacious content area</p>
            <p>Perfect for forms and multi-step flows</p>
          </div>
        </Dialog>
      </>
    );
  },
};

export const ExtraLargeSize: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open XL Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Extra Large Dialog"
          description="This dialog uses the xl size"
          size="xl"
        >
          <div className="space-y-4">
            <p>Very spacious dialog for complex content</p>
            <p>Ideal for detailed forms or rich content</p>
          </div>
        </Dialog>
      </>
    );
  },
};

export const WithoutDescription: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Simple Dialog</Button>
        <Dialog open={open} onOpenChange={setOpen} title="Simple Dialog">
          <p>Dialog without description text</p>
        </Dialog>
      </>
    );
  },
};

export const WithForm: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Form Dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Create New Item"
          description="Fill out the form below"
        >
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                className="border-border w-full rounded-xl border bg-transparent p-3 text-sm"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="border-border w-full rounded-xl border bg-transparent p-3 text-sm"
                rows={3}
                placeholder="Enter description"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Submit
            </Button>
          </form>
        </Dialog>
      </>
    );
  },
};
