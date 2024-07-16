declare module 'react-image-lightbox' {
    import * as React from 'react';
  
    interface LightboxProps {
      mainSrc: string;
      nextSrc?: string;
      prevSrc?: string;
      onCloseRequest: () => void;
      onMovePrevRequest?: () => void;
      onMoveNextRequest?: () => void;
      imageTitle?: string;
      imageCaption?: string;
      reactModalProps?: any;
    }
  
    class Lightbox extends React.Component<LightboxProps> {}
  
    export default Lightbox;
  }
  