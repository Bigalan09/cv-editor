import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-header',
  styleUrl: 'cv-header.css',
  shadow: true,
})
export class CvHeader {
  @Prop() name: string;
  @Prop() jobRole: string;
  @Prop() color: string = '#2c5f6f';

  render() {
    return (
      <Host>
        <header>
          {this.jobRole && (
            <p class="job-role" style={{ color: this.color }}>
              {this.jobRole}
            </p>
          )}
          {this.name && (
            <h1 class="name" style={{ color: this.color }}>
              {this.name}
            </h1>
          )}
          <div class="content">
            <slot></slot>
          </div>
        </header>
      </Host>
    );
  }
}
