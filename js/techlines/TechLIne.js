

class TechLine {
    constructor(snapbox, size, duration, color, opacity) {
        this.snap = snapbox;
        this.group = snapbox.group;
        this.path = 'M 0 0';
        this.riseRun = this.getEvenSizing(size);
        this.done = false;
        this.color = color;
        this.opacity = opacity ? opacity : 0.1;

        // random boolean to determine horizontal or vertical
        this.isHorizontal = Math.random() < 0.5;
        this.reverse = Math.random() < 0.5;
        this.path = this.getStaggerPath(this.isHorizontal, this.reverse);

        this.pathElement = '<path d="' + this.path + '"  stroke-opacity="' + this.opacity + '" stroke="' + this.color + '" fill="none" stroke-width="2" />';

        this.options = {};
        this.fragment = Snap.parse(this.pathElement);
        this.pathArray = this.fragment.selectAll('path');

        this.timeBetweenDraws = duration;
    }

    getRandomSideToSide(dirBoxes, range) {
        return Math.floor(Math.random() * (dirBoxes - 2)) + 1;
    }

    getRandomForward(gridPos) {
        let gridAddMax = 6;
        let gridChange = Math.floor(Math.random() * (gridAddMax - 1)) + 1;
        return gridPos + gridChange; 
    }

    getStaggerPath(horizontal, reverse) {
        //let horizontal = false;

        let riseRun = this.riseRun;

        // which grid box are we starting at
        let gridX = horizontal ? 0 : Math.floor(Math.random() * (riseRun.xBoxes - 2)) + 1;
        let gridY = horizontal ? Math.floor(Math.random() * (riseRun.yBoxes - 2)) + 1 : 0;

        // convert grid box starting number to a coordinate position
        let path_x = horizontal ? 0 : gridX * riseRun.xStep;
        let path_y = horizontal ? gridY * riseRun.yStep : 0;

        let path = 'M ' + path_x + ' ' + path_y;

        while (gridX < riseRun.xBoxes && gridY < riseRun.yBoxes) {

            if (horizontal) {
                gridX = this.getRandomForward(gridX);
            }
            else {
                gridY = this.getRandomForward(gridY);
            }

            let xStep = gridX * riseRun.xStep;
            let yStep = gridY * riseRun.yStep;
            path += ' L ' + xStep + ' ' + yStep;

            if (horizontal) {
                gridY = this.getRandomSideToSide(riseRun.yBoxes);
            }
            else {
                gridX = this.getRandomSideToSide(riseRun.xBoxes);
            }

            xStep = gridX * riseRun.xStep;
            yStep = gridY * riseRun.yStep;
            path += ' L ' + xStep + ' ' + yStep;
        }

        if (reverse) {
            path = SVGPathEditor.reverseNormalized(path);
        }


        return path;
    }

    getEvenSizing(riseRunGoal) {

        let view_wide = window.innerWidth;
        let view_high = window.innerHeight;

        let y_Boxes = Math.round(view_high / riseRunGoal);
        let x_Boxes = Math.round(view_wide / riseRunGoal);

        let x_Step = view_wide / x_Boxes;
        let y_Step = view_high / y_Boxes;

        return {
            xBoxes: x_Boxes,
            yBoxes: y_Boxes,
            xStep: x_Step,
            yStep: y_Step
        };
    }

    init() {
        //this.group.clear();
        this.currentPathIndex = 0;
    }

    isEndReached() {
        if ((this.currentPathIndex >= this.pathArray.length) || (this.currentPathIndex < 0)) {
            return true;
        }
    }

    initDraw() {
        this.init();
        this.draw();
    }

    removeElement(cpath) {
        cpath.remove();
    }

    reverseDraw(currentPath) {
        //return;
        currentPath.attr({"stroke-dashoffset": 0});
        this.currentPathIndex--;
        currentPath.animate({"stroke-dashoffset": -this.leng}, this.timeBetweenDraws, mina.easeout, this.removeElement.bind(this, currentPath));
    }

    draw() {
        var currentPath = this.pathArray[ this.currentPathIndex ];

        this.leng = currentPath.getTotalLength();
        this.group.add(currentPath);

        currentPath.attr({
            fill: 'none',
            "stroke-dasharray": this.leng + " " + this.leng,
            "stroke-dashoffset": this.leng
        });

        if (currentPath.attr('stroke') === 'none') {
            currentPath.attr({stroke: '#000000'});
        }

        this.currentPathIndex++;
        currentPath.animate({"stroke-dashoffset": 0}, this.timeBetweenDraws, mina.easeout, this.reverseDraw.bind(this, currentPath));
    }

}