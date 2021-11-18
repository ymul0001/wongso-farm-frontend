import './App.css';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Overview from './pages/overview/Overview';
import CustomerManagement from './pages/customer-management/CustomerManagement';
import SalesManagement  from './pages/sales-management/SalesManagement'; 
import Expenditure from './pages/expenditure/Expenditure';
import ExpenditureCreate from './pages/expenditure/create/ExpenditureCreate';
import { Routes , Route } from 'react-router-dom';
import ExpenditureUpdate from './pages/expenditure/update/ExpenditureUpdate';

function App() {
  return (
    <div className="App">
       <Routes>
          <Route path='/' element={<Dashboard/>}>
              <Route path='overview' element={<Overview/>}/>
              <Route path='customer' element={<CustomerManagement/>}/>
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
