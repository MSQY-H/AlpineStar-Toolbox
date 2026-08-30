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
          primary: '#0061A4',
          'on-primary': '#FFFFFF',
          'primary-container': '#D1E4FF',
          'on-primary-container': '#001D36',
          secondary: '#535F70',
          'on-secondary': '#FFFFFF',
          'secondary-container': '#D7E3F7',
          'on-secondary-container': '#101C2B',
          tertiary: '#6B5778',
          'on-tertiary': '#FFFFFF',
          'tertiary-container': '#F3DAFF',
          'on-tertiary-container': '#251431',
          error: '#BA1A1A',
          'on-error': '#FFFFFF',
          'error-container': '#FFDAD6',
          'on-error-container': '#410002',
          background: '#FDFCFF',
          'on-background': '#1A1C1E',
          surface: '#FDFCFF',
          'on-surface': '#1A1C1E',
          'surface-variant': '#DFE2EB',
          'on-surface-variant': '#43474E',
          outline: '#73777F',
          'outline-variant': '#C3C7CF',
          shadow: '#000000',
          scrim: '#000000',
          'inverse-surface': '#2F3033',
          'inverse-on-surface': '#F0F0F4',
          'inverse-primary': '#9DCAFF',
        },
      },
      dark: {
        colors: {
          primary: '#9DCAFF',
          'on-primary': '#003258',
          'primary-container': '#00497D',
          'on-primary-container': '#D1E4FF',
          secondary: '#BBC7DB',
          'on-secondary': '#253140',
          'secondary-container': '#3B4858',
          'on-secondary-container': '#D7E3F7',
          tertiary: '#D7BDE4',
          'on-tertiary': '#3B2948',
          'tertiary-container': '#523F5F',
          'on-tertiary-container': '#F3DAFF',
          error: '#FFB4AB',
          'on-error': '#690005',
          'error-container': '#93000A',
          'on-error-container': '#FFDAD6',
          background: '#1A1C1E',
          'on-background': '#E2E2E6',
          surface: '#1A1C1E',
          'on-surface': '#E2E2E6',
          'surface-variant': '#43474E',
          'on-surface-variant': '#C3C7CF',
          outline: '#8D9199',
          'outline-variant': '#43474E',
          shadow: '#000000',
          scrim: '#000000',
          'inverse-surface': '#E2E2E6',
          'inverse-on-surface': '#2F3033',
          'inverse-primary': '#0061A4',
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
    }
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
