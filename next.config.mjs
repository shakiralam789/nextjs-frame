import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/login',
            permanent: true,
          },
        ];
      },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
