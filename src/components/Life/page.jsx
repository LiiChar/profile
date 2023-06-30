'use client'

import Head from "next/head";
import { useEffect, useRef, useState } from "react"
import './page.css'
import Life from '../../utils/life'

export default function Home() {
    const cons = useRef(null)
    const home = useRef(null)
    const [flag, setFlag] = useState(false)
    // const [vision, setVision] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setFlag(true)
        }, 0)
    })

    if (flag) {
        const cns = cons.current
        cns.style.backgroundColor = 'none'
        Life(cns, home.current.clientWidth, home.current.clientHeight)
    }
    return (
        <div ref={home} className="main">
            <canvas ref={cons} style={{ width: '100%', height: '100%' }} id='canvas'></canvas>
        </div>
    )
}