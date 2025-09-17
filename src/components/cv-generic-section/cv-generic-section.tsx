import { Component, Host, h, Prop } from "@stencil/core";

interface Subsection {
  title?: string;
  subtitle?: string;
  period?: string;
  content: {
    type: "text" | "list";
    data: string | Array<{ bullet: string | { icon: string }; value: string }>;
  };
}

@Component({
  tag: "cv-generic-section",
  styleUrl: "cv-generic-section.css",
  shadow: true,
})
export class CvGenericSection {
  @Prop() sectionTitle: string;
  @Prop() subsections: Array<Subsection> = [];

  render() {
    return (
      <Host>
        <cv-section sectionTitle={this.sectionTitle}>
          {this.subsections.map((subsection) => (
            <cv-subsection
              heading={subsection.title}
              subtitle={subsection.subtitle}
              period={subsection.period}
              content={JSON.stringify(subsection.content)}
            ></cv-subsection>
          ))}
        </cv-section>
      </Host>
    );
  }
}
