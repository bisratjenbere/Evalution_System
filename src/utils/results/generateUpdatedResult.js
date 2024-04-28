const generateUpdatedResult = ({
  evaluatorRole,
  aggregate,
  currentCycle,
  userId,
  department,
  evaluter,
}) => {
  const transformedRole = `by${capitalizeFirstLetter(evaluatorRole)}`;
  let updatedResult;

  switch (evaluatorRole) {
    case "peer":
    case "student":
      updatedResult = {
        [transformedRole]: {
          total: aggregate.total,
          countOfReviewer: aggregate.count,
        },
      };
      break;
    default:
      updatedResult = {
        [transformedRole]: aggregate.total,
      };
  }

  return {
    ...updatedResult,
    cycle: currentCycle,
    department: department,
    evaluatedUserName: userId,
    evaluter,
  };
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default generateUpdatedResult;
