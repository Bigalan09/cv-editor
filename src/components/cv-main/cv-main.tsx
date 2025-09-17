import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'cv-main',
  styleUrl: 'cv-main.css',
  shadow: true,
})
export class CvMain {
  render() {
    return (
      <Host>
        <div class="main-header">
          <slot name="header"></slot>
        </div>
        <div class="main-content">
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
