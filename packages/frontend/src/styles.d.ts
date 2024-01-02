declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
  
  // Similarly for other assets if needed
  declare module '*.png';
  declare module '*.jpg';
  declare module '*.jpeg';
  declare module '*.svg';
  declare module '*.gif';
  