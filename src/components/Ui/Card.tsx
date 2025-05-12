import React from 'react';
import { Link } from 'react-router-dom';

type CardProps = {
  imageSrc: string;
  title: string;
  descriptions: string[];
  link: string;
};

const Card: React.FC<CardProps> = ({ imageSrc, title, descriptions, link }) => {
  return (
    <Link to={link} className={`text-center bg-white rounded-md p-5 hover:shadow-lg transition-shadow duration-300 ${link ? 'blink-effect' : ''}`}>
      <div className="text-center flex justify-center">
        <img src={imageSrc} alt={title} />
      </div>
      <div className="text-gray-600">
        <h1 className="text-black-500 text-xl font-bold py-2">{title}</h1>
        {descriptions.map((desc, index) => (
          <p key={index} className='text-left text-sm'>{desc}</p>
        ))}
      </div>
    </Link>
  );
};

export default Card;