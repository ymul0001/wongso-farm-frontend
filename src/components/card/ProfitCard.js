import React from 'react';
import AnimatedNumber from 'animated-number-react';

const ProfitCard = (props) => {
    return(
        <div className={props.containerClassName}>
            <h3 className="profit-title">{props.title}</h3>
            {/* <p className="profit-details">{props.details}</p> */}
            <AnimatedNumber
                value={props.details}
                className="profit-details"
                formatValue={n => n.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
        </div>
    )
}
//
export default ProfitCard;