import React, { Component } from 'react'
import './Nav.css';
import {Link} from 'react-router-dom'

export default class Nav extends Component {
    render() {
        return (
           <nav className="nav_bar">
        
               <ul className="nav_list">
                   <Link to='/'>
                   <li>Home</li>
                   </Link>
                   <Link to='/movies'>
                   <li>Movies</li>
                   </Link>

                   <Link to='/about'>
                   <li>About</li>
                   </Link>
               </ul>
           </nav>
        )
    }
}
