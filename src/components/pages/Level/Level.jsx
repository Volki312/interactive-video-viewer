import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { shuffle, delay, isEqual } from 'lodash'
import { useEffect } from 'react'
import Video from './Video.jsx'

const Level = (props) => {
	const board = [
		[ 0, 1, 2, 3 ],
		[ 0, 1, 2, 3 ],
		[ 0, 1, 2, 3 ],
	]
	// let freePositions = shuffle([ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,2], [1,3], [2,0], [2,1], [2,2] ])
	let freePositions = [ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,3], [2,2], [2,0], [2,1], [1,2] ]

	const initLevel = board.map((arr, row) => arr.map((val, column) => {
		if (row === 2 && column === 3) return { src: '', position: [row, column], correctPosition: [row, column]}
		const correctPosition = freePositions.shift()
		return { src: require(`./assets/${props.match.params.level}/${correctPosition[0]},${correctPosition[1]}.jpg`), position: [row, column], correctPosition: correctPosition }
	}))

	const [level, setLevel] = useState(initLevel)
	const [emptyPosition, setEmptyPosition] = useState([2, 3])
	const [isInTransition, setisInTransition] = useState(false)
	const [isLevelFinished, setisLevelFinished] = useState(false)
	
	const movePiece = (e, pressedPosition) => {
		const [x1, y1] = pressedPosition
		const [x2, y2] = emptyPosition

		if (!isInTransition && ((x2 === x1 && Math.abs(y2 - y1) === 1) || (y2 === y1 && Math.abs(x2 - x1) === 1))) {
			setisInTransition(true)
			let target = e.target

			if (x2 > x1) target.style.transform='translate(0, 100%)'
			if (x2 < x1) target.style.transform='translate(0, -100%)'
			if (y2 > y1) target.style.transform='translate(100%, 0)'
			if (y2 < y1) target.style.transform='translate(-100%, 0)'
			target.style.transitionDuration='0.6s'

			delay(() => {
				target.style.transform = ''
				target.style.transitionDuration = ''

				// updatedLevel
				let uL = level;
				[uL[x1][y1].src, uL[x2][y2].src] = [uL[x2][y2].src, uL[x1][y1].src];
				[uL[x1][y1].correctPosition, uL[x2][y2].correctPosition] = [uL[x2][y2].correctPosition, uL[x1][y1].correctPosition]

				setLevel(uL)
				setEmptyPosition(pressedPosition)
				setisInTransition(false)
			}, 601, [target])

		}
		return
	}

	useEffect(() => {
		if (level.flat().every(piece => isEqual(piece.position, piece.correctPosition))) setisLevelFinished(true)
	}, [level, movePiece])

	return (
		<main id="puzzle">
			{!isLevelFinished ? level.map((row, i) => {
				return (
					<div key={i} className="puzzle-row">						
						{row.map((piece, i) => {
							return (
								<div
									key={i}
									onClick={(e) => movePiece(e, piece.position)}
									className="puzzle-piece"
									style={{backgroundImage: `url(${piece.src})`}}
									alt="Puzzle piece"
								>
									<span className="puzzle-position" >{piece.correctPosition}</span>
								</div>
							)
						})}
					</div>
				)
			})
				: <Video level={props.match.params.level}/>
			}
		</main>
	)
}

Level.propTypes = {
	match: PropTypes.object.isRequired,
}

export default Level
