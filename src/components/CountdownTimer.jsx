import React, { useState, useEffect, useCallback } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = useCallback(() => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (isNaN(target)) return "Invalid";
    if (difference <= 0) return "Expired";

    return {
      h: Math.floor(difference / (1000 * 60 * 60)),
      m: Math.floor((difference / 1000 / 60) % 60),
      s: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // DEBUG: If it's returning null, it won't show. Let's force a string if it fails.
  if (!timeLeft || timeLeft === "Expired") return <b style={{color: 'red'}}>OFFER ENDED</b>;
  if (timeLeft === "Invalid") return <b style={{color: 'orange'}}>DATE ERROR</b>;

  return (
    <div style={forceVisibleStyle}>
      {String(timeLeft.h).padStart(2, '0')}h : {String(timeLeft.m).padStart(2, '0')}m : {String(timeLeft.s).padStart(2, '0')}s
    </div>
  );
};

const forceVisibleStyle = {
  display: 'inline-block',
  minWidth: '100px', // Ensures it doesn't squash to 0px
  backgroundColor: '#8a7c7c10',
  color: '#000000ff',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '12px',   // Increased size for visibility
  fontWeight: '500',
  zIndex: 9999,       // Ensures it's on top of everything
  border: '2px dotted black', // Temporary border to find it on the screen
  visibility: 'visible',
  opacity: 1
};

export default CountdownTimer;