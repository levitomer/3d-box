import React from 'react';

import './Box.css';

const getPane = (index) => {
    return (
        <div className={`pane pane-${index}`} key={index}>
            {index}
        </div>
    );
};

// Magical Cube
function Box() {
    const box = React.useRef();
    const initialRotation = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };
    const [zoom, setZoom] = React.useState(1);
    const [rotation, setRotation] = React.useState(initialRotation);
    const disableResetButton =
        rotation.x === window.innerWidth / 2 &&
        rotation.y === window.innerHeight / 2;

    // Rotate the cube horizontally when the mouse’s X-axis value changes
    const handleHorizontalRotation = React.useCallback(({ pageX, pageY }) => {
        if (rotation.x !== pageX) {
            setRotation({ x: pageX, y: pageY });
        }
    }, []);

    // Rotate the cube vertically when the mouse’s Y-axis value changes
    const handleVerticalRotation = React.useCallback(({ pageX, pageY }) => {
        if (rotation.y !== pageY) {
            setRotation({ x: pageX, y: pageY });
        }
    }, []);

    // A button that will restore the cube rotation (disabled if not needed)
    const handleReset = React.useCallback(() => {
        setRotation(initialRotation);
    }, []);

    // A button that will rotate the cube randomly
    const handleRandomRotation = React.useCallback(() => {
        setRotation({ x: Math.random() * 360, y: Math.random() * 360 });
    }, []);

    /**
     * Prevent automatically displaying a translucent image which is generated from the drag target
     * and follows the mouse pointer during the drag.
     */
    const handleDragStart = React.useCallback((e) => {
        e.dataTransfer.clearData();
        let boxShadow = box.current.cloneNode(true);
        boxShadow.style.visibility = 'hidden';
        document.body.appendChild(boxShadow);
        e.dataTransfer.setDragImage(boxShadow, 0, 0);
    }, []);

    const handleDragEnd = React.useCallback(({ pageX, pageY }) => {
        setRotation({ x: pageX, y: pageY });
    }, []);

    // Prevent dragover default effect
    const handleDragOver = React.useCallback((e) => {
        e.preventDefault();
    }, []);

    // Change the zoom on mouse scroll
    const handleChangeZoom = React.useCallback((e) => {
        e.preventDefault();

        const delta = zoom + e.deltaY * -0.01;
        const scroll = Math.min(Math.max(0.125, delta), 4);
        if (zoom + scroll < 2) {
            setZoom(zoom + scroll);
        }
    }, []);

    React.useEffect(() => {
        box.current.addEventListener('drag', handleHorizontalRotation);
        box.current.addEventListener('drag', handleVerticalRotation);
        box.current.addEventListener('dragstart', handleDragStart);
        box.current.addEventListener('dragend', handleDragEnd);
        document.addEventListener('dragover', handleDragOver);
        box.current.addEventListener('wheel', handleChangeZoom);

        return () => {
            box.current.addEventListener('drag', handleHorizontalRotation);
            box.current.addEventListener('drag', handleVerticalRotation);
            box.current.addEventListener('dragstart', handleDragStart);
            box.current.addEventListener('dragend', handleDragEnd);
            document.addEventListener('dragover', handleDragOver);
            box.current.addEventListener('wheel', handleChangeZoom);
        };
    }, [
        handleHorizontalRotation,
        handleVerticalRotation,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleChangeZoom,
    ]);

    return (
        <div className="container">
            <div className="buttons">
                <button
                    diabled={disableResetButton}
                    style={{
                        backgroundColor: disableResetButton
                            ? 'red'
                            : 'rgb(31, 223, 41)',
                    }}
                    onClick={handleReset}
                >
                    Reset
                </button>
                <button onClick={handleRandomRotation}>Random</button>
            </div>
            <div
                ref={box}
                draggable="true"
                className="box"
                style={{
                    zoom: zoom,
                    transform:
                        'rotateX(' +
                        rotation.y +
                        'deg) rotateY(' +
                        rotation.x +
                        'deg)',
                }}
            >
                {new Array(6).fill().map((_, index) => getPane(index))}
            </div>
        </div>
    );
}

export default Box;
