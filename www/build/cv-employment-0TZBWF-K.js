import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvEmploymentCss = ":host{font-family:Poppins, sans-serif;--title-color:#2c5f6f;--bullet-color:#2c5f6f}.employment{margin-bottom:2.5rem}.employment-position{font-size:1.125rem;font-weight:600;color:var(--title-color);margin-bottom:0.25rem;margin-top:0}.employment-company{font-size:1rem;color:#666;font-weight:400;margin-bottom:0.25rem}.employment-period{font-size:0.875rem;color:#999;margin-bottom:1rem;font-weight:600}.employment-achievements{list-style:none;padding:0;margin:0 0 1rem 0}.employment-achievement{margin-bottom:0.75rem;font-size:0.875rem;color:#666;line-height:1.5;position:relative;padding-left:1rem}.employment-achievement::before{content:\"•\";color:var(--bullet-color);position:absolute;left:0;top:0}.slot-content{display:block}";

const CvEmployment = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.achievements = [];
        this.titleColor = '#2c5f6f';
        this.bulletColor = '#2c5f6f';
    }
    render() {
        return (h(Host, { key: '3e1acee60a18f64ebae41e87556f8be18973c25a', style: {
                '--title-color': this.titleColor,
                '--bullet-color': this.bulletColor
            } }, h("article", { key: '99cd7b43c876ede8a200f57766086587ad20a605', class: "employment" }, this.position && (h("h3", { key: 'd7f317acd3fd333d349b6307eb91aee86dd9e80f', class: "employment-position" }, this.position)), this.company && (h("div", { key: 'f84c907959abe336cfac0bb13f49f1d147c18309', class: "employment-company" }, this.company)), this.period && (h("div", { key: 'f3958c5b19a91ba86ebac797b64018398ac753d6', class: "employment-period" }, this.period)), this.achievements.length > 0 && (h("ul", { key: 'b14722b8683309a59da378c5b7188d95b183196a', class: "employment-achievements" }, this.achievements.map(achievement => (h("li", { class: "employment-achievement" }, achievement))))), h("div", { key: '0a91e21fb5b062e8d8dbcf861c075f482fecf186', class: "slot-content" }, h("slot", { key: '603ff7863af42fc56b81bb70299d7d31e69e5cae' })))));
    }
};
CvEmployment.style = cvEmploymentCss;

export { CvEmployment as C };
//# sourceMappingURL=cv-employment-0TZBWF-K.js.map

//# sourceMappingURL=cv-employment-0TZBWF-K.js.map