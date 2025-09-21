import { NextComponentType, NextPage, NextPageContext } from 'next';
import { AppContext, AppInitialProps, AppProps } from 'next/app';
import { Router } from 'next/router';
import { ReactElement, ReactNode } from 'react';

declare module 'next' {
  export interface NextPageContext {
    // Add any custom context properties here
    req?: any;
    res?: any;
    err?: any;
    pathname: string;
    query: Record<string, string | string[]>;
    asPath?: string;
    AppTree: any;
  }

  // Extend NextPage type with additional properties
  export interface CustomPageProps {
    // Add any custom page props here
    namespacesRequired?: string[];
    statusCode?: number;
  }

  // Page with layout support
  export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
    layout?: React.ComponentType<{ children: ReactNode }>;
    auth?: boolean | ((ctx: NextPageContext) => boolean | Promise<boolean>);
    // Add any other page-level configurations
  };
}

declare module 'next/app' {
  export type AppPropsWithLayout<P = {}> = AppProps<P> & {
    Component: NextComponentType<NextPageContext, any, P> & {
      getLayout?: (page: ReactElement) => ReactNode;
      layout?: React.ComponentType<{ children: ReactNode }>;
    };
    pageProps: P;
    router: Router;
  };

  export type AppContextWithLayout = AppContext & {
    Component: NextComponentType<NextPageContext, any, any> & {
      getLayout?: (page: ReactElement) => ReactNode;
      layout?: React.ComponentType<{ children: ReactNode }>;
    };
  };

  export type AppInitialPropsWithLayout = AppInitialProps & {
    pageProps: any;
  };
}

// Extend NodeJS.Process type
declare namespace NodeJS {
  export interface ProcessEnv {
    // Environment
    NODE_ENV: 'development' | 'production' | 'test';
    
    // Public environment variables (exposed to the browser)
    NEXT_PUBLIC_APP_NAME?: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_GA_TRACKING_ID?: string;
    
    // Server-side only environment variables
    DATABASE_URL?: string;
    SECRET_KEY?: string;
    
    // Add other environment variables as needed
  }
}

// Extend global namespace
declare global {
  // Add any global type extensions here
  
  // Example: Extend the Window interface
  interface Window {
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, any>[];
    
    // Add other window globals here
  }
  
  // Extend the global JSX namespace
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom JSX elements here
      'custom-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

// This export is needed to make this file a module
export {};
