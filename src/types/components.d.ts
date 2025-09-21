import { HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

// Common types
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | 'outline' | 'ghost' | 'destructive';
type Position = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Base Props
export interface BaseProps {
  /** Additional class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Test ID for testing */
  testId?: string;
}

// Button component
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, BaseProps {
  /** Button variant */
  variant?: Variant;
  /** Button size */
  size?: Size;
  /** Show loading state */
  isLoading?: boolean;
  /** Loading text (shows if isLoading is true) */
  loadingText?: string;
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Make button full width */
  isFullWidth?: boolean;
  /** Button is disabled */
  isDisabled?: boolean;
  /** Button is active */
  isActive?: boolean;
  /** Render as a different element */
  as?: React.ElementType;
}

// Input component
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseProps {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string | boolean;
  /** Helper text */
  helperText?: string;
  /** Left element (icon, etc.) */
  leftElement?: React.ReactNode;
  /** Right element (icon, etc.) */
  rightElement?: React.ReactNode;
  /** Input size */
  size?: Size;
  /** Input is invalid */
  isInvalid?: boolean;
  /** Input is required */
  isRequired?: boolean;
  /** Input is read-only */
  isReadOnly?: boolean;
  /** Input is disabled */
  isDisabled?: boolean;
}

// Textarea component
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseProps {
  /** Textarea label */
  label?: string;
  /** Error message */
  error?: string | boolean;
  /** Helper text */
  helperText?: string;
  /** Textarea size */
  size?: Size;
  /** Number of rows */
  rows?: number;
  /** Number of columns */
  cols?: number;
  /** Textarea is invalid */
  isInvalid?: boolean;
  /** Textarea is required */
  isRequired?: boolean;
  /** Textarea is read-only */
  isReadOnly?: boolean;
  /** Textarea is disabled */
  isDisabled?: boolean;
}

// Select component
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseProps {
  /** Select label */
  label?: string;
  /** Error message */
  error?: string | boolean;
  /** Helper text */
  helperText?: string;
  /** Options */
  options: Array<{ value: string | number; label: string; disabled?: boolean }>;
  /** Select size */
  size?: Size;
  /** Select is invalid */
  isInvalid?: boolean;
  /** Select is required */
  isRequired?: boolean;
  /** Select is disabled */
  isDisabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

// Card component
export interface CardProps extends HTMLAttributes<HTMLDivElement>, BaseProps {
  /** Card variant */
  variant?: 'default' | 'outline' | 'elevated' | 'filled' | 'unstyled';
  /** Card size */
  size?: Size;
  /** Card is hoverable */
  isHoverable?: boolean;
  /** Card is clickable */
  isClickable?: boolean;
  /** Card is disabled */
  isDisabled?: boolean;
  /** Card is loading */
  isLoading?: boolean;
  /** Card header */
  header?: React.ReactNode;
  /** Card footer */
  footer?: React.ReactNode;
  /** Card image */
  image?: string;
  /** Card image alt text */
  imageAlt?: string;
  /** Card image position */
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
}

// Toast component
export interface ToastProps extends BaseProps {
  /** Toast title */
  title: string;
  /** Toast description */
  description?: string;
  /** Toast variant */
  variant?: Variant;
  /** Toast duration in milliseconds */
  duration?: number;
  /** Show close button */
  isClosable?: boolean;
  /** Toast position */
  position?: Position;
  /** Callback when toast is closed */
  onClose?: () => void;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom action */
  action?: React.ReactNode;
}

// Modal component
export interface ModalProps extends BaseProps {
  /** Modal is open */
  isOpen: boolean;
  /** Modal title */
  title?: string;
  /** Modal description */
  description?: string;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Modal size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Modal is centered */
  isCentered?: boolean;
  /** Modal scroll behavior */
  scrollBehavior?: 'inside' | 'outside';
  /** Modal footer */
  footer?: React.ReactNode;
  /** Modal header */
  header?: React.ReactNode;
  /** Modal body */
  children: React.ReactNode;
}

// Export all types
export * from './react';
export * from './next';

// Global type extensions
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Custom elements go here
      'custom-button': ButtonProps;
      'custom-card': CardProps;
      'custom-input': InputProps;
    }
  }
}
