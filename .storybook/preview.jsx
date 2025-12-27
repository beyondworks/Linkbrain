import '../src/index.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Overview',
          'Style', ['Overview', 'Colors', 'Typography', 'Spacing', 'Icons', 'Shadows'],
          'Custom Component',
          'Template',
          'Section',
          'Page',
        ],
        method: 'alphabetical',
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0A0A0B' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals?.backgrounds?.value === '#0A0A0B';
      return (
        <div
          className={isDark ? 'dark' : ''}
          style={{
            fontFamily: '"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            padding: '40px',
            minHeight: '100vh',
            backgroundColor: isDark ? '#0A0A0B' : '#ffffff',
            color: isDark ? '#FAFAFA' : '#0F172A',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
