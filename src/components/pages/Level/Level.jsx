/* eslint-disable no-undef */
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { shuffle, delay, isEqual } from 'lodash'
import { useEffect } from 'react'
import Video from './Video.jsx'
import Menu from '../../shared/Menu'

const initialState = (level, lastPiecePosition) => {
	const boardDimensions = [
		[ 0, 1, 2, 3 ],
		[ 0, 1, 2, 3 ],
		[ 0, 1, 2, 3 ],
	]

	let freePositions = [
		[ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,3], [2,2], [2,0], [2,1], [1,2] ],
		[ [0,0], [0,1], [1,2], [0,2], [1,0], [1,1], [2,2], [0,3], [2,0], [2,1], [1,3] ],
		[ [0,0], [1,1], [0,1], [0,2], [1,0], [1,2], [2,2], [0,3], [2,0], [2,1], [1,3] ],
		shuffle([ [0,0], [0,1], [0,2], [0,3], [1,0], [1,1], [1,2], [1,3], [2,0], [2,1], [2,2] ])
	]

	return (
		{
			emptyPosition: lastPiecePosition,
			isInTransition: false,
			isLevelFinished: false,
			isVideoPlaying: false,
			showHints: false,
			board: boardDimensions.map((arr, row) => arr.map((val, column) => {
				if (row === lastPiecePosition[0] && column === lastPiecePosition[1]) return { src: '', position: [row, column], correctPosition: [row, column]}
				const correctPosition = freePositions[level-1].shift()
				return { src: require(`./assets/${level}/${correctPosition[0]},${correctPosition[1]}.jpg`), position: [row, column], correctPosition: correctPosition }
			})),
		}
	)
}

const Level = (props) => {
	const level = props.match.params.level
	const init = initialState(level, [2, 3])
	const [board, setBoard] = useState(init.board)
	const [emptyPosition, setEmptyPosition] = useState(init.emptyPosition)
	const [isInTransition, setisInTransition] = useState(init.isInTransition)
	const [isLevelFinished, setIsLevelFinished] = useState(init.isLevelFinished)
	const [isVideoPlaying, setIsVideoPlaying] = useState(init.isVideoPlaying)
	const [showHints, setShowHints] = useState(init.showHints)

	useEffect(() => {
		const newLevel = initialState(level, [2, 3])
		setBoard(newLevel.board)
		setIsLevelFinished(newLevel.isLevelFinished)
		setEmptyPosition(newLevel.emptyPosition)
		setisInTransition(newLevel.isInTransition)
		setIsVideoPlaying(newLevel.isVideoPlaying)
		setShowHints(newLevel.showHints)
		document.getElementById('puzzle').style.animation = 'fadein 2s'
	}, [level])

	const movePiece = useCallback((e, pressedPosition) => {
		const [x1, y1] = pressedPosition
		const [x2, y2] = emptyPosition

		if (!isLevelFinished && !isInTransition && ((x2 === x1 && Math.abs(y2 - y1) === 1) || (y2 === y1 && Math.abs(x2 - x1) === 1))) {
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
			}, 600, [target])
		}
		return
	}, [board, isInTransition, emptyPosition, isLevelFinished])

	useEffect(() => {
		if (board.flat().every(piece => isEqual(piece.position, piece.correctPosition))) {
			setShowHints(false)
			setIsLevelFinished(true)
			setIsVideoPlaying(true)
			document.getElementById('puzzle').style.animation = 'none'
		}
	}, [board, movePiece])

	return (
		<main id="puzzle" style={{ backgroundImage: `url(${require(`./assets/${level}/full.jpg`)})`, backgroundSize: 'cover' }}>
			{ !isLevelFinished &&
			<button id="help" onClick={() => setShowHints(!showHints)}>
				{<img 
					alt={!showHints ? 'Show hints' : 'Hide hints'}
					title={!showHints ? 'Show hints' : 'Hide hints'}
					className="help--image"
					src={!showHints ? 'https://img.icons8.com/fluent/48/000000/help.png' : 'https://img.icons8.com/cotton/64/000000/cancel--v2.png'}
				/>}
			</button>
			}
			{board.map((row, i) => {
				return (
					<div key={i} className="puzzle-row" style={{backgroundColor: isLevelFinished ? 'transparent' : 'black'}}>
						{row.map((piece, j) => {
							return (
								<div
									key={j}
									onClick={(e) => movePiece(e, piece.position)}
									className="puzzle-piece"
									style={{
										// backgroundImage: `url(${!isLevelFinished ? piece.src : ''})`,
										backgroundImage: !isLevelFinished ? `url(${piece.src})` : 'none',
										backgroundColor: isLevelFinished && !isEqual(piece.correctPosition, emptyPosition) ? 'transparent' : 'black',
										position: isLevelFinished ? 'relative' : 'initial',
									}}
									alt="Puzzle piece"
								>
									{showHints && <span className="puzzle-position" >{piece.correctPosition[0]+1},{piece.correctPosition[1]+1}</span>}
								</div>
							)
						})}
					</div>
				)})
			}
			{ isLevelFinished && <Video level={level} onEnded={() => setIsVideoPlaying(false)} /> }
			{ isLevelFinished && !isVideoPlaying && <Menu type={level < '4' ? 'regular' : 'end'} nextLevel={parseInt(level)+1} replayVideo={() => setIsVideoPlaying(true)} />}
		</main>
	)
}

Level.propTypes = {
	match: PropTypes.object.isRequired,
}

export default Level
