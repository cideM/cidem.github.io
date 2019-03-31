import React from 'react'
import Link from './Link'
import Anchor from './Anchor.js'
import styled, { ThemeProvider } from 'styled-components'
import Bio from './Bio.js'
import { rhythm, scale } from '../utils/typography'

const theme = {
  colors: {
    brand: '#e53985',
    text: {
      dimmed: '#888888',
    },
  },
}

const RootHeader = styled.h1`
  margin-top: 0;
`

const PostHeader = styled.h3`
  margin-top: 0;
`

const RootLink = ({ children }) => (
  <Link
    style={{
      boxShadow: `none`,
      textDecoration: `none`,
      color: `inherit`,
    }}
    to={`/`}
  >
    {children}
  </Link>
)

const Header = ({ isRootPath, children }) =>
  isRootPath ? (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: space-between;
      `}
    >
      <RootHeader>
        <RootLink>{children}</RootLink>
      </RootHeader>
      <Bio />
    </div>
  ) : (
    <PostHeader>
      <RootLink>{children}</RootLink>
    </PostHeader>
  )

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`

    return (
      <ThemeProvider theme={theme}>
        <div
          css={`
            margin-left: auto;
            margin-right: auto;
            max-width: ${rhythm(24)};
            padding: ${rhythm(1.5)} ${rhythm(3 / 4)};
          `}
        >
          <Header isRootPath={location.pathname === rootPath}>{title}</Header>
          {children}
          <footer>
            © 2018, Built with <Anchor href="https://www.gatsbyjs.org">Gatsby</Anchor>
          </footer>
        </div>
      </ThemeProvider>
    )
  }
}

export default Layout