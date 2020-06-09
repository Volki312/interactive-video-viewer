/* eslint-disable no-undef */
import React from 'react'
import PropTypes from 'prop-types'
import { delay } from 'lodash'

const Video = ({onEnded, level}) => {
	const setPause = (e) => { 
		let target = e.target     
		delay(() => {
			target.pause()
			onEnded()
		}, (target.duration * 1000) - 500, [target])
	}

	return (
		<video
			id="video"
			className="video"
			onPlay={setPause}
			autoPlay
			muted
			poster={require(`./assets/${level}/full.jpg`)}
		>
			<source src={require(`./assets/${level}/video.webm`)} type="video/webm" />
			{/* <source src={require(`./assets/${level}/video.mp4`)} type="video/mp4" /> */}
			Your browser does not support the video tag.
		</video>
	)
}

Video.propTypes = {
	level: PropTypes.string.isRequired,
	onEnded: PropTypes.func.isRequired,
}

export default Video
