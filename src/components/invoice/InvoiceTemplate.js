import React from 'react';
import logo from '../../images/wongso.jpg';
import './invoicetemplate.css';

export const InvoiceTemplate = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} class="container">
                <div class="inv-title">
                    <h1>Invoice</h1>
                    {/* <p>No. faktur: # 1</p> */}
                    <p>Invoice date: {new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0,10)}</p>
                </div>
                <img src={logo} class="inv-logo" />
                <div className="inv-header">
                    <div className="user-details">
                        <h2>Wongso Farm</h2>
                        <ul>
                            <li>Telur Ayam Kampung</li>
                            <li>Bandar Lampung</li>
                            <li>Hp: 081224081841</li>
                        </ul>
                    </div>
            <div className="customer-details">
              <h2>Customer</h2>
              <ul>
                <li>Kepada Yth: {props.state.invoiceItems[0].customer_name}</li>
                <li>Alamat: {props.state.invoiceItems[0].customer_address}</li>
              </ul>
            </div>
                </div>
                <div class="inv-body">
                    <table>
                        <thead>
                            <th>Jumlah</th>
                            <th>Satuan</th>
                            <th>Nama Barang</th>
                            <th>Harga Satuan</th>
                            <th>Subtotal</th>
                        </thead>
                        <tbody>
                            {props.state.invoiceItems.map(item => {
                                return(
                                    <tr>
                                        <td>{item.qty}</td>
                                        <td>{item.level}</td>
                                        <td>{item.item_name}</td>
                                        <td>{item.price_per_item}</td>
                                        <td>{item.total_price}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td className="unwanted-column"></td>
                                <td className="unwanted-column"></td>
                                <td className="unwanted-column"></td>
                                <th>Grand total</th>
                                <td>{ props.state.invoiceItems.map(item => {return(item.total_price)}).reduce((previousValue, currentValue) => previousValue + currentValue, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="inv-footer">
                    <div className="footer-details">
                        <h5>Pembayaran dapat ditransfer ke:</h5>
                        <p>Bank BCA</p>
                        <p>4300539667</p>
                        <p>Ivandi Nata Wijaya</p>
                    </div>
                    <div className="signature">
                        <div className="customer-signature">
                            <h4 className="signature-title">Tanda Terima</h4>
                            <p className="signature-name">{props.state.invoiceItems[0].customer_name}</p>
                        </div>
                        <div className="user-signature">
                            <h4 className="signature-title">Hormat kami,</h4>
                            <p className="signature-name">Ivandi Nata Wijaya</p>
                        </div>
                    </div>
                </div>
            </div>
      );
});