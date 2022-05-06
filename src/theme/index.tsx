import { transparentize } from 'polished'
import React, { useMemo } from 'react'
import styled, {
  ThemeProvider as StyledComponentsThemeProvider,
  createGlobalStyle,
  css,
  DefaultTheme
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 600,
  upToMedium: 900,
  upToLarge: 1200
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: '#252525',
    text2: '#25252580',
    text3: '#25252550',
    text4: '#303030',
    text5: '#A1A1A1',

    // backgrounds / greys
    bg1: '#FFFFFF',
    bg2: '#F2F5FA',
    bg3: '#999999',
    bg4: '#727272',
    bg5: '#333333',
    //specialty colors
    mainBG: '#F2F5FA',
    modalBG: 'rgba(0,0,0,.7)',
    advancedBG: 'rgba(0,0,0,0.1)',

    //primary colors
    primary1: '#31B047',
    primary2: '#129026',
    primary3: '#ADDFB5',
    primary4: '#739A3B',
    primary5: '#2B3A14',

    // color text
    primaryText1: '#B2F355',

    // secondary colors
    secondary1: '#739A3B',
    secondary2: '#191919',
    secondary3: '#252525',

    // other
    red1: '#FF0000',
    red2: '#FF2828',
    red3: '#FF4B4B',
    green1: '#24FF00',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    translucent: 'rgba(255, 255, 255, 0.08)',
    gradient1: '#ffffff',
    gradient2: '#ffffff'
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },

    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    //rwd
    mobile: css`
      display: none;
      ${mediaWidthTemplates.upToSmall`display:inherit;`}
    `,
    desktop: css`
      ${mediaWidthTemplates.upToSmall`display:none;`}
    `,
    mobileHeaderHeight: '51px',
    headerHeight: '80px',

    maxContentWidth: '1200px',
    minContentWidth: '300px',

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={22} {...props} />
  },
  smallHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={16} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={12} {...props} />
  },
  smallGray(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={12} color={'text3'} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={400} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'SF Pro', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'SF Pro', sans-serif;
  }
}
html,
body {
  margin: 0;
  padding: 0;
}
 a {
   color: ${colors(false).blue1};
 }
* {
  box-sizing: border-box;
}
button {
  user-select: none;
}
html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
}
`

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}
body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1
    )} 100%)`};
}
`
