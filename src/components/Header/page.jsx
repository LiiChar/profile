import React, { useState, useEffect, memo, useRef } from 'react'
import './header.css'
import Link from 'next/link'
import { useScroll, useSpring } from 'framer-motion'
import { motion } from "framer-motion";


const Header = memo(function Header() {
    const [hash, setHash] = useState('#home')
    // const ref = useRef(null)
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
      });
    let home
    let about
    let portfolio
    let contacts
    useEffect(() => {
        home = Number(document.getElementById('home').offsetTop)
        about = Number(document.getElementById('about').offsetTop)
        portfolio = Number(document.getElementById('portfolio').offsetTop)
        contacts = Number(document.getElementById('contacts').offsetTop)
    }, [])


    const handleScroll = React.useCallback((e) => {
        // const windowHeight = e.target.documentElement.scrollHeight;
        const viewUser = (e.target.pageYOffset || e.target.documentElement.scrollTop) - (e.target.documentElement.clientTop || 0);
        if (about > viewUser && viewUser + 100 > home) {
            setHash('#home')
        }
        if (portfolio > viewUser && viewUser + 100 > about) {
            setHash('#about')
        }
        if (contacts > viewUser && viewUser + 100 > portfolio) {
            setHash('#portfolio')
        }
        if (viewUser > contacts - 500) {
            setHash('#contacts')
        }
        // const pView = ((viewUser / (windowHeight - e.target.documentElement.clientHeight)) * 100)
        // const pView = ((viewUser / (windowHeight - e.target.documentElement.clientHeight)) * 100).toFixed(0)
        // ref.current.style.width = pView + '%'
    }, [])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    return (
        <>
            <div className='header'>
                <div className='links'>
                    <div className='wrapHeader'>
                        <div onClick={() => {document.getElementById('home').scrollIntoView();  setHash('#home')}}  className={`link ${hash == '#home' ? 'pickLink' : 'unPickLink'}`}>HOME</div>
                        <div onClick={() => {document.getElementById('about').scrollIntoView();  setHash('#about')}}  className={`link ${hash == '#about' ? 'pickLink' : 'unPickLink'}`}>ABOUT</div>
                        <div onClick={() => {document.getElementById('portfolio').scrollIntoView();  setHash('#portfolio')}}  className={`link ${hash == '#portfolio' ? 'pickLink' : 'unPickLink'}`}>PORTFOLIO</div>
                        <div onClick={() => {document.getElementById('contacts').scrollIntoView();  setHash('#contacts')}}  className={`link ${hash == '#contacts' ? 'pickLink' : 'unPickLink'}`}>CONTACTS</div>
                    </div>
                </div>
                <motion.div
                // ref={ref} 
                style={{ scaleX }}
                className='barAll'></motion.div>
            </div>
        </>
    )
})

export default Header;
