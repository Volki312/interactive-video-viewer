import React from 'react'
import video from './video.mp4'

const Home = () => {
	return (
		<main>
			<video className="video" controls autoPlay muted>
				<source src={video} type="video/mp4" />
				Your browser does not support the video tag.
			</video> 
		</main>
	)
}

export default Home
