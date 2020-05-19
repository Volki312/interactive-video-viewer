import React from 'react'
import PropTypes from 'prop-types'

const Video = (props) => {
	return (
		<video className="video" autoPlay muted>
			<source src={require(`./assets/${props.level}/video.mp4`)} type="video/mp4" />
			Your browser does not support the video tag.
		</video>
	)
}

Video.propTypes = {
	level: PropTypes.string.isRequired,
}

export default Video
