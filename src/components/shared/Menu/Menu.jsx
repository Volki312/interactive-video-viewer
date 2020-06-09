import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Menu = ({replayVideo, type, nextLevel}) => {
	const replay = () => {
		replayVideo()
		const video = document.getElementById('video')
		video.currentTime = 0
		video.play()
	}

	useEffect(() => {
		let deferredPrompt
		const installBtn = document.getElementById('installBtn')
		installBtn.style.display = 'none'
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault()
			deferredPrompt = e
			installBtn.style.display = 'block'

			installBtn.addEventListener('click', (e) => {
				installBtn.style.display = 'none'
				deferredPrompt.prompt()
				deferredPrompt.userChoice.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the A2HS prompt')
					} else {
						console.log('User dismissed the A2HS prompt')
					}
					deferredPrompt = null
				})
			})
		})
	}, [])

	return (
		<div className="menu">
			<ul className="menu-list">
				{type === 'start' && <li className="menu-item"><Link className="menu-link" to="/level/1">Solve the puzzle</Link></li>}
				{type === 'start' && <li className="menu-item"><button id="installBtn">Install the app</button></li>}
				{type === 'end' && <li className="menu-item"><Link className="menu-link" to="/">Play again</Link></li>}
				{type === 'regular' && <li className="menu-item"><Link className="menu-link" to={`/level/${nextLevel}`}>Go to the next level</Link></li>}
				{type !== 'start' && <li className="menu-item" onClick={replay}><span className="menu-link">Replay video</span></li>}
			</ul>
		</div>
	)
}

Menu.propTypes = {
	type: PropTypes.string.isRequired,
	replayVideo: PropTypes.func,
	nextLevel: PropTypes.number,
}

export default Menu
