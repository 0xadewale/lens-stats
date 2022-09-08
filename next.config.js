/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.infura.io',
      'statics-polygon-lens-staging.s3.eu-west-1.amazonaws.com',
      'lens.infura-ipfs.io'
    ]
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: 'https://sitemap.lenstats.xyz/sitemap.xml'
      },
      {
        source: '/sitemaps/:match*',
        destination: 'https://sitemap.lentats.xyz/sitemaps/:match*'
      }
    ];
  },
}

module.exports = nextConfig
