import { Button } from "@mui/material";

export default function OutlineButton({
    varient = "primary",
    disabled = false,
    fullWidth = false,
    size="large",
    onClick = () => { },
    children
}) {

    var color;
    var border;

    if (varient === "dark") {
        color = "rgb(52, 71, 103)"
        border = "1px solid rgb(52, 71, 103)"
    } else if (varient === "primary") {
        color = "rgb(26, 115, 232)"
        border = "1px solid rgb(26, 115, 232)"
    } else if (varient === "danger") {
        color = "rgb(229, 57, 53)"
        border = "1px solid rgb(229, 57, 53)"
    }

    return (
        <>
            <Button
                disabled={disabled}
                onClick={onClick}
                fullWidth={fullWidth}
                style={{
                    "fontFamily": "Roboto, Helvetica, Arial, sans-serif",
                    "letterSpacing": "0.02857em",
                    "fontWeight": "700",
                    "borderRadius": "0.5rem",
                    "lineHeight": "1.4",
                    "transition": "all 150ms ease-in 0s",
                    "minHeight": "1.9375rem",
                    "padding": "0.375rem 1.125rem",
                    "fontSize": "0.75rem",
                    "background": "transparent",
                    "color": varient ? color : "rgb(52, 71, 103)",
                    "border": varient ? border : "1px solid rgb(52, 71, 103)",
                   
                }}
                sx={{
                    ":hover": {
                        "opacity": "0.75",
                    }
                }}
            >
                {children}
            </Button>
        </>
    )
}