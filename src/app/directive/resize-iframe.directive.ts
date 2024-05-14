import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appResizeIframe]'
})
export class ResizeIframeDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    
    this.setIframeDimensions();
  }

  private setIframeDimensions() {
    const windowWidth = window.innerWidth;
    const iframeWidth = windowWidth >= 900 ? windowWidth : 900;
    const iframeHeight = Math.floor(iframeWidth * (500 / 900)); // Maintain aspect ratio

    this.renderer.setStyle(this.el.nativeElement, 'width', `${iframeWidth}px`);
    this.renderer.setStyle(this.el.nativeElement, 'height', `${iframeHeight}px`);
  }
}