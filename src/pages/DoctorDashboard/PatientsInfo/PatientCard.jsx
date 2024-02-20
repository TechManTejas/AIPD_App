import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import { CardActionArea } from '@mui/material';

export default function PatientCard({ details }) {

    const handleCallClick = (phoneNumber) => {
        window.location.href = `tel:${phoneNumber}`;
    };

    const handleWhatsAppClick = (phoneNumber) => {
        window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    };

    return (
        <>
            <div className="border shadow-xl rounded m-1 p-2 mb-4 bg-slate-50 space-y-3">
                <div className='space-y-3 border-4 p-2'>
                    <div>
                        <div className="flex justify-between">
                            <div className="text-xl font-bold bg-green-50 tracking-wide">
                                {(details).user.first_name}
                                &nbsp;
                                {(details).user.last_name}
                            </div>
                            <div className=' font-extralight  mx-2'>
                                {(details).status ?
                                    <div className='text-green-600 bg-green-100 rounded-full px-2'>
                                        Active
                                    </div>
                                    :
                                    <div className='text-white bg-red-500 rounded-full px-2'>
                                        Done
                                    </div>
                                }
                            </div>
                            {/* <div className="text-base">
                        {(details).start_date}
                        &nbsp; - &nbsp;
                        {(details).end_date}
                    </div> */}
                        </div>
                        <div className="text-sm font-fredoka text-gray-500">
                            {(details).condition.name}
                        </div>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div className='flex space-x-2 items-center'>
                            {(details).status ?
                                <>
                                    {(details).days_since_last_completion === -1 ?
                                        <>
                                            <div className='h-5 w-5 bg-gray-900 rounded-full' />
                                            <div>
                                                Not Started
                                            </div>
                                        </>
                                        :
                                        (details).days_since_last_completion === 0
                                            ?
                                            <>
                                                <div className='h-5 w-5 bg-[#A7D820FF] rounded-full' />
                                                <div>
                                                    Completed Today
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className='h-5 w-5 bg-red-600 rounded-full' />
                                                <div>
                                                    Missed {(details).days_since_last_completion} days
                                                </div>
                                            </>}
                                </>
                                :
                                <>
                                    <>
                                        <div className='h-5 w-5 bg-gray-300 rounded-full' />
                                        <div>
                                            Done
                                        </div>
                                    </>
                                </>
                            }
                        </div>
                        <div className='flex space-x-2 items-center'>
                            <CalendarTodayIcon />
                            <div>
                                {(details).end_date}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-2'>
                    <CardActionArea onClick={() => { handleWhatsAppClick(details.user.username) }}>
                        <div className='flex flex-1 space-x-2 justify-center bg-gray-200 rounded-md p-1'>
                            <WhatsAppIcon color='success' />
                            <div>
                                Whatsapp
                            </div>
                        </div>
                    </CardActionArea>
                    <CardActionArea onClick={() => { handleCallClick(details.user.username) }}>
                        <div className='flex flex-1 space-x-2 justify-center bg-[#3EBDE0FF] text-white rounded-md p-1'>
                            <CallIcon />
                            <div>
                                Call
                            </div>
                        </div>
                    </CardActionArea>
                </div>
            </div>
        </>
    )
}