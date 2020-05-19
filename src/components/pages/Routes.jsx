import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Level from './Level'
import Page404 from './Page404'
import Home from './Home'

function Routes () {
	return (
		<Switch>
			<Route exact path="/Level/:level" component={Level} />
			<Route exact path="/" component={Home} />
			<Route component={Page404} />
		</Switch>
	)
}

export default Routes
