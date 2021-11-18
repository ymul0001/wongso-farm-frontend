import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import {Outlet} from 'react-router-dom';
import './dashboard.css';


const Dashboard = () => {
    return(
        <div className="dashboard">
            <Navbar/>
            {/* <Routes>
                <Route path='/overview' element={<Overview/>}/>
                <Route path='/customer' element={<CustomerManagement/>}/>
                <Route path='/sales' element={<SalesManagement/>}/>
                <Route path='/expenditure' element={<Expenditure/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes> */}
            <Outlet/>
        </div>
    )
}

export default Dashboard;