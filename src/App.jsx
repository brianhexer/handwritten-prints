import { useState, useEffect, useRef } from 'react'
import { generateImages, downloadAsPDF, deleteAll } from '../js/generate-images.mjs'
import { setInkColor, toggleDrawCanvas } from '../js/utils/draw.mjs'
import { addFontFromFile, formatText, addPaperFromFile } from '../js/utils/helpers.mjs'

export default function App() {
  const [handwritingFont, setHandwritingFont] = useState("'Homemade Apple', cursive")
  const [fontSize, setFontSize] = useState(10)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [wordSpacing, setWordSpacing] = useState(0)
  const [topPadding, setTopPadding] = useState(5)
  const [inkColor, setInkColorState] = useState('#000f55')
  const [paperMargin, setPaperMargin] = useState(true)
  const [paperLines, setPaperLines] = useState(true)
  const [pageSize, setPageSize] = useState('a4')
  const [pageEffects, setPageEffects] = useState('shadows')
  const [resolution, setResolution] = useState(2)
  const [darkMode, setDarkMode] = useState(false)

  const pageElRef = useRef(null)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const localPreference = window.localStorage.getItem('prefers-theme')
    if (localPreference) {
      if (localPreference === 'light') {
        document.body.classList.remove('dark')
        setDarkMode(false)
      } else {
        document.body.classList.add('dark')
        setDarkMode(true)
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark')
      setDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !darkMode
    if (newDarkMode) {
      document.body.classList.add('fade-in-dark')
      document.body.classList.add('dark')
      document.body.classList.remove('fade-in-light')
      window.localStorage.setItem('prefers-theme', 'dark')
    } else {
      document.body.classList.add('fade-in-light')
      document.body.classList.remove('dark')
      document.body.classList.remove('fade-in-dark')
      window.localStorage.setItem('prefers-theme', 'light')
    }
    setDarkMode(newDarkMode)
  }

  const handleFontChange = (e) => {
    const value = e.target.value
    setHandwritingFont(value)
    document.body.style.setProperty('--handwriting-font', value)
  }

  const handleFontSizeChange = (e) => {
    const value = parseFloat(e.target.value)
    if (value > 30) {
      alert('Font-size is too big try upto 30')
    } else {
      setFontSize(value)
      pageElRef.current?.style.setProperty('fontSize', value + 'pt')
    }
  }

  const handleInkColorChange = (e) => {
    const value = e.target.value
    setInkColorState(value)
    document.body.style.setProperty('--ink-color', value)
    setInkColor(value)
  }

  const handlePaperMarginToggle = () => {
    setPaperMargin(!paperMargin)
    const pageEl = pageElRef.current
    if (pageEl) {
      if (paperMargin) {
        pageEl.classList.remove('margined')
      } else {
        pageEl.classList.add('margined')
      }
    }
  }

  const handlePaperLinesToggle = () => {
    setPaperLines(!paperLines)
    const pageEl = pageElRef.current
    if (pageEl) {
      if (paperLines) {
        pageEl.classList.remove('lines')
      } else {
        pageEl.classList.add('lines')
      }
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    generateImages()
  }

  return (
    <main>
      <button
        aria-label={darkMode ? 'Activate Light Mode' : 'Activate Dark Mode'}
        title="Toggle Dark Mode"
        aria-pressed={darkMode}
        onClick={toggleTheme}
        className="dark-mode-toggle"
      >
        <span className="sun">
          <img
            alt="sun icon that represents light mode"
            width="35px"
            src="images/sun.svg"
          />
        </span>
        <span className="moon">
          <img
            alt="moon icon to represent dark mode"
            width="25px"
            src="images/moon.svg"
          />
        </span>
      </button>

      <h1>Handwritten Prints</h1>

      <section className="generate-image-section">
        <br /><br />
        <form id="generate-image-form" onSubmit={handleFormSubmit}>
          <div className="display-flex output-grid responsive-flex">
            {/* Input Section */}
            <div className="flex-1 page-container-super">
              <div>
                <h2 style={{ marginTop: '0px' }}>Input</h2>
                <label className="block" htmlFor="note">Type/Paste text here</label>
              </div>

              <div className="flex-1 page-container">
                <div 
                  className="page-a margined lines" 
                  ref={pageElRef}
                  style={{ '--handwriting-font': handwritingFont }}
                >
                  <div contentEditable="true" className="top-margin"></div>
                  <div className="display-flex left-margin-and-content">
                    <div contentEditable="true" className="left-margin"></div>
                    <div className="paper-content" id="note" contentEditable="true">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Ut rhoncus dui eget tortor feugiat iaculis.
                    </div>
                  </div>
                  <div className="overlay"></div>
                </div>
                <br />
              </div>

              <div>
                <button
                  id="draw-diagram-button"
                  type="button"
                  style={{ fontSize: '0.9rem', marginTop: '5px' }}
                  className="draw-button"
                >
                  Draw <small>(Beta)</small>
                </button>
              </div>
            </div>

            {/* Customization Section */}
            <div className="customization-col">
              <div style={{ padding: '5px 0px 5px 0px' }}>
                <b>Customizations</b> <small>(Optional)</small>
                <p style={{ fontSize: '0.8rem' }}>
                  <em>Note: Few changes may reflect only in the generated image and not in the preview</em>
                </p>
              </div>

              {/* Handwriting Options */}
              <fieldset>
                <legend>Handwriting Options</legend>
                <div className="category-grid">
                  <div>
                    <label className="block" htmlFor="handwriting-font">Handwriting Font</label>
                    <select id="handwriting-font" value={handwritingFont} onChange={handleFontChange}>
                      <option style={{ fontFamily: "'Homemade Apple'" }} value="'Homemade Apple', cursive">
                        Homemade Apple
                      </option>
                      <option value="Hindi_Font">Kruti-dev(Hindi)</option>
                      <option style={{ fontFamily: "'Caveat', cursive", fontSize: '13pt' }} value="'Caveat', cursive">
                        Caveat
                      </option>
                      <option style={{ fontFamily: "'Liu Jian Mao Cao'", fontSize: '13pt' }} value="'Liu Jian Mao Cao', cursive">
                        Liu Jian Mao Cao
                      </option>
                      <option style={{ fontFamily: "'Indie Flower', cursive", fontSize: '13pt' }} value="'Indie Flower', cursive">
                        Indie Flower
                      </option>
                      <option style={{ fontFamily: "'Shadows Into Light', cursive", fontSize: '13pt' }} value="'Shadows Into Light', cursive">
                        Shadows Into Light
                      </option>
                      <option style={{ fontFamily: "'Dancing Script', cursive", fontSize: '13pt' }} value="'Dancing Script', cursive">
                        Dancing Script
                      </option>
                      <option style={{ fontFamily: "'Pacifico', cursive", fontSize: '13pt' }} value="'Pacifico', cursive">
                        Pacifico
                      </option>
                      <option style={{ fontFamily: "'Kalam', cursive", fontSize: '13pt' }} value="'Kalam', cursive">
                        Kalam
                      </option>
                      <option style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13pt' }} value="'Patrick Hand', cursive">
                        Patrick Hand
                      </option>
                      <option style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '13pt' }} value="'Permanent Marker', cursive">
                        Permanent Marker
                      </option>
                      <option style={{ fontFamily: "'Architects Daughter', cursive", fontSize: '13pt' }} value="'Architects Daughter', cursive">
                        Architects Daughter
                      </option>
                      <option style={{ fontFamily: "'Amatic SC', cursive", fontSize: '13pt' }} value="'Amatic SC', cursive">
                        Amatic SC
                      </option>
                      <option style={{ fontFamily: "'Handlee', cursive", fontSize: '13pt' }} value="'Handlee', cursive">
                        Handlee
                      </option>
                      <option style={{ fontFamily: "'Nothing You Could Do', cursive", fontSize: '13pt' }} value="'Nothing You Could Do', cursive">
                        Nothing You Could Do
                      </option>
                      <option style={{ fontFamily: "'Satisfy', cursive", fontSize: '13pt' }} value="'Satisfy', cursive">
                        Satisfy
                      </option>
                      <option style={{ fontFamily: "'Covered By Your Grace', cursive", fontSize: '13pt' }} value="'Covered By Your Grace', cursive">
                        Covered By Your Grace
                      </option>
                      <option style={{ fontFamily: "'Zeyada', cursive", fontSize: '13pt' }} value="'Zeyada', cursive">
                        Zeyada
                      </option>
                    </select>
                  </div>
                  <div className="upload-handwriting-container">
                    <label className="block" htmlFor="font-file">
                      Upload your handwriting font <small>(Beta)</small>
                    </label>
                    <input accept=".ttf, .otf" type="file" id="font-file" onChange={(e) => addFontFromFile(e.target.files[0])} />
                  </div>
                </div>
              </fieldset>

              {/* Page & Text Options */}
              <fieldset>
                <legend>Page & Text Options</legend>
                <div className="category-grid">
                  <div className="postfix-input" data-postfix="pt">
                    <label htmlFor="font-size">Font Size</label>
                    <input id="font-size" min="0" step="0.5" value={fontSize} onChange={handleFontSizeChange} type="number" />
                  </div>
                  <div>
                    <label className="block" htmlFor="ink-color">Ink Color</label>
                    <select id="ink-color" value={inkColor} onChange={handleInkColorChange}>
                      <option value="#000f55">Blue</option>
                      <option value="black">Black</option>
                      <option value="#ba3807">Red</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" htmlFor="page-size">Page Size</label>
                    <select id="page-size" value={pageSize} onChange={(e) => setPageSize(e.target.value)}>
                      <option value="a4">A4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" htmlFor="page-effects">Effects</label>
                    <select id="page-effects" value={pageEffects} onChange={(e) => setPageEffects(e.target.value)}>
                      <option value="shadows">Shadows</option>
                      <option value="scanner">Scanner</option>
                      <option value="no-effect">No Effect</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" htmlFor="resolution">Resolution</label>
                    <select id="resolution" value={resolution} onChange={(e) => setResolution(parseFloat(e.target.value))}>
                      <option value="0.8">Very Low</option>
                      <option value="1">Low</option>
                      <option value="2">Normal</option>
                      <option value="3">High</option>
                      <option value="4">Very High</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Spacing Options */}
              <fieldset>
                <legend>Spacing Options</legend>
                <div className="category-grid">
                  <div className="postfix-input" data-postfix="px">
                    <label htmlFor="top-padding">Vertical Position</label>
                    <input id="top-padding" min="0" value={topPadding} onChange={(e) => setTopPadding(parseFloat(e.target.value))} type="number" />
                  </div>
                  <div className="postfix-input" data-postfix="px">
                    <label htmlFor="word-spacing">Word Spacing</label>
                    <input id="word-spacing" min="0" max="100" value={wordSpacing} onChange={(e) => setWordSpacing(parseFloat(e.target.value))} type="number" />
                  </div>
                  <div className="postfix-input" data-postfix="pt">
                    <label htmlFor="letter-spacing">Letter Spacing</label>
                    <input id="letter-spacing" min="-5" max="40" value={letterSpacing} onChange={(e) => setLetterSpacing(parseFloat(e.target.value))} type="number" />
                  </div>
                </div>
              </fieldset>

              {/* Margin & Line Options */}
              <fieldset>
                <legend>Margin & Line Options</legend>
                <div className="category-grid">
                  <div>
                    <label htmlFor="paper-margin-toggle">
                      Paper Margin: <span className="status">{paperMargin ? 'on' : 'off'}</span>
                    </label>
                    <label className="switch-toggle outer">
                      <input checked={paperMargin} onChange={handlePaperMarginToggle} type="checkbox" />
                      <div></div>
                    </label>
                  </div>
                  <div>
                    <label htmlFor="paper-line-toggle">
                      Paper Lines: <span className="status">{paperLines ? 'on' : 'off'}</span>
                    </label>
                    <label className="switch-toggle outer">
                      <input checked={paperLines} onChange={handlePaperLinesToggle} type="checkbox" />
                      <div></div>
                    </label>
                  </div>
                  <div className="experimental">
                    <div className="upload-paper-container">
                      <label className="block" htmlFor="paper-file">
                        Upload Paper Image as Background
                      </label>
                      <input accept=".jpg, .jpeg, .png" type="file" id="paper-file" onChange={(e) => addPaperFromFile(e.target.files[0])} />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Generate Button */}
              <hr style={{ border: '0.3px solid var(--elevation-background)', width: '80%' }} />
              <div style={{ textAlign: 'center', padding: '30px 0px' }}>
                <button type="submit" className="button generate-image-button">
                  Generate Image
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>

      {/* Output Section */}
      <section>
        <h2 id="output-header">Output</h2>
        <div id="output" className="output" style={{ textAlign: 'center' }}>
          Click "Generate Image" Button to generate new image.
        </div>
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <button className="imp-button" id="download-as-pdf-button" onClick={downloadAsPDF}>
            Download All Images as PDF
          </button>
          <button className="delete-button" id="delete-all-button" onClick={deleteAll}>
            Clear all images
          </button>
        </div>
      </section>

      {/* Guide Section */}
      <section id="how-to-add-handwriting">
        <h2>🤓 Guide to add your own handwriting</h2>
        <div>
          <ul>
            <li>To use your handwriting, you will have to generate font of your handwriting.</li>
            <li>
              There are websites like{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://www.calligraphr.com/en/">
                Calligraphr
              </a>{' '}
              that let you do that.
            </li>
            <li>
              Once you get .ttf file of your handwriting, upload it from 'Upload your handwriting font' button in customizations sections
            </li>
          </ul>
        </div>
      </section>

      {/* GitHub Corner */}
      <a
        tabIndex="0"
        href="https://github.com/brianhexer/handwritten-prints"
        rel="noopener noreferrer"
        target="_blank"
        className="github-corner"
        aria-label="View source on GitHub"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          style={{
            fill: '#151513',
            color: '#fff',
            position: 'absolute',
            top: 0,
            border: 0,
            right: 0,
          }}
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{ transformOrigin: '130px 106px' }}
            className="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a>

      <footer style={{ padding: '40px 0px 10px 0px' }}>
        Thank you for using Handwritten Prints! A powerful tool for converting
        text to handwriting images.
        <br /><br />Do star the
        <a href="https://github.com/brianhexer/handwritten-prints">
          Handwritten Prints GitHub Repository
        </a>
        <br /><br />Enjoy! ✨ <br /><br />
        ~ Brian Hexer
      </footer>

      {/* Scripts */}
      <script src="js/vendors/html2canvas.min.js" crossOrigin="anonymous"></script>
      <script defer src="https://unpkg.com/jspdf@^1/dist/jspdf.min.js"></script>
    </main>
  )
}
