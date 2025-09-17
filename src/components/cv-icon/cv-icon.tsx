import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "cv-icon",
  styleUrl: "cv-icon.css",
  shadow: true,
})
export class CvIcon {
  @Prop() icon: "phone" | "house" | "mail" | "github" | "linkedin";
  @Prop() size: number = 20;
  @Prop() stroke: number = 2;
  @Prop() color: string = "currentColor";

  private getIconPaths() {
    switch (this.icon) {
      case "phone":
        return [
          "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2",
        ];
      case "house":
        return [
          "M5 12l-2 0l9 -9l9 9l-2 0",
          "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7",
          "M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6",
        ];
      case "mail":
        return [
          "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z",
          "M3 7l9 6l9 -6",
        ];
      case "github":
        return [
          "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
        ];
      case "linkedin":
        return [
          "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z",
          "M8 11l0 5",
          "M8 8l0 .01",
          "M12 16l0 -5",
          "M16 16v-3a2 2 0 0 0 -4 0",
        ];
      default:
        return [];
    }
  }

  render() {
    const paths = this.getIconPaths();

    if (paths.length === 0) {
      return <Host></Host>;
    }

    return (
      <Host>
        <svg
          class="icon"
          width={this.size}
          height={this.size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={this.color}
          stroke-width={this.stroke}
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          {paths.map((path) => (
            <path d={path} />
          ))}
        </svg>
      </Host>
    );
  }
}
