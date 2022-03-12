import { Publisher } from '@teds-tickets/common';

export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
