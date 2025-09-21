/**
 * TypeScript Type Definitions
 * 
 * This file serves as the main entry point for all type definitions in the application.
 * It re-exports all type declarations and provides global type augmentations.
 * 
 * Import this file at the top of your entry point (e.g., _app.tsx or _app.js)
 * to ensure type definitions are available throughout your application.
 */

// Core TypeScript and React types
import 'react';
import 'next';

// Re-export all type declarations
export * from './global';
export * from './next';
export * from './react';
export * from './components';
export * from './modules';

// Application-specific types
// Add any app-specific type declarations here

declare global {
  /**
   * Global window object extensions
   */
  interface Window {
    // Next.js data hydration
    __NEXT_DATA__?: {
      props: Record<string, any>;
      page: string;
      query: Record<string, string>;
      buildId: string;
      isFallback?: boolean;
      dynamicIds?: string[];
      env?: Record<string, string>;
    };
    
    // Redux DevTools extension
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    
    // Google Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // Development tools
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
    
    // Environment variables
    ENV?: Record<string, string>;
    
    // Add other window globals as needed
  }
  
  /**
   * Global Node.js process.env extensions
   */
  namespace NodeJS {
    interface ProcessEnv {
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
  
  /**
   * Global type declarations
   */
  
  // Add any other global type declarations here
}

// This export is needed to make this file a module
export {};
