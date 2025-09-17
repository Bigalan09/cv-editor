import { Component, Host, h, Prop } from "@stencil/core";

interface ContentData {
  type: "text" | "list";
  data: string | Array<{ bullet: string | { icon: string }; value: string }>;
}

@Component({
  tag: "cv-subsection",
  styleUrl: "cv-subsection.css",
  shadow: true,
})
export class CvSubsection {
  @Prop() heading?: string;
  @Prop() subtitle?: string;
  @Prop() period?: string;
  @Prop() content: string;

  private parseContent(): ContentData {
    try {
      return JSON.parse(this.content);
    } catch {
      return { type: "text", data: this.content || "" };
    }
  }

  render() {
    const contentData = this.parseContent();

    // For sidebar sections (no heading/subtitle/period), render just the content
    if (!this.heading && !this.subtitle && !this.period) {
      return <Host>{this.renderContent(contentData)}</Host>;
    }

    // For main sections, render with cv-section-item
    return (
      <Host>
        <cv-section-item
          heading={this.heading}
          subheading={this.subtitle}
          period={this.period}
        >
          {this.renderContent(contentData)}
        </cv-section-item>
      </Host>
    );
  }

  private renderContent(contentData: ContentData) {
    if (contentData.type === "text") {
      return <p innerHTML={contentData.data as string}></p>;
    }

    if (contentData.type === "list") {
      const listData = contentData.data as Array<{
        bullet: string | { icon: string };
        value: string;
      }>;
      return (
        <cv-list>
          {listData.map((item) => (
            <cv-list-item-generic
              bullet={JSON.stringify(item.bullet)}
              value={item.value}
            ></cv-list-item-generic>
          ))}
        </cv-list>
      );
    }

    return null;
  }
}
