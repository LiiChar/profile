import './page.css'

export default function Hello() {
    return (
        <div className="wrapperHello" id='home'>
            <div className="hello">
                <div>Hello, I'm <span className='name'>Ivanov Maksim</span>.</div>
                <div>I'm frontend developer.</div>
                <button onClick={() => document.getElementById('portfolio').scrollIntoView()}>View my work <span className='array'>&rarr;</span></button>
            </div>
        </div>
    )
}


