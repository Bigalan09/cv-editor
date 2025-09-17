import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'cv-employment',
  styleUrl: 'cv-employment.css',
  shadow: true,
})
export class CvEmployment {
  @Prop() position: string;
  @Prop() company: string;
  @Prop() period: string;
  @Prop() achievements: string[] = [];
  @Prop() titleColor: string = '#2c5f6f';
  @Prop() bulletColor: string = '#2c5f6f';

  render() {
    return (
      <Host style={{
        '--title-color': this.titleColor,
        '--bullet-color': this.bulletColor
      }}>
        <article class="employment">
          {this.position && (
            <h3 class="employment-position">{this.position}</h3>
          )}
          {this.company && (
            <div class="employment-company">{this.company}</div>
          )}
          {this.period && (
            <div class="employment-period">{this.period}</div>
          )}
          {this.achievements.length > 0 && (
            <ul class="employment-achievements">
              {this.achievements.map(achievement => (
                <li class="employment-achievement">{achievement}</li>
              ))}
            </ul>
          )}
          <div class="slot-content">
            <slot></slot>
          </div>
        </article>
      </Host>
    );
  }
}
