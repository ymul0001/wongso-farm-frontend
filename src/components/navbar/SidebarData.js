import React from 'react';
import {AiFillPieChart, AiOutlineBarChart, AiOutlineLogout, AiFillBook} from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';

export const SidebarData = [
    {
        title: 'Overview',
        path: 'overview',
        cName: 'nav-text',
        icon: <AiFillPieChart/>
    }, 
    {
        title: 'Customer Management',
        path: 'customer',
        cName: 'nav-text',
        icon: <BsFillPersonFill/>
    },
    {
        title: 'Sales Management',
        path: 'sales',
        cName: 'nav-text',
        icon:  <AiOutlineBarChart/>
    },
    {
        title: 'Expenditures',
        path: 'expenditure',
        cName: 'nav-text',
        icon: <AiFillBook/>
    },
    {
        title: 'Sign Out',
        path: 'login',
        cName: 'nav-text',
        icon: <AiOutlineLogout/>
    }
]