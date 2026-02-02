import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Selena AI SDK',
  description: 'SDK JavaScript moderno para integração com Selena AI',
  lang: 'pt-BR',
  base: '/selena-ai-sdk/',
  
  themeConfig: {
    nav: [
      { text: 'Início', link: '/' },
      { text: 'Guia', link: '/guide/installation' },
      { text: 'API', link: '/api/client' },
      { text: 'Exemplos', link: '/examples/usage' }
    ],

    sidebar: [
      {
        text: 'Guia',
        items: [
          { text: 'Instalação', link: '/guide/installation' },
          { text: 'Começo Rápido', link: '/guide/quick-start' },
          { text: 'Configuração', link: '/guide/configuration' },
          { text: 'CLI', link: '/guide/cli' }
        ]
      },
      {
        text: 'API Reference',
        items: [
          { text: 'Client', link: '/api/client' },
          { text: 'Chat', link: '/api/chat' },
          { text: 'Erros', link: '/api/errors' }
        ]
      },
      {
        text: 'Exemplos',
        items: [
          { text: 'Uso Básico', link: '/examples/usage' },
          { text: 'Logging', link: '/examples/logging' },
          { text: 'CLI', link: '/examples/cli' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/elaxinc/selena-ai-sdk' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Feito com ❤️ pela equipe Elaxi',
      copyright: 'Copyright © 2024 Elaxi. Todos os direitos reservados.'
    }
  },

  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },

  vite: {
    plugins: []
  },
  
  ignoreDeadLinks: true
});