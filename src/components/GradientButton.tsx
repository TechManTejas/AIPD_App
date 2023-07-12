import { Button } from "@mui/material";

interface GradientButtonProps {
    onClick: () => void
    varient: String
    isFullWidth: Boolean
    children: any
}

const GradientButton: React.FC<GradientButtonProps> = (
    {
        onClick,
        varient = "primary",
        isFullWidth = false,
        children,
    }
) => {
    var backgroundImage;
    var boxShadow;
    var boxShadowOnHover;

    if (varient === "dark") {
        backgroundImage = "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))"
        boxShadow = "rgb(52 71 103 / 15%) 0rem 0.1875rem 0.1875rem 0rem, rgb(52 71 103 / 20%) 0rem 0.1875rem 0.0625rem -0.125rem, rgb(52 71 103 / 15%) 0rem 0.0625rem 0.3125rem 0rem"
        boxShadowOnHover = "rgb(52 71 103 / 40%) 0rem 0.875rem 1.625rem -0.75rem, rgb(52 71 103 / 15%) 0rem 0.25rem 1.4375rem 0rem, rgb(52 71 103 / 20%) 0rem 0.5rem 0.625rem -0.3125rem"
    } else if (varient === "primary") {
        backgroundImage = "linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))"
        boxShadow = "rgb(26 115 232 / 15%) 0rem 0.1875rem 0.1875rem 0rem, rgb(26 115 232 / 20%) 0rem 0.1875rem 0.0625rem -0.125rem, rgb(26 115 232 / 15%) 0rem 0.0625rem 0.3125rem 0rem"
        boxShadowOnHover = "rgb(26 115 232 / 40%) 0rem 0.875rem 1.625rem -0.75rem, rgb(26 115 232 / 15%) 0rem 0.25rem 1.4375rem 0rem, rgb(26 115 232 / 20%) 0rem 0.5rem 0.625rem -0.3125rem"
    } else if (varient === "danger") {
        backgroundImage = "linear-gradient(195deg, rgb(239, 83, 80), rgb(229, 57, 53))"
        boxShadow = "rgb(244 67 53 / 15%) 0rem 0.1875rem 0.1875rem 0rem, rgb(244 67 53 / 20%) 0rem 0.1875rem 0.0625rem -0.125rem, rgb(244 67 53 / 15%) 0rem 0.0625rem 0.3125rem 0rem"
        boxShadowOnHover = "rgb(244 67 53 / 40%) 0rem 0.875rem 1.625rem -0.75rem, rgb(244 67 53 / 15%) 0rem 0.25rem 1.4375rem 0rem, rgb(244 67 53 / 20%) 0rem 0.5rem 0.625rem -0.3125rem"
    } else if (varient === "success") {
        backgroundImage = "linear-gradient(195deg, rgb(152, 45, 190), rgb(132, 15, 195)"
        boxShadow = "rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(152 45 190 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem"
        boxShadowOnHover = "rgb(152 45 190 / 40%) 0rem 0.25rem 1.25rem 0rem, rgb(132 15 195 / 15%) 0rem 0.4375rem 0.625rem -0.3125rem"
    }

    return (
        <>
            <Button
                onClick={onClick}
                fullWidth={!!isFullWidth}
                style={{
                    "letterSpacing": "0.02857em",
                    "minWidth": "64px",
                    "borderRadius": "0.5rem",
                    "lineHeight": "1.4",
                    "textAlign": "center",
                    "userSelect": "none",
                    "transition": "all 150ms ease-in 0s",
                    "minHeight": "1.8125rem",
                    "padding": "0.375rem 1.125rem",
                    "fontSize": "0.75rem",
                    "backgroundImage": varient ? backgroundImage : "linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))",
                    "color": "rgb(255, 255, 255)",
                }}
                sx={{
                    "boxShadow": varient ? boxShadow : "rgb(52 71 103 / 15%) 0rem 0.1875rem 0.1875rem 0rem, rgb(52 71 103 / 20%) 0rem 0.1875rem 0.0625rem -0.125rem, rgb(52 71 103 / 15%) 0rem 0.0625rem 0.3125rem 0rem",
                    ":hover": {
                        "boxShadow": varient ? boxShadowOnHover : "rgb(52 71 103 / 40%) 0rem 0.875rem 1.625rem -0.75rem, rgb(52 71 103 / 15%) 0rem 0.25rem 1.4375rem 0rem, rgb(52 71 103 / 20%) 0rem 0.5rem 0.625rem -0.3125rem",
                    }
                }}
            >
                {children}
            </Button>
        </>
    )
}


export default GradientButton;