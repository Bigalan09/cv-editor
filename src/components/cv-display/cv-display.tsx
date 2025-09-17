import { Component, h } from "@stencil/core";

@Component({
  tag: "cv-display",
  styleUrl: "cv-display.css",
  shadow: true,
})
export class CvDisplay {
  render() {
    return (
      <div class="cv-container">
        <div class="sidebar-header">
          <slot name="sidebar-header"></slot>
        </div>
        <div class="main-header">
          <slot name="main-header"></slot>
        </div>
        <div class="sidebar-content">
          <slot name="sidebar-content"></slot>
        </div>
        <div class="main-content">
          <slot name="main-content"></slot>
        </div>
      </div>
    );
  }
}
