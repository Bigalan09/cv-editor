import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "cv-contact-item",
  styleUrl: "cv-contact-item.css",
  shadow: true,
})
export class CvContactItem {
  @Prop() icon: "phone" | "house" | "mail" | "github" | "linkedin";

  render() {
    return (
      <Host>
        <div class="contact-item">
          {this.icon && (
            <div class="contact-icon">
              <cv-icon icon={this.icon} size={20}></cv-icon>
            </div>
          )}
          <span class="contact-content">
            <slot></slot>
          </span>
        </div>
      </Host>
    );
  }
}
