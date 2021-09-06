function Block(col, row) {
    var me = this;
    this.active = true;
    this.width = 111;
    this.height = 39;
    this.offset = 5;
    this.x = (this.width + this.offset) * col + this.width;
    this.y = (this.height + this.offset) * row + this.height;

    this.destroy = function () {
        me.active = false;
    };
}
