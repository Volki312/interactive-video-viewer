import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { shuffle, delay, isEqual } from 'lodash'
import { useEffect } from 'react'
import Video from './Video.jsx'

const Level = (props) => {
	const [level, setLevel] = useState(parseInt(props.match.params.level) || 1)
	const [board, setBoard] = useState([])
	const [emptyPosition, setEmptyPosition] = useState([2, 3])
	const [isInTransition, setisInTransition] = useState(false)
	const [isLevelFinished, setIsLevelFinished] = useState(false)
	
	useEffect(() => {
		const boardDimensions = [
			[ 0, 1, 2, 3 ],
			[ 0, 1, 2, 3 ],
			[ 0, 1, 2, 3 ],
		]
		
		let freePositions = shuffle([ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,2], [1,3], [2,0], [2,1], [2,2] ])
		// let freePositions = [ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,3], [2,2], [2,0], [2,1], [1,2] ]
		
		setBoard(boardDimensions.map((arr, row) => arr.map((val, column) => {
			if (row === 2 && column === 3) return { src: '', position: [row, column], correctPosition: [row, column]}
			const correctPosition = freePositions.shift()
			return { src: require(`./assets/${level}/${correctPosition[0]},${correctPosition[1]}.jpg`), position: [row, column], correctPosition: correctPosition }
		})))
	}, [level])

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

				// updatedBoard
				let uL = board;
				[uL[x1][y1].src, uL[x2][y2].src] = [uL[x2][y2].src, uL[x1][y1].src];
				[uL[x1][y1].correctPosition, uL[x2][y2].correctPosition] = [uL[x2][y2].correctPosition, uL[x1][y1].correctPosition]

				setBoard(uL)
				setEmptyPosition(pressedPosition)
				setisInTransition(false)
			}, 601, [target])

		}
		return
	}

	useEffect(() => {
		if (board.flat().every(piece => isEqual(piece.position, piece.correctPosition))) setIsLevelFinished(true)
	}, [board, movePiece])
	// }, [movePiece])

	//after setIsLevelFinished start playing video and show a menu with a button to go to next level -> setLevel
	//on level change reset isLevelFinished to false

	return (
		<main id="puzzle">
			{!isLevelFinished ? board.map((row, i) => {
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
				: <Video level={level}/>
			}
		</main>
	)
}

Level.propTypes = {
	match: PropTypes.object,
}

export default Level
