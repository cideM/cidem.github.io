import React from 'react'
import { graphql } from 'gatsby'
import Link from '../components/Link'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import styled from 'styled-components'
import { rhythm, scale } from '../utils/typography'

const Post = styled.div`
  & code {
    font-family: Roboto Mono, monospace;
  }

  & pre {
    min-width: 100%;
    float: left;
    margin-bottom: ${rhythm(1)};
    padding-top: ${rhythm(0.5)};
    padding-bottom: ${rhythm(0.5)};
  }

  & .gatsby-highlight {
    overflow: auto;
  }

  a {
    color: ${props => props.theme.colors.brand};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        <p
          style={{
            ...scale(-1 / 5),
            display: `block`,
            marginBottom: rhythm(1),
            marginTop: rhythm(-1),
          }}
        >
          {post.frontmatter.date}
        </p>
        <Post dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <div
          css={`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Bio />
        </div>

        <ul
          css={`
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0;
            list-style: none;
          `}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`