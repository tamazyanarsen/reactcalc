import React from "react";
import './MainComponent.css';

export class MainComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { expr: '' };
        this.setExpr = this.setExpr.bind(this);
    }

    setExpr(e) {
        console.log(e.target.value);
        this.setState({ expr: e.target.value });
    }

    render() {
        return <div className={'main-div'}>
            <div className={'block'}>
                Введите свое выражение:
                <br/>
                <input value={this.state.value}
                       onChange={this.setExpr}/>
                {this.expr}
            </div>
            <div className={'block'}>2</div>
        </div>
    }
}
