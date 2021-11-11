import React from 'react';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { useState } from 'react';
import './navbar.css';

const Navbar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return(
    <div className="navigation-container col-md-4 col-xl-2">
      <h3 className="banner">Wongso Farm</h3>
      <nav className="navbar">
          <ul className="menu-items">
              {SidebarData.map((item, index) => {
                return (
                  <li key={index} className={index === currentIndex ? item.cName + " active" : item.cName}>
                    <Link to={item.path} onClick={() => {
                      setCurrentIndex(index);
                      console.log(currentIndex);
                    }}>
                      {item.icon}
                      <span className="menu-title">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
      </nav>
    </div>
  )
}
//

export default Navbar;