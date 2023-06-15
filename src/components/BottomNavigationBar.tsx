import { CardActionArea } from "@mui/material"
import { Link } from "react-router-dom"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";

export const BottomNavigationBar: React.FC = () => {

    const [page, setPage] = useState<string>("program")

    return(
        <div className='h-screen bg-white'>
            <div className='flex border-t w-full absolute bottom-0 font-fredoka rounded-t-xl'>
                <CardActionArea onClick={()=> setPage("program")}>
                    <Link to="/program">
                        <div className={`text-xs flex flex-col items-center p-1 py-1.5 ${(page === "program") ? 'text-green-600' : 'opacity-50 text-gray-500'}`}>
                            <CalendarTodayIcon />
                            Program
                        </div>
                    </Link>
                </CardActionArea>
                {/* <CardActionArea onClick={() => setPage("results")}>
                    <Link to="/results">
                        <div className={`text-xs flex flex-col items-center p-1 py-1.5 ${(page === "results") ? 'text-green-600' : 'opacity-50 text-gray-500'}`}>
                            <BarChartIcon />
                            Results
                        </div>
                    </Link>
                </CardActionArea> */}
                <CardActionArea onClick={() => setPage("settings")}>
                    <Link to="/settings">
                        <div className={`text-xs flex flex-col items-center p-1 py-1.5 ${(page === "settings") ? 'text-green-600' : 'opacity-50 text-gray-500'}`}>
                            <SettingsIcon />
                            Settings
                        </div>
                    </Link>
                </CardActionArea>
            </div>
        </div>
    )
}