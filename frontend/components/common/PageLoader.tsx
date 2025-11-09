'use client';

type PageLoaderProps = {
  message?: string;
};

const PageLoader = ({ message = 'Just a moment while we load things up…' }: PageLoaderProps) => (
  <div className="page-loader">
    <div className="page-loader__spinner" />
    <div className="text-sm leading-5">{message}</div>
  </div>
);

export default PageLoader;

