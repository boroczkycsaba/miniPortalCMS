import React from 'react'
import './Footer.css'
import {motion} from 'framer-motion'

const Footer = () => {
  return (
    <footer>     
      <motion.div 
      initial={{ opacity:0, scale: 0.1}}
      animate={{ opacity: 1, scale: 1}}
      transition={{ duration: 2}}>
        Mini portal CMS alkalmazás 🗃️ 
      </motion.div>
      <div className='text-right'>
         2024. Böröczky Csaba
      </div>
    </footer>
  )
}

export default Footer