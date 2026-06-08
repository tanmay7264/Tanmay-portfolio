/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = 'Tanmay-portfolio'

const nextConfig = {
  reactStrictMode: true,
  ...(isGithubActions ? { output: 'export' } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repoName}` : '',
  },
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repoName}` : '',
  assetPrefix: isGithubActions ? `/${repoName}/` : '',
  async rewrites() {
    if (isGithubActions) {
      return []
    }

    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: 'roadmap.tanmayportfolio.me' }],
          destination: '/roadmap.html',
        },
        {
          source: '/index',
          has: [{ type: 'host', value: 'roadmap.tanmayportfolio.me' }],
          destination: '/roadmap.html',
        },
        {
          source: '/index.html',
          has: [{ type: 'host', value: 'roadmap.tanmayportfolio.me' }],
          destination: '/roadmap.html',
        },
      ],
    }
  },
}

module.exports = nextConfig
