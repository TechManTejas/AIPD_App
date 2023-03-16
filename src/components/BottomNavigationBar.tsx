import { CardActionArea } from "@mui/material"
import { Link } from "react-router-dom"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";

export const BottomNavigationBar: React.FC = () => {

    const [page, setPage] = useState<string>("program")

    return(
        <div className='h-screen'>
            <div className='flex text-white bg-green-600 w-full absolute bottom-0'>
                <CardActionArea onClick={()=> setPage("program")}>
                    <Link to="/program">
                        <div className={`flex flex-col items-center p-1 pt-2 ${(page === "program") ? '' : 'opacity-50'}`}>
                            <CalendarTodayIcon />
                            Program
                        </div>
                    </Link>
                </CardActionArea>
                <CardActionArea onClick={() => setPage("results")}>
                    <Link to="/results">
                        <div className={`flex flex-col items-center p-1 pt-2 ${(page === "results") ? '' : 'opacity-50'}`}>
                            <BarChartIcon />
                            Results
                        </div>
                    </Link>
                </CardActionArea>
                <CardActionArea onClick={() => setPage("settings")}>
                    <Link to="/settings">
                        <div className={`flex flex-col items-center p-1 pt-2 ${(page === "settings") ? '' : 'opacity-50'}`}>
                            <SettingsIcon />
                            Settings
                        </div>
                    </Link>
                </CardActionArea>
            </div>
        </div>
    )
}