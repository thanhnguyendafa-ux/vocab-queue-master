// Global type declarations

// Import React for JSX types
import * as React from 'react';

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Image and asset imports
declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.avif' {
  const src: string;
  export default src;
}

// Global type declarations
declare global {
  // Extend the Window interface
  interface Window {
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: Record<string, any>[];
    
    // Development tools
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    
    // Environment variables
    ENV?: Record<string, string>;
    
    // Add any other global window properties here
  }
  
  // Extend the NodeJS namespace for process.env
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_APP_ENV?: string;
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_GA_TRACKING_ID?: string;
      // Add other environment variables here
    }
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
