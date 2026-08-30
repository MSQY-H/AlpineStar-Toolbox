/**
 * plugins/vuetify.ts
 *
 * Vuetify 4 配置：MD3 蓝图 + 蓝色主题 + 边框风格
 */

import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  blueprint: md3,
  theme: {
    defaultTheme: 'system',
    utilities: true,
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          'on-primary': '#FFFFFF',
          'primary-container': '#d1e7ff',
          'on-primary-container': '#001f33',
          'primary-darken-1': '#1F5592',
          secondary: '#48A9A6',
          'on-secondary': '#FFFFFF',
          'secondary-container': '#d6e7f7',
          'on-secondary-container': '#0f1f2a',
          'secondary-darken-1': '#018786',
          tertiary: '#6b5b95',
          'on-tertiary': '#FFFFFF',
          'tertiary-container': '#e9ddff',
          'on-tertiary-container': '#251431',
          error: '#B00020',
          'on-error': '#FFFFFF',
          'error-container': '#ffdad6',
          'on-error-container': '#410002',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FFFFFF',
          'on-background': '#191c1e',
          surface: '#FFFFFF',
          'on-surface': '#191c1e',
          'surface-bright': '#FFFFFF',
          'surface-light': '#EEEEEE',
          'surface-variant': '#424242',
          'on-surface-variant': '#EEEEEE',
          outline: '#71787e',
          'outline-variant': '#cac4d0',
          shadow: '#000000',
          scrim: '#000000',
          'inverse-surface': '#2e3133',
          'inverse-on-surface': '#eff1f4',
          'inverse-primary': '#9dcaff',
        },
      },
      dark: {
        colors: {
          primary: '#8fc5ff',
          'on-primary': '#003258',
          'primary-container': '#00497d',
          'on-primary-container': '#d1e7ff',
          'primary-darken-1': '#6ba8dc',
          secondary: '#80d4d1',
          'on-secondary': '#003a38',
          'secondary-container': '#018786',
          'on-secondary-container': '#d6e7f7',
          'secondary-darken-1': '#00695c',
          tertiary: '#c9b8e8',
          'on-tertiary': '#3b2948',
          'tertiary-container': '#523f5f',
          'on-tertiary-container': '#e9ddff',
          error: '#ffb4ab',
          'on-error': '#690005',
          'error-container': '#93000a',
          'on-error-container': '#ffdad6',
          info: '#90caf9',
          success: '#81c784',
          warning: '#ffb74d',
          background: '#191c1e',
          'on-background': '#e2e2e6',
          surface: '#191c1e',
          'on-surface': '#e2e2e6',
          'surface-bright': '#3b3e41',
          'surface-light': '#2e3133',
          'surface-variant': '#42474e',
          'on-surface-variant': '#c3c7cf',
          outline: '#8d9199',
          'outline-variant': '#42474e',
          shadow: '#000000',
          scrim: '#000000',
          'inverse-surface': '#e2e2e6',
          'inverse-on-surface': '#2e3133',
          'inverse-primary': '#1867C0',
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      border: true,
      rounded: 'lg',
    },
    VAppBar: {
      elevation: 0,
      rounded: '0',
    },
    VNavigationDrawer: {
      border: 'e',
      rounded: '0',
    },
    VBtn: {
      variant: 'flat',
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
    },
    VChip: {
      rounded: 'lg',
    },
    VAlert: {
      rounded: 'lg',
    },
    VListItem: {
      rounded: 'lg',
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})
