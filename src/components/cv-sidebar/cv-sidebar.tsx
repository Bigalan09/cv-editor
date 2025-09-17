import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-sidebar',
  styleUrl: 'cv-sidebar.css',
  shadow: true,
})
export class CvSidebar {
  @Prop() backgroundColor: string = 'rgb(218, 228, 235)';

  render() {
    return (
      <Host style={{ backgroundColor: this.backgroundColor }}>
        <div class="sidebar-header">
          <slot name="header"></slot>
        </div>
        <div class="sidebar-content">
          <slot name="content"></slot>
        </div>
      </Host>
    );
  }
}
