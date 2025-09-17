import { Component, h } from '@stencil/core';

@Component({
  tag: 'cv-display',
  styleUrl: 'cv-display.css',
  shadow: true,
})
export class CvDisplay {
  render() {
    return (
      <div class="cv-container">
        <div class="cv-sidebar">
          <slot name="sidebar"></slot>
        </div>
        <div class="cv-main">
          <slot name="main"></slot>
        </div>
      </div>
    );
  }
}
