import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Menu = ({replayVideo, type, nextLevel}) => {
	const replay = () => {
		replayVideo()
		const video = document.getElementById('video')
		video.currentTime = 0
		video.play()
	}

	return (
		<ul className="menu">
			{type === 'start' && <li className="menu-item"><Link className="menu-link" to="/level/1">Solve the puzzle</Link></li>}
			{type === 'regular' && <li className="menu-item"><Link className="menu-link" to={`/level/${nextLevel}`}>Go to the next level</Link></li>}
			{type === 'end' && <li className="menu-item"><Link className="menu-link" to="/level/1">Play again</Link></li>}
			{type !== 'start' && <li className="menu-item" onClick={replay}><p className="menu-link">Replay video</p></li>}
		</ul>
	)
}

Menu.propTypes = {
	type: PropTypes.string.isRequired,
	replayVideo: PropTypes.func,
	nextLevel: PropTypes.number,
}

export default Menu