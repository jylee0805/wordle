import GuessRow from "./GuessRow";
import PropTypes from "prop-types";

function Guess({ state }) {
  return (
    <>
      <div className="w-fit mx-auto mt-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <GuessRow key={index} state={state} rowIndex={index} />
        ))}
      </div>
    </>
  );
}

Guess.propTypes = {
  state: PropTypes.shape({
    currentRow: PropTypes.number.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    colors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  rowIndex: PropTypes.number.isRequired,
};

export default Guess;
