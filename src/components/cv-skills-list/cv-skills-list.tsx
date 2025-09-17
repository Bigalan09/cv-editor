import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-skills-list',
  styleUrl: 'cv-skills-list.css',
  shadow: true,
})
export class CvSkillsList {
  @Prop() skills: string[] = [];
  @Prop() bulletColor: string = '#2c5f6f';

  render() {
    return (
      <Host style={{ '--bullet-color': this.bulletColor }}>
        <ul class="skills-list">
          {this.skills.map(skill => (
            <li class="skills-item">{skill}</li>
          ))}
        </ul>
      </Host>
    );
  }
}
