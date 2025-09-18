import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "cv-profile-image",
  styleUrl: "cv-profile-image.css",
  shadow: true,
})
export class CvProfileImage {
  @Prop() src: string =
    "https://via.placeholder.com/200x200/4A90A4/FFFFFF?text=AG";
  @Prop() alt: string = "Profile Image";

  render() {
    return (
      <Host>
        <div class="profile-image" style={{ backgroundImage: `url(${this.src})` }}>
        </div>
      </Host>
    );
  }
}
