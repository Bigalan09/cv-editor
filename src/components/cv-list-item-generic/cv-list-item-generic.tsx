import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "cv-list-item-generic",
  styleUrl: "cv-list-item-generic.css",
  shadow: true,
})
export class CvListItemGeneric {
  @Prop() bullet: string;
  @Prop() value: string;

  private parseBullet(): string | { icon: string } {
    try {
      return JSON.parse(this.bullet);
    } catch {
      return this.bullet || "-";
    }
  }

  render() {
    const bulletData = this.parseBullet();

    return (
      <Host>
        <div class="list-item">
          <div class="bullet">
            {typeof bulletData === "object" && bulletData.icon ? (
              <cv-icon icon={bulletData.icon} size={20}></cv-icon>
            ) : (
              <span class="bullet-text">{bulletData as string}</span>
            )}
          </div>
          <span class="content" innerHTML={this.value}></span>
        </div>
      </Host>
    );
  }
}
