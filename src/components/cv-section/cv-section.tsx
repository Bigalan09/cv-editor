import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "cv-section",
  styleUrl: "cv-section.css",
  shadow: true,
})
export class CvSection {
  @Prop() sectionTitle: string;
  @Prop() color: string = "#2c5f6f";

  render() {
    return (
      <Host>
        <section class="section">
          {this.sectionTitle && (
            <h2 class="section-title" style={{ color: this.color }}>
              {this.sectionTitle}
            </h2>
          )}
          <div class="section-content">
            <slot></slot>
          </div>
        </section>
      </Host>
    );
  }
}
