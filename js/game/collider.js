export default class Collider {
    constructor(position, size) {
        this.left = position.x;
        this.top = position.y;
        this.width = size.x;
        this.height = size.y;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    static checkCollide(c1, c2) {
        let a = c1.left + c1.width < c2.left;
        let b = c1.left > c2.left + c2.width;
        let c = c1.top + c1.height < c2.top;
        let d = c1.top > c2.top + c2.height;
        return !(a||b||c||d);
    }
}