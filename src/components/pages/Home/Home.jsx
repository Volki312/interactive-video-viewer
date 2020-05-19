import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
	return (
		<main>
			<br />
			<Link className="links" to="/level/1">lvl 1</Link><br />
			<Link className="links" to="/level/2">lvl 2</Link><br />
			<Link className="links" to="/level/3">lvl 3</Link><br />
			<Link className="links" to="/level/4">lvl 4</Link><br />
		</main>
	)
}

export default Home
