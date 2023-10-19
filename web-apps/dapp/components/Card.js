"use client"
import React, { useEffect, useState } from 'react';

const Card = ({ image }) => {
  const [bounds, setBounds] = useState(null);

  return (
    <div className="card" style={{ background: `url('${image}')`, backgroundSize: 'cover', }}>
      <div className="glow" />
    </div>
  );
};

export default Card;
