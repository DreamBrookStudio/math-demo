import React, { useState } from 'react';
import './DistributiveDemo.css';

const DistributiveDemo = () => {
  const [number, setNumber] = useState(10);
  const [multiplier, setMultiplier] = useState(3);
  const [splitSlider, setSplitSlider] = useState(5);

  // Smart snapping functions
  const getRelevantPowerOf10 = (num) => {
    if (num < 10) return 1;
    if (num < 100) return 10;
    if (num < 1000) return 100;
    return 1000;
  };

  const generateSnapPoints = (total, powerOf10) => {
    const snapPoints = [0, total];
    for (let i = powerOf10; i < total; i += powerOf10) {
      snapPoints.push(i);
    }
    return snapPoints.sort((a, b) => a - b);
  };

  const getSmartSnap = (value, total) => {
    if (total === 0) return 0;
    
    const powerOf10 = getRelevantPowerOf10(total);
    const snapPoints = generateSnapPoints(total, powerOf10);
    
    let closest = value;
    let minDistance = Infinity;
    
    for (const snapPoint of snapPoints) {
      const distance = Math.abs(value - snapPoint);
      if (distance < minDistance) {
        minDistance = distance;
        closest = snapPoint;
      }
    }
    
    const snapThreshold = Math.max(1, powerOf10 * 0.25);
    if (minDistance <= snapThreshold) {
      return closest;
    }
    
    return value;
  };

  const handleSliderChange = (value) => {
    const mirroredValue = number - value;
    const snappedPartA = getSmartSnap(mirroredValue, number);
    const snappedSliderValue = number - snappedPartA;
    setSplitSlider(snappedSliderValue);
  };

  // Calculate parts
  const partA = Math.max(0, number - splitSlider);
  const partB = Math.max(0, splitSlider);
  const resultA = multiplier * partA;
  const resultB = multiplier * partB;
  const finalResult = resultA + resultB;

  // Numpad component
  const Numpad = ({ value, onChange, label }) => {
    const handleClick = (action, num) => {
      if (num !== undefined) {
        if (value === 0 || value === '') {
          onChange(parseInt(num));
        } else if (value.toString().length < 3) {
          onChange(parseInt(value.toString() + num));
        }
      } else if (action === 'clear') {
        onChange(0);
      } else if (action === 'backspace') {
        const newValue = value.toString().slice(0, -1);
        onChange(newValue === '' ? 0 : parseInt(newValue));
      }
    };

    return (
      <div className="numpad-container">
        <label className="numpad-label">{label}</label>
        <input 
          type="text" 
          value={value} 
          readOnly 
          className="numpad-input"
        />
        <div className="numpad">
          {[7,8,9,4,5,6,1,2,3].map(num => (
            <button 
              key={num}
              onClick={() => handleClick(null, num)}
              className="numpad-btn"
            >
              {num}
            </button>
          ))}
          <button onClick={() => handleClick('clear')} className="numpad-btn">C</button>
          <button onClick={() => handleClick(null, 0)} className="numpad-btn">0</button>
          <button onClick={() => handleClick('backspace')} className="numpad-btn">⌫</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="main-container">
        <h1 className="main-title">Multiply Big Numbers!</h1>
        
        {/* Input Section */}
        <div className="input-section">
          <Numpad 
            value={number}
            onChange={(val) => {
              setNumber(val);
              setSplitSlider(Math.min(splitSlider, val));
            }}
            label="Number:"
          />
          <Numpad 
            value={multiplier}
            onChange={setMultiplier}
            label="Multiplier:"
          />
        </div>

        {/* Visualization */}
        <div className="visualization">
          {/* Distributive Form */}
          <div className="step">
            <div className="equation-label">Distributive form:</div>
            <div className="step-content">
              <div className="visual-equation">
                <div className="number-box multiplier-box">{multiplier}</div>
                <div className="operator">×</div>
                <div className="parenthesis">(</div>
                <div className="split-container">
                  <div className="number-box split-part">{partA}</div>
                  <div className="operator">+</div>
                  <div className="number-box split-part">{partB}</div>
                </div>
                <div className="parenthesis">)</div>
              </div>
              <div className="slider-controls">
                <input
                  type="range"
                  min="0"
                  max={number}
                  value={splitSlider}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                  className="split-slider"
                />
              </div>
            </div>
          </div>

          {/* Expanded Form */}
          <div className="step">
            <div className="equation-label">Expanded:</div>
            <div className="visual-equation">
              <div className="product-group">
                <div className="number-box multiplier-box small">{multiplier}</div>
                <div className="operator">×</div>
                <div className="number-box split-part">{partA}</div>
              </div>
              <div className="operator">+</div>
              <div className="product-group">
                <div className="number-box multiplier-box small">{multiplier}</div>
                <div className="operator">×</div>
                <div className="number-box split-part">{partB}</div>
              </div>
            </div>
          </div>

          {/* Calculated */}
          <div className="step">
            <div className="equation-label">Calculated:</div>
            <div className="visual-equation calculated-row">
              <div className="number-box result-box">{resultA}</div>
              <div className="operator">+</div>
              <div className="number-box result-box">{resultB}</div>
            </div>
          </div>

          {/* Answer */}
          <div className="step">
            <div className="equation-label">Answer:</div>
            <div className="visual-equation answer-row">
              <div className="final-result">{finalResult}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributiveDemo;