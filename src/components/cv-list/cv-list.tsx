import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'cv-list',
  styleUrl: 'cv-list.css',
  shadow: true,
})
export class CvList {
  render() {
    return (
      <Host>
        <ul class="list">
          <slot></slot>
        </ul>
      </Host>
    );
  }
}
