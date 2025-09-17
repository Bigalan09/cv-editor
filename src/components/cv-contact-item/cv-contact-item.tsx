import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-contact-item',
  styleUrl: 'cv-contact-item.css',
  shadow: true,
})
export class CvContactItem {
  @Prop() icon: string;

  render() {
    return (
      <Host>
        <div class="contact-item">
          {this.icon && (
            <span class="contact-icon">{this.icon}</span>
          )}
          <span class="contact-content">
            <slot></slot>
          </span>
        </div>
      </Host>
    );
  }
}
