import {React, useState, useEffect} from 'react';
import {Navigate} from 'react-router-dom';
import Header from '../../components/header/Header';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from "recharts";
import ProfitCard from '../../components/card/ProfitCard';
import './overview.css';

const Overview = () => {
    const [grossProfit, setGrossProfit] = useState(0);
    const [netProfit, setNetProfit] = useState(0);
    const [salesPerMonth, setSalesPerMonth] = useState([]);

    const getGrossProfit = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/dashboard/findGrossProfit',{params: {
            userid: sessionStorage.getItem("userId"),
        }})
        .then(result => {
            setGrossProfit(result.data.message[0].gross_profit)
        })
    }

    const getNetProfit = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/dashboard/findNetProfit',{params: {
            userid: sessionStorage.getItem("userId"),
        }})
        .then(result => {
            setNetProfit(result.data.message[0].net_profit)
        })
    }

    const getSalesPerMonth = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/dashboard/findSalesPerMonth',{params: {
            userid: sessionStorage.getItem("userId"),
        }})
        .then(result => {
            const processedResults = result.data.message.map(row => {
                return ({
                    month: row.month,
                    total_sales: parseInt(row.total_sales)
                })
            })
            setSalesPerMonth(processedResults);
        })
    }

    useEffect(() => {
        getGrossProfit();
    }, "")
    
    useEffect(() => {
        getNetProfit();
    }, "")

    useEffect(() => {
        getSalesPerMonth();
    }, [])

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="overview">
            <Header title="Overview"/>
            <div className="overall-profit">
                <ProfitCard containerClassName="gross-profit-container col-sm-5" title="Gross Profit (IDR)" details={grossProfit}/>
                <ProfitCard containerClassName="net-profit-container offset-sm-1 col-sm-5" title="Net Profit (IDR)" details={netProfit}/>
            </div>
            <div className="sales-per-month">
                <h3 className="sales-month-title">Sales trend per month</h3>
                {salesPerMonth.length > 0 && 
                <ResponsiveContainer width="95%" height={300}>
                    <LineChart
                        width={1500}
                        data={salesPerMonth}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                        >
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total_sales"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            strokeWidth={4}
                        />
                    </LineChart>
                </ResponsiveContainer>
                }
                
            </div>
        </div>
    )
}

export default Overview;

