import { CardActionArea } from "@mui/material"
import { Link } from "react-router-dom"

export const CameraRendering: React.FC = () => {
    return (
        <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
            <div className="p-1">
                <div className="font-bold text-lg">
                    Recording screen details
                </div>
                <div>
                    <div className="text-xs">
                        1. Starting point reference
                    </div>
                    <div className="text-xs">
                        2. Starting point reference
                    </div>
                    <div className="text-xs">
                        3. Starting point reference
                    </div>
                    <div className="text-xs">
                        4. Starting point reference
                    </div>
                    <div className="text-xs">
                        5. Starting point reference
                    </div>
                    <div className="text-xs">
                        6. Starting point reference
                    </div>
                    <div className="text-xs">
                        7. Starting point reference
                    </div>
                </div>
            </div>
            <div className="text-center">
                CAMERA RENDERS HERE
            </div>
            <div className="p-1">
                <CardActionArea>
                    <div className="border bg-blue-600 text-white font-semibold p-1 text-center">
                        Summary
                    </div>
                </CardActionArea>
            </div>
        </div>
    )
}