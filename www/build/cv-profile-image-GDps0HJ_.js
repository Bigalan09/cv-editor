import { r as registerInstance, h, a as Host } from './index-B-tutnkO.js';

const cvProfileImageCss = ":host{display:block}.profile-image{width:10rem;height:10rem;border-radius:50%;border:0.5rem solid rgba(255, 255, 255, 0.8);background-size:cover;background-position:center;box-shadow:0 0.25rem 1rem rgba(0, 0, 0, 0.1)}";

const CvProfileImage = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.src = 'https://via.placeholder.com/200x200/4A90A4/FFFFFF?text=AG';
        this.alt = 'Profile Image';
    }
    render() {
        return (h(Host, { key: '1c812e9562375b7b72342bfc33a1ef9223c9a941' }, h("div", { key: 'd35f6883dab4600bef690917765ff75569c6710a', class: "profile-image", style: { backgroundImage: `url(${this.src})` } })));
    }
};
CvProfileImage.style = cvProfileImageCss;

export { CvProfileImage as C };
//# sourceMappingURL=cv-profile-image-GDps0HJ_.js.map

//# sourceMappingURL=cv-profile-image-GDps0HJ_.js.map