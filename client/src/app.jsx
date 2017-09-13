import React from 'react';
import ReactDOM from 'react-dom';
import List from './components/list.jsx'

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id="fullApp">
                <h2>Real Estate Agency Locator</h2>
                <div><List/></div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

