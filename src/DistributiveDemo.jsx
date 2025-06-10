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

  const handleNumberChange = (value) => {
    const numValue = Math.max(0, Math.min(999, parseInt(value) || 0));
    setNumber(numValue);
    setSplitSlider(Math.min(splitSlider, numValue));
  };

  const handleMultiplierChange = (value) => {
    const numValue = Math.max(0, Math.min(999, parseInt(value) || 0));
    setMultiplier(numValue);
  };

  // Calculate parts
  const partA = Math.max(0, number - splitSlider);
  const partB = Math.max(0, splitSlider);
  const resultA = multiplier * partA;
  const resultB = multiplier * partB;
  const finalResult = resultA + resultB;

  return (
    <div className="app-container">
      <div className="main-container">
        <h1 className="main-title">Multiply Big Numbers!</h1>
        
        {/* Input Section */}
        <div className="input-section">
          <div className="input-container">
            <label className="input-label">Number:</label>
            <input 
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => handleNumberChange(e.target.value)}
              className="device-input split-part-input"
            />
          </div>
          <div className="input-container">
            <label className="input-label">Multiplier:</label>
            <input 
              type="text"
              inputMode="numeric"
              value={multiplier}
              onChange={(e) => handleMultiplierChange(e.target.value)}
              className="device-input multiplier-input"
            />
          </div>
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