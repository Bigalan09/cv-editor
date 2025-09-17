import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvSkillsListCss = ":host{font-family:Poppins, sans-serif;--bullet-color:#2c5f6f}.skills-list{list-style:none;padding:0;margin:0}.skills-item{margin-bottom:0.375rem;font-size:0.875rem;color:#666;position:relative;padding-left:1rem}.skills-item::before{content:\"•\";color:var(--bullet-color);position:absolute;left:0}";

const CvSkillsList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.skills = [];
        this.bulletColor = '#2c5f6f';
    }
    render() {
        return (h(Host, { key: '131a892f6b0d162debf2f8735786d4bb05ca1a01', style: { '--bullet-color': this.bulletColor } }, h("ul", { key: 'd7dc11035c0b7b73c29710e36e0b1fb027f1bab1', class: "skills-list" }, this.skills.map(skill => (h("li", { class: "skills-item" }, skill))))));
    }
};
CvSkillsList.style = cvSkillsListCss;

export { CvSkillsList as C };
//# sourceMappingURL=cv-skills-list-CPK3CtzR.js.map

//# sourceMappingURL=cv-skills-list-CPK3CtzR.js.map