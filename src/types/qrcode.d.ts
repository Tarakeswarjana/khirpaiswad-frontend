declare module 'qrcode' {
  interface QRCodeToCanvasOptions {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }

  export function toCanvas(
    canvasElement: HTMLCanvasElement,
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<void>;

  export function toDataURL(
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeToCanvasOptions
  ): Promise<string>;
}
