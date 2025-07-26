import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoute, startNavigation } from '../../store/slices/routeSlice.js';
import SearchBar from '../search/SearchBar.jsx';
import Button from '../common/Button.jsx';
import InputBox from '../common/InputBox.jsx';

const Sidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const { route, status } = useSelector((state) => state.route);
  const dispatch = useDispatch();

  const handleGetDirections = () => {
    if (startNode && endNode) {
      dispatch(fetchRoute({ startNodeId: startNode.nodeId, endNodeId: endNode.nodeId }));
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          onToggle(!isOpen);
        }}
        className="w-12 h-12 flex items-center justify-center"
      >
        {isOpen ? '←' : '→'}
      </Button>
      {isOpen && (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Directions</h2>
          <InputBox
            label="Start"
            value={startNode ? startNode.name : ''}
            placeholder="Select start location"
            onChange={() => {}}
            disabled
          />
          <SearchBar onSelectNode={(node) => setStartNode(node)} />
          <InputBox
            label="End"
            value={endNode ? endNode.name : ''}
            placeholder="Select end location"
            onChange={() => {}}
            disabled
          />
          <SearchBar onSelectNode={(node) => setEndNode(node)} />
          <Button
            onClick={handleGetDirections}
            disabled={status === 'loading' || !startNode || !endNode}
            className="w-full mt-4"
          >
            Get Directions
          </Button>
          {route.length > 0 && (
            <>
              <ul className="mt-4">
                {route.map((step, index) => (
                  <li key={index} className="py-2 border-b">
                    {step.name}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => dispatch(startNavigation())}
                variant="secondary"
                className="w-full mt-4"
              >
                Start Navigation
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;