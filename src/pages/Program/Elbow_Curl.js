import { distance, drawLine } from "./PoseFunctions";

export class Elbow_Curl {


    constructor(landmarks, canvasElement, canvasCtx) {
        this.rightShoulder = landmarks[12]
        this.leftShoulder = landmarks[11];
        this.leftElbow = landmarks[13];
        this.rightElbow = landmarks[14];
        this.leftWrist = landmarks[15];
        this.rightWrist = landmarks[16];
        this.canvasElement = canvasElement
        this.canvasCtx = canvasCtx
    };


    getPredictedPoints = () => {
        return [
            {
                x: 2.5 * this.leftShoulder.x - 1.5 * this.rightShoulder.x,
                y: 2.5 * this.leftShoulder.y - 1.5 * this.rightShoulder.y,
            },

            {
                x: 2.5 * this.rightShoulder.x - 1.5 * this.leftShoulder.x,
                y: 2.5 * this.rightShoulder.y - 1.5 * this.leftShoulder.y,
            }
        ]
    }

    getanglebetweenrslslw = () => {
        let anglebetweenrslslw = Math.atan2(
            this.rightShoulder.y - this.leftShoulder.y,
            this.rightShoulder.x - this.leftShoulder.x
        ) -
            Math.atan2(this.leftWrist.y - this.leftShoulder.y, this.leftWrist.x - this.leftShoulder.x);
        anglebetweenrslslw *= 180 / Math.PI;
        if (anglebetweenrslslw < 0) {
            anglebetweenrslslw = 360 + anglebetweenrslslw;
        }
        return anglebetweenrslslw
    }

    getanglebetweenlsrsrw = () => {
        var anglebetweenlsrsrw =
            Math.atan2(
                this.leftShoulder.y - this.rightShoulder.y,
                this.leftShoulder.x - this.rightShoulder.x
            ) -
            Math.atan2(
                this.rightWrist.y - this.rightShoulder.y,
                this.rightWrist.x - this.rightShoulder.x
            );

        anglebetweenlsrsrw *= 180 / Math.PI;

        if (anglebetweenlsrsrw < 0) {
            anglebetweenlsrsrw = 360 + anglebetweenlsrsrw;
        }
        return anglebetweenlsrsrw
    }

    getangleleft = () => {
        var angleleft =
            Math.atan2(this.leftShoulder.y - this.leftElbow.y, this.leftShoulder.x - this.leftElbow.x) -
            Math.atan2(this.leftWrist.y - this.leftElbow.y, this.leftWrist.x - this.leftElbow.x);

        angleleft = angleleft * (180 / Math.PI);
        if (angleleft > 180) {
            angleleft = 360 - angleleft;
        }
        if (angleleft < 0) {
            angleleft = 360 + angleleft;
        }

        return angleleft;
    }

    getangleright = () => {
        var angleright =
            Math.atan2(this.rightWrist.y - this.rightElbow.y, this.rightWrist.x - this.rightElbow.x) -
            Math.atan2(
                this.rightShoulder.y - this.rightElbow.y,
                this.rightShoulder.x - this.rightElbow.x
            );

        angleright = angleright * (180 / Math.PI);

        if (angleright > 180) {
            angleright = 360 - angleright;
        }
        if (angleright < 0) {
            angleright = 360 + angleright;
        }
        return angleright
    }

    getdistanceBetweenleftWristleftElbow = () => {
        return Math.sqrt(
            Math.pow(
                this.leftElbow.x * this.canvasElement.width - this.leftWrist.x * this.canvasElement.width,
                2
            ) +
            Math.pow(
                this.leftElbow.y * this.canvasElement.height -
                this.leftWrist.y * this.canvasElement.height,
                2
            )
        );
    }

    addanarc = () => {
        this.canvasCtx.setLineDash([5, 5]);
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(
            this.leftElbow.x * this.canvasElement.width,
            this.leftShoulder.y * this.canvasElement.height,
            this.getdistanceBetweenleftWristleftElbow(),
            (-2 / 3) * Math.PI,
            0
        );
        this.canvasCtx.stroke();
        this.canvasCtx.setLineDash([0, 0]);
    }



    getSpecificPoints = () => {
        let LPX =
            this.leftElbow.x * this.canvasElement.width + this.getdistanceBetweenleftWristleftElbow();
        let LPY = this.leftShoulder.y * this.canvasElement.height;
        let UPX =
            this.leftElbow.x * this.canvasElement.width -
            this.getdistanceBetweenleftWristleftElbow() * Math.cos((60 * Math.PI) / 180);
        let UPY =
            this.leftShoulder.y * this.canvasElement.height -
            this.getdistanceBetweenleftWristleftElbow() * Math.sin((60 * Math.PI) / 180);
        return [
            LPX, LPY, UPX, UPY
        ]
    }

    changeHitOnCondition1 = () => {
        return distance(
            this.getSpecificPoints()[0],
            this.getSpecificPoints()[1],
            this.leftWrist.x * this.canvasElement.width,
            this.leftWrist.y * this.canvasElement.height
        ) < 10
    }

    changeHitOnCondition2 = () => {
        return distance(
            this.getSpecificPoints()[2],
            this.getSpecificPoints()[3],
            this.leftWrist.x * this.canvasElement.width,
            this.leftWrist.y * this.canvasElement.height
        ) < 10
    }

    drawreflinewithcolor1 = (color, canvasRef) => {
        drawLine(
            color,
            [
                this.rightShoulder.x * canvasRef.current.width,
                this.rightShoulder.y * canvasRef.current.height
            ],
            [
                this.getPredictedPoints()[1].x * canvasRef.current.width,
                this.getPredictedPoints()[1].y * canvasRef.current.height
            ],
            this.canvasCtx
        );
    }

    drawreflinewithcolor2 = (color, canvasRef) => {
        drawLine(
            color,
            [
                this.leftShoulder.x * canvasRef.current.width,
                this.leftShoulder.y * canvasRef.current.height,
            ],
            [
                this.getPredictedPoints()[0].x * canvasRef.current.width,
                this.getPredictedPoints()[0].y * canvasRef.current.height,
            ],
            this.canvasCtx
        );
    }

    findifstartingPointIsReached = (ifStartingPointReached) => {
        return (this.getanglebetweenrslslw() > 160 &&
            this.getanglebetweenrslslw() < 200 &&
            this.getanglebetweenlsrsrw() > 160 &&
            this.getanglebetweenlsrsrw() < 200 &&
            this.getangleleft() > 160 &&
            this.getangleleft() < 200 &&
            this.getangleright() > 160 &&
            this.getangleright() < 200) ||
            ifStartingPointReached != false
    }

    // drawhotpoint1 = (on) => {
    //     this.canvasCtx.beginPath();
    //     this.canvasCtx.strokeStyle = hitOn === on ? "#00ff00" : "#000000";
    //     this.canvasCtx.lineWidth = 2;
    //     if(on == "lower")
    //     this.canvasCtx.arc(LPX, LPY, 10, 2 * Math.PI, false);
    //     canvasCtx.stroke();
    // }
}
    