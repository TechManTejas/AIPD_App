import React, { useEffect, useState, CSSProperties } from "react";

type Props = {
    seconds: number;
    size: number;
    strokeBgColor: string;
    strokeColor: string;
    strokeWidth: number;
};

type State = {
    countdown: number;
    isPlaying: boolean;
};

export const CountdownTimer: React.FC<Props> = (props) => {
    const milliseconds = props.seconds * 1000;
    const radius = props.size / 2;
    const circumference = props.size * Math.PI;

    const [countdown, setCountdown] = useState(milliseconds);
    const [isPlaying, setIsPlaying] = useState(false);

    const strokeDashoffset = () =>
        circumference - (countdown / milliseconds) * circumference;

    const startTimer = () => {
        setIsPlaying(true);

        const interval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 10);

            if (countdown === 0) {
                clearInterval(interval);
                setCountdown(milliseconds);
                setIsPlaying(false);
            }
        }, 10);
    };

    useEffect(() => {
        startTimer();
    }, []); // Run only once when the component is mounted

    const countdownSizeStyles: CSSProperties = {
        height: props.size,
        width: props.size,
    };

    const textStyles: CSSProperties = {
        color: props.strokeColor,
        fontSize: props.size * 0.3,
    };

    const seconds = (countdown / 1000).toFixed();

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    margin: "auto",
                    height: props.size,
                    width: props.size,
                }}
            >
                <p style={textStyles}>{seconds}s</p>
                <svg style={styles.svg}>
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius}
                        fill="none"
                        stroke={props.strokeBgColor}
                        strokeWidth={props.strokeWidth}
                    ></circle>
                </svg>
                <svg style={styles.svg}>
                    <circle
                        strokeDasharray={circumference}
                        strokeDashoffset={isPlaying ? strokeDashoffset() : 0}
                        r={radius}
                        cx={radius}
                        cy={radius}
                        fill="none"
                        strokeLinecap="round"
                        stroke={props.strokeColor}
                        strokeWidth={props.strokeWidth}
                    ></circle>
                </svg>
            </div>
        </div>
    );
};

const styles = {
    countdownContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        margin: "auto",
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        transform: "rotateY(-180deg) rotateZ(-90deg)",
        overflow: "visible",
    } as CSSProperties,
    button: {
        fontSize: 16,
        padding: "15px 40px",
        margin: "10px auto 30px",
        display: "block",
        backgroundColor: "#4d4d4d",
        color: "lightgray",
        border: "none",
        cursor: "pointer",
        outline: 0,
    },
};

export default CountdownTimer;
