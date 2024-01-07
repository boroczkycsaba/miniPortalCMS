import React from 'react'
import './Header.css'
import PageNavigation from './PageNavigation'
import {motion} from 'framer-motion';

const Header = ({portalLanguage, setPortalLanguage}) => {
  return (
      <header>
      <PageNavigation portalLanguage={portalLanguage} setPortalLanguage={setPortalLanguage}></PageNavigation>
      </header>
  )
}

export default Header