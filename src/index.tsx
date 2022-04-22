import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Canvas from './Canvas'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import {Atoms} from './examples/atoms'
import {Selectors} from './examples/selectors'
import {Async} from './examples/async'

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <ChakraProvider>
                <Router>
                    <Switch>
                        <Route path="/examples/atoms">
                            <Atoms />
                        </Route>
                        <Route path="/examples/selectors">
                            <Selectors />
                        </Route>
                        <Route path="/examples/async">
                            <Suspense fallback="loading...">
                                <Async />
                            </Suspense>
                        </Route>
                        <Route>
                            <Canvas />
                        </Route>
                    </Switch>
                </Router>
            </ChakraProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root'),
)
