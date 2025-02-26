import { Box, CircularProgress } from '@mui/material'
import React, { FC } from 'react'
import { BiBorderLeft } from 'react-icons/bi'
import {PiUsersFourLight} from 'react-icons/pi'
import UserAnalytics from '../Analytics/UserAnalytics'
import OrdersAnalytics from '../Analytics/OrdersAnalytics'
import AllInvoices from '../Order/AllInvoices'

type Props = {
    open?: boolean
    value?:number
}

const CircularProgressWithLabel:FC<Props> = ({open, value}) => {
return (
        <Box sx={{position: 'relative', display: 'inline-flex'}}>
            <CircularProgress
             variant='determinate'
             value={value}
             size={45}
             color={value && value > 99 ? "info" : "error"}
             thickness={4}
             style={{zIndex:open ? -1 : 1}}
            />
            <Box 
             sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
             }}
            >
            </Box>
        </Box>
)
}

const DashboardWidgets:FC<Props> = ({open}) => {
//   return (

//     <div className='mt-[30%] min-h-screen'>
//         <div className='grid grid-cols-[75%,25%]'>
//             <div className='p-8'>
//                 <UserAnalytics isDashboard={true}/>

//             </div>

        
//         <div className='pt-[80%] pr-8'>
//         <div className='w-full dark:bg-[#111C43] rounded-sm shadow'>
//             <div className='flex items-center p-5 justify-center'>
//                 <div className="">
//                     <BiBorderLeft className='dark:text-[#45CBA0] text-[#000] text-[30px]'/>
//                     <h5 className='pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]'>
//                             120 
//                     </h5>
//                     <h5 className='py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]'>
//                         Sales Obtained
//                     </h5>
//                 </div>
//                 <div>
//                     <CircularProgressWithLabel value={100} open={open}/>
//                     <h5 className='text-center pt-4'>+120%</h5>
//                 </div>
//             </div>
//         </div>

//         <div className='w-full dark:bg-[#111C43] rouonded-sm shadow my-8'>
//             <div className='flex items-center p-5 justify-center'>
//                 <div className=''>
//                     <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]"/>
//                     <h5 className='pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]'>
//                         450
//                     </h5>
//                     <h5 className='py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]'>
//                        New Users
//                     </h5>
//                 </div>
//                 <div>
//                     <CircularProgressWithLabel value={100} open={open}/>
//                     <h5 className='text-center pt-4'>+150%</h5>
//                 </div>
//             </div>
//         </div>

//         </div>
//         </div>
//             </div>
//   )
return (
    <div className="mt-[5%] min-h-screen p-8">
      {/* Parent Grid: Graph (2/3) + Cards (1/3) */}
      <div className="grid grid-cols-3 gap-8">
        {/* Graph Section */}
        <div className="col-span-2 bg-white dark:bg-[#1a1a2e] rounded-lg shadow-md p-6">
          <UserAnalytics isDashboard={true} />
        </div>
  
        {/* Cards Section */}
        <div className="space-y-6">
          {/* Sales Obtained Card */}
          <div className="w-full dark:bg-[#111C43] bg-white rounded-sm shadow p-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
              <div>
                <h5 className="font-Poppins dark:text-white text-black text-[20px]">
                  120
                </h5>
                <h5 className="font-Poppins dark:text-[#45CBA0] text-black text-[16px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
            </div>
            <div>
              <CircularProgressWithLabel value={100} open={open} />
              <h5 className="text-center pt-2 text-sm">+120%</h5>
            </div>
          </div>
  
          {/* New Users Card */}
          <div className="w-full dark:bg-[#111C43] bg-white rounded-sm shadow p-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
              <div>
                <h5 className="font-Poppins dark:text-white text-black text-[20px]">
                  450
                </h5>
                <h5 className="font-Poppins dark:text-[#45CBA0] text-black text-[16px] font-[400]">
                  New Users
                </h5>
              </div>
            </div>
            <div>
              <CircularProgressWithLabel value={100} open={open} />
              <h5 className="text-center pt-2 text-sm">+150%</h5>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-[65%,35%] mt-[-20px]'>
        <div className='dark:bg-[#111C43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto'>
            <OrdersAnalytics isDashboard={true}/>
        </div>
        <div className='p-5'>
            <h5 className='dark:text-[#fff] text-black text-[20px] font-Poppins font-[400] pb-3'>
                Recent Transactions
            </h5>
            <AllInvoices isDashboard={true}/>

        </div>
      </div>
    </div>
  );
  
 }

export default DashboardWidgets