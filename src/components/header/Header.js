import React from 'react';
import './header.css';

const Header = (props) => {
    return (
        <div className="header">
            <h2 className="header-title">{props.title}</h2>
            <div className="header-profile">
                <img className="profile-image" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs65pAZtW44voOvfltx4liYa2JNRUCSmph0Q&usqp=CAU" alt="profile-picture"/>
                <h3 className="profile-title">adm.wongsofarm</h3>
            </div>
        </div>  
    )
}

export default Header;