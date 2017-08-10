import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchSemesterData } from './actions';
import { defaultSemester } from './util/semester';
import Statistics from './components/statistics';

import Partner from './util/partner';

class App extends Component {
    componentDidMount() {
        this.props.dispatch(fetchSemesterData(defaultSemester()));
    }

    onChangeSemester = (semester) => {
        this.props.dispatch(fetchSemesterData(semester));
    };

    render() {
        const { semesterData } = this.props;
        return (
                <Statistics {...semesterData} partner={Partner.partnerByCode('AMNH')} onChangeSemester={this.onChangeSemester}/>
        );
    }
}

function mapStateToProps(state) {
    return {
        semesterData: state.semesterData
    };
}

export default connect(mapStateToProps)(App);