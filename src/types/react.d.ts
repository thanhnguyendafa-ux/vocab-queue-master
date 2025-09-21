import 'react';

declare module 'react' {
  // Extend CSSProperties to include CSS variables and custom properties
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
    // Add any other CSS property extensions here
    WebkitAppRegion?: 'drag' | 'no-drag';
  }

  // Extend HTMLAttributes to include custom HTML attributes
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Add any custom HTML attributes here
    class?: string;
    style?: CSSProperties;
    
    // Common attributes
    inert?: '' | 'inert' | boolean;
    
    // Data attributes
    [dataAttribute: `data-${string}`]: any;
  }

  // Button element extensions
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline' | 'ghost' | 'destructive';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    isFullWidth?: boolean;
    isDisabled?: boolean;
  }

  // Input element extensions
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    // Standard HTML input attributes
    'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
    
    // Custom attributes
    isInvalid?: boolean;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isDisabled?: boolean;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    inputSize?: 'xs' | 'sm' | 'md' | 'lg';
  }

  // Form element extensions
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    noValidate?: boolean;
  }

  // Image element extensions
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fallbackSrc?: string;
    fallback?: React.ReactElement;
  }

  // Add type safety for refs
  interface RefAttributes<T> extends Attributes {
    ref?: Ref<T> | undefined;
  }

  // Extend React.FC to include displayName and other static properties
  interface FunctionComponent<P = {}> {
    displayName?: string;
    defaultProps?: Partial<P>;
    propTypes?: WeakValidationMap<P>;
  }

  // Extend React.MemoExoticComponent
  interface MemoExoticComponent<T extends ComponentType<any>>
    extends NamedExoticComponent<ComponentPropsWithRef<T>> {
    displayName?: string;
  }
}

// Extend global JSX namespace
declare global {
  namespace JSX {
    // This extends the IntrinsicElements interface with our custom elements
    interface IntrinsicElements {
      // Add any custom JSX elements here
      'custom-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      
      // Example of a custom element with specific props
      'my-component': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'custom-prop'?: string;
          'theme'?: 'light' | 'dark';
        },
        HTMLElement
      >;
    }

    // Extend Element to include custom attributes
    interface Element extends React.ReactElement<any, any> {}

    // Extend ElementClass to include custom component instance methods
    interface ElementClass {
      // Add any custom instance methods here
      focus?: () => void;
      blur?: () => void;
    }
  }
}

// This export is needed to make this file a module
export {};
