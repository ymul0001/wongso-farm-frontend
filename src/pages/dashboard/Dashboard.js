import React from 'react';
import {Navigate} from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import {Outlet} from 'react-router-dom';
import './dashboard.css';


const Dashboard = () => {
    
    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

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