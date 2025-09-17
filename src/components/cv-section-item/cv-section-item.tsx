import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-section-item',
  styleUrl: 'cv-section-item.css',
  shadow: true,
})
export class CvSectionItem {
  @Prop() heading: string;
  @Prop() subheading: string;
  @Prop() period: string;
  @Prop() headingColor: string = '#2c5f6f';

  render() {
    return (
      <Host style={{
        '--heading-color': this.headingColor
      }}>
        <article class="section-item">
          {this.heading && (
            <h3 class="section-item-heading">{this.heading}</h3>
          )}
          {this.subheading && (
            <div class="section-item-subheading">{this.subheading}</div>
          )}
          {this.period && (
            <div class="section-item-period">{this.period}</div>
          )}
          <div class="section-item-content">
            <slot></slot>
          </div>
        </article>
      </Host>
    );
  }
}
