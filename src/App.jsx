import { useSelector } from 'react-redux'
import User from './components/User'
import AIPlayer from './components/AIPlayer'
import Playline from './components/Playline'
import Stock from './components/Stock'

const App = () => {
  const { winner } = useSelector((state) => state.domino);
  return (
    <>
      {winner && <h2>{`Game over! The winner today is ${winner?.name}`}</h2>}
      <Stock />
      <AIPlayer />
      <Playline />
      <User />
    </>
  );
};

export default App
