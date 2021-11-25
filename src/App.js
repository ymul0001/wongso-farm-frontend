import './App.css';
import { Routes , Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Overview from './pages/overview/Overview';
import CustomerManagement from './pages/customer-management/CustomerManagement';
import CustomerUpdate from './pages/customer-management/update/CustomerUpdate';
import CustomerCreate from './pages/customer-management/create/CustomerCreate';
import SalesManagement  from './pages/sales-management/SalesManagement'; 
import Expenditure from './pages/expenditure/Expenditure';
import ExpenditureCreate from './pages/expenditure/create/ExpenditureCreate';
import ExpenditureUpdate from './pages/expenditure/update/ExpenditureUpdate';

function App() {
  return (
    <div className="App">
       <Routes>
          <Route path='/' element={<Dashboard/>}>
              <Route path='overview' element={<Overview/>}/>
              <Route path='customer' element={<CustomerManagement/>}/>
              <Route path='customer/create' element={<CustomerCreate title='Customer Management > Create' btnLabel='CREATE'/>}/>
              <Route path='customer/update/:id' element={<CustomerUpdate title='Customer Management > Update' btnLabel='UPDATE'/>}/>
              <Route path='sales' element={<SalesManagement/>}/>
              <Route path='expenditure' element={<Expenditure/>}/>
              <Route path='expenditure/create' element={<ExpenditureCreate title='Expenditure > Create' btnLabel='CREATE'/>}/>
              <Route path='expenditure/update/:id' element={<ExpenditureUpdate title='Expenditure > Update' btnLabel='UPDATE'/>}/>
          </Route>
          <Route path='/login' element={<Login/>}/>
       </Routes>
    </div>
  );
}

export default App;
