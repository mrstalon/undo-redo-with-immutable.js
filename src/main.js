import './styles/main.css';
import Immutable from 'immutable';


const dotsContainer = document.getElementById('dots-container');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const playHistoryButton = document.getElementById('play-history');


let history = [Immutable.List([])];
let historyIndex = 0;
let areEventsBlocked = false;


const operation = (fn) => {
    history = history.slice(0, historyIndex + 1);

    // any fn in our code returns new state
    const newState = fn(history[historyIndex]);

    // add new state to the history list
    history.push(newState);
    historyIndex++;

    draw();
};

const addDot = (x, y) => {
    operation((state) => {
        return state.push(Immutable.Map({
            x: x,
            y: y,
        }));
    });
};

const draw = () => {
    dotsContainer.innerHTML = '';
    history[historyIndex].forEach((dot) => {
        const newDot = dotsContainer.appendChild(document.createElement('div'));
        newDot.className = 'dot';
        newDot.style.left = dot.get('x') + 'px';
        newDot.style.top = dot.get('y') + 'px';
    });
    manageButtonsDisableAttribute();

    function manageButtonsDisableAttribute() {
        undoButton.disabled = (historyIndex !== 0) ? '' : 'disabled';
        redoButton.disabled = (historyIndex !== history.length - 1) ? '' : 'disabled';
        playHistoryButton.disabled = (historyIndex !== 0) ? '' : 'disabled';
    }
};

dotsContainer.addEventListener('click', (e) => {
    if (areEventsBlocked) return;

    addDot(e.pageX, e.pageY);
});

undoButton.addEventListener('click', () => {
    if (areEventsBlocked) return;

    if (historyIndex > 0) historyIndex--;
    draw();
});

redoButton.addEventListener('click', () => {
    if (areEventsBlocked) return;

    if (historyIndex < history.length) historyIndex++;
    draw();
});

playHistoryButton.addEventListener('click', () => {
    if (areEventsBlocked) return;

    const lastHistoryIndex = historyIndex;
    historyIndex = 0;
    let tempIndex = 0;

    areEventsBlocked = true;
    const interval = setInterval(() => {
        draw();

        if (historyIndex === lastHistoryIndex) {
            areEventsBlocked = false;
            clearInterval(interval);
        } else {
            historyIndex++;
        }
    }, 150);
});

draw();
