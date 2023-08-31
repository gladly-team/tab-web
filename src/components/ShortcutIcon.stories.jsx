/* eslint-disable no-console */
import React from 'react'
import ShortcutIcon from './ShortcutIcon'

export default {
  title: 'Components/ShortcutIcon',
  component: ShortcutIcon,
  parameters: {
    backgrounds: {
      default: 'grey',
      values: [
        { name: 'grey', value: '#F2F2F2' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
}

const Template = (args) => <ShortcutIcon {...args} />

export const basic = Template.bind({})
basic.args = {
  id: 'abcd',
  text: 'Google Googledy',
  url: 'https://www.google.com',
  onEdit: () => console.log('onEdit'),
  onDelete: () => console.log('onDelete'),
}
