// Global CSS Modules Type Declarations
// This file handles all CSS module imports in the project

declare module "*.css" {
  const content: { readonly [className: string]: string };
  export default content;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Specific module declarations for better type safety
declare module "@/styles/*.css" {
  const styles: { readonly [className: string]: string };
  export default styles;
}

declare module "@styles/*.css" {
  const styles: { readonly [className: string]: string };
  export default styles;
}

// Global CSS imports (non-module CSS files)
declare module "@/styles/globals.css";
