import './styles/main.css';
import { Map, List } from 'immutable';


const dotsContainer = document.getElementById('dots-container');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const playHistoryButton = document.getElementById('play-history');


let history = List([List([])]);
let historyIndex = 0;
let areEventsBlocked = false;


const operation = (fn) => {
    // if we have history after index => delete it
    history = history.setSize(historyIndex + 1);

    // any fn must return new state
    const newState = fn(history.get(historyIndex));

    // add new state to the history list
    history = history.push(newState);
    historyIndex++;

    draw();
};

const addDot = (x, y) => {
    operation((state) => {
        return state.push(Map({
            x: x,
            y: y,
        }));
    });
};

const draw = () => {
    dotsContainer.innerHTML = '';
    // const currentState = history.toJS()[historyIndex];
    // if (currentState === undefined) return;
    history.get(historyIndex).forEach((dot) => {
        const newDot = dotsContainer.appendChild(document.createElement('div'));
        newDot.className = 'dot';
        newDot.style.left = dot.get('x') + 'px';
        newDot.style.top = dot.get('y') + 'px';
    });
    manageButtonsDisableAttribute();

    function manageButtonsDisableAttribute() {
        undoButton.disabled = (historyIndex !== 0) ? '' : 'disabled';
        redoButton.disabled = (historyIndex !== history.size - 1) ? '' : 'disabled';
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

    if (historyIndex < history.size) historyIndex++;
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
