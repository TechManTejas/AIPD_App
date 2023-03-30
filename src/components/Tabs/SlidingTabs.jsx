import { Paper, Tabs } from "@mui/material";
import { useState } from "react";

export default function SlidingTabs({
    children
}) {

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Paper style={{
                "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                "display": "flex",
                "flexDirection": "column",
                "width": "100%",
                "boxSizing": "border-box",
                "flexShrink": "0",
                "position": "static",
                "backgroundColor": "transparent",
                "color": "inherit",
                "boxShadow": "none"
            }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    style={{
                        "overflow": "hidden",
                        "display": "flex",
                        "position": "relative",
                        "backgroundColor": "rgb(248 249 250)",
                        "borderRadius": "0.75rem",
                        "minHeight": "unset",
                        "padding": "0.25rem"
                    }}
                    TabIndicatorProps={{
                        style: {
                            transition: "all 0.5s",
                            zIndex: 0,
                            borderRadius: "0.5rem",
                            height: "100%",
                            background: "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))",
                            boxShadow: "rgb(0 0 0 / 14%) 0rem 0.25rem 1.25rem 0rem, rgb(76 175 79 / 40%) 0rem 0.4375rem 0.625rem -0.3125rem",
                            margin: "1.5px",
                        }
                    }}
                >
                    {children}
                </Tabs>
            </Paper>
        </>
    )
}