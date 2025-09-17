import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-list-item',
  styleUrl: 'cv-list-item.css',
  shadow: true,
})
export class CvListItem {
  @Prop() bulletColor: string = '#2c5f6f';

  render() {
    return (
      <Host style={{ '--bullet-color': this.bulletColor }}>
        <li class="list-item">
          <slot></slot>
        </li>
      </Host>
    );
  }
}
