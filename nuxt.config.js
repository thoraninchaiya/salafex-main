import colors from 'vuetify/es5/util/colors'


export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - basic_course',
    title: 'SALAFEX',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://emoji-css.afeld.me/emoji.css'},
      { rel: 'stylesheet', href: 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'},
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css'},
      { rel: 'preconnect', href: 'https://fonts.googleapis.com'},
      { rel: 'preconnect', href: 'https://fonts.gstatic.com'},
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@100&family=Kanit:wght@300&family=Prompt&display=swap'},
      // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Prompt'}
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/addon/css/reset.css',
    '@/addon/css/main.css',
    '@/addon/fontawesome-free-5.15.3-web/js/fontawesome.js',
    '@/addon/fontawesome-free-5.15.3-web/js/solid.js',
    '@/addon/fontawesome-free-5.15.3-web/js/brands.js',
    // '@/addon/fontawesome-free-5.15.3-web/js/regular.js',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/toast',
    // '@nuxtjs/universal-storage',
  ],

  toast: {
    position: 'top-right',
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        duration: 5000,
        options: {
          type: 'error'
        }
      }
    ]
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // //Universal Storage Module: [https://github.com/nuxt-community/universal-storage-module]
  // storage: {
  //   //vuex, // boolean or {namespace}
  //   localStorage: {
  //     prefix: ''
  //   }, // boolean or {prefix}
  //   cookie: {
  //     prefix: '',
  //     options: {
  //       path: '/'
  //     }
  //   }, // boolean or {prefix, options}
  //   //initialState: { testParam: false },  // Object {}
  //   ignoreException: false //
  // },
}
