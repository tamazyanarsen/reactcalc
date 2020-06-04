var express = require('express');
var router = express.Router();
const math = require('mathjs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/api', (req, res) => {
    const data = req.body;
    if (data.action === 'Calc') {
        res.json(calc(data.data));
    }
});

function calc(data) {
    const expr = data.expr;
    const start = +data.start;
    const end = +data.end;
    console.log(data, start, end);
    const result = math.compile(expr);
    const arr = [];
    const step = data.width / (end - start);
    console.log(step);
    for (let i = start; i <= end; i = i + 1 / step) {
        arr.push({ x: i, y: result.evaluate({ x: i }) });
    }
    return arr;
}

module.exports = router;
