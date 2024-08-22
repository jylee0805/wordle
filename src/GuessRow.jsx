import PropTypes from "prop-types";

function GuessRow({ state, rowIndex }) {
  return (
    <div className="w-fit h-14 flex gap-2 mb-2 ">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={`w-14 border-2 border-gray-300 rounded-md flex items-center justify-center text-xl ${state.colors[rowIndex][index]}`}>
          {state.inputs[rowIndex][index]}
        </div>
      ))}
    </div>
  );
}

GuessRow.propTypes = {
  state: PropTypes.shape({
    currentRow: PropTypes.number.isRequired,
    inputs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    colors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  }).isRequired,
  rowIndex: PropTypes.number.isRequired,
};
export default GuessRow;
