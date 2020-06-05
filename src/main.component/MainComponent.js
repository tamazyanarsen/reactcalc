import React from "react";
import './MainComponent.css';
import { sendPostRequest } from "../services/api-service";

export class MainComponent extends React.Component {

    constructor(props) {
        super(props);
        this.appId = 'L8JTY4-LKKVY6LLG8';
        this.state = { expr: '', start: 0, end: 0, plotSrc: '', img: '' };
        this.proxyurl = "https://cors-anywhere.herokuapp.com/";
        this.setExpr = this.setExpr.bind(this);
        this.setStart = this.setStart.bind(this);
        this.setEnd = this.setEnd.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    setExpr(e) {
        console.log(e.target.value);
        this.setState({ expr: e.target.value });
    }

    setStart(e) {
        this.setState({ start: e.target.value });
    }

    setEnd(e) {
        this.setState({ end: e.target.value });
    }

    render() {
        return <div>
            <div className={'main-div flex'}>
                <div className={'block'}>
                    Введите свое выражение:
                    <br/>
                    <input value={this.state.expr}
                           onChange={this.setExpr}/>
                </div>
                <div className={'block'}>
                    Range
                    <br/>
                    <div className={'flex'}>
                        <div>
                            <input type="number"
                                   placeholder="нижняя граница"
                                   value={this.state.start}
                                   onChange={this.setStart}/>
                        </div>
                        <div>
                            <input type="number"
                                   placeholder="верхняя граница"
                                   value={this.state.end}
                                   onChange={this.setEnd}/>
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={this.calculate}>Посчитать</button>
                </div>
            </div>
            <canvas id={'plot'}/>
            {this.state.img}
        </div>
    }

    calculate() {
        sendPostRequest(
            {
                action: 'Calc',
                data: {
                    expr: this.state.expr,
                    start: this.state.start,
                    end: this.state.end,
                    width: 500,
                    height: 500
                }
            })
            .then(e => e.json().then(data => {
                console.log(data);
                this.plot(data, this.state.end - this.state.start)
            }))
            .catch(console.error);
        const createQueryParamFromString = str => {
            while (str.includes(' ')) {
                str = str.replace(' ', '%20');
            }
            return str;
        };
        fetch(`${this.proxyurl}http://api.wolframalpha.com/v2/query?appid=${this.appId}
        &input=${createQueryParamFromString('plot ' + this.state.expr + 'from x=' + this.state.start + ' to ' + this.state.end)}&output=json`)
            .then(e => e.json().then(res => {
                this.setState({ plotSrc: res.queryresult.pods.find(e => e.id === 'Plot').subpods[0].img.src });
                this.setState({
                    img: <img src={this.state.plotSrc}
                              alt="Тут будет график!"/>
                });
            }))
            .catch(console.error);
    }

    plot(data, range) {
        const cnv = document.getElementById('plot');
        const height = 500;
        const width = 500;
        const scaleX = width / range;
        const scaleY = height / range;
        console.log('scale:', scaleX, scaleY);
        cnv.width = width;
        cnv.height = height;
        const startX = Math.round(width / 2);
        const startY = Math.round(height / 2);
        const ctx = cnv.getContext('2d');
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(data[0].x * scaleX + startX, startY - data[0].y * scaleY);
        data.forEach(e => {
            console.log(e.x * scaleX + startX, startY - e.y * scaleY);
            ctx.lineTo(e.x * scaleX + startX, startY - e.y * scaleY);
        });
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}
