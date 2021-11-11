import './App.css';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Overview from './pages/overview/Overview';
import CustomerManagement from './pages/customer-management/CustomerManagement';
import SalesManagement  from './pages/sales-management/SalesManagement'; 
import Expenditure from './pages/expenditure/Expenditure';
import { Routes , Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
       <Routes>
          <Route path='/' element={<Dashboard/>}>
              <Route path='overview' element={<Overview/>}/>
              <Route path='customer' element={<CustomerManagement/>}/>
              <Route path='sales' element={<SalesManagement/>}/>
              <Route path='expenditure' element={<Expenditure/>}/>
          </Route>
          <Route path='/login' element={<Login/>}/>
       </Routes>
    </div>
  );
}

export default App;
