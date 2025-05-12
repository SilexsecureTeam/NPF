import Button from '@/components/Ui/Button';

import { FaBeer, FaCoffee, } from 'react-icons/fa';

const ButtonT: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Button Component Examples</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Button with Text */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Basic Button with Text</h2>
            <Button text="Click Me" onClick={() => alert('Button Clicked!')} />
          </div>

          {/* Button with Icon */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Icon</h2>
            <Button text="With Icon" icon={FaBeer} onClick={() => alert('Button with Icon Clicked!')} />
          </div>

          {/* Loading Button */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Loading Button</h2>
            <Button text="Loading..." isLoading={true} />
          </div>

          {/* Disabled Button */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Disabled Button</h2>
            <Button text="Disabled" disabled={true} />
          </div>

          {/* Button as a Link */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button as a Link</h2>
            <Button text="Go to Google" link="https://www.google.com" />
          </div>

          {/* Button as a Div */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button as a Div</h2>
            <Button text="Div Button" div={true} onClick={() => alert('Div Button Clicked!')} />
          </div>

          {/* Button with Custom Classes */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Custom Classes</h2>
            <Button 
              text="Custom Styles" 
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-105 hover:bg-green-600 active:scale-95"
              onClick={() => alert('Custom Styled Button Clicked!')} 
            />
          </div>

          {/* Button with Icon on Right */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Icon on Right</h2>
            <Button 
              text="Icon Right" 
              icon={FaCoffee} 
              iconPosition="right" 
              onClick={() => alert('Button with Icon on Right Clicked!')} 
            />
          </div>

          {/* Button with Custom Loading Spinner */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Custom Loading Spinner</h2>
            <Button 
              text="Loading Custom" 
              isLoading={true} 
              loadingClass="text-blue-500 animate-spin h-6 w-6" 
            />
          </div>

          {/* Button with Different Focus and Ring Styles */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Focus and Ring Styles</h2>
            <Button 
              text="Focus Styles" 
              className="bg-yellow-500 text-white px-4 py-2 rounded transition-transform duration-200 transform hover:scale-105 ring-2 ring-yellow-600 focus:ring-4 focus:ring-yellow-400"
              onClick={() => alert('Focus and Ring Styled Button Clicked!')} 
            />
          </div>

          {/* Button with Disabled State and Custom Styling */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-lg font-semibold">Button with Disabled State and Custom Styling</h2>
            <Button 
              text="Disabled Custom" 
              disabled={true} 
              className="bg-gray-500 text-gray-200 px-4 py-2 rounded shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonT;
