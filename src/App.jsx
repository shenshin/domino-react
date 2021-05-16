import User from './components/User';
import AIPlayer from './components/AIPlayer';
import Playline from './components/Playline';
import Stock from './components/Stock';
import { useSelector } from 'react-redux';

const App = () => {
  const { winner } = useSelector((state) => state.domino);
  return (
    <>
      {winner && <h2>{`Game over! The winner today is ${winner?.name}`}</h2>}
      <div>
        <AIPlayer />
      </div>
      <Stock />
      <Playline />
      <User />
    </>
  );
};

export default App;