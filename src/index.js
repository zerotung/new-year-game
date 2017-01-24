let background = {
    init: function() {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 500;
        canvas.height = 500;
        document.getElementById('canvas-stage').appendChild(canvas);
    }
}

background.init();