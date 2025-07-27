// Generate a random number with specified digits
const generateNumber = (digits) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a question with specific operation
export const generateQuestionWithOperation = (
  operation,
  leftDigits = 2,
  rightDigits = 2
) => {
  let left, right, answer, question;

  switch (operation) {
    case "addition":
      left = generateNumber(leftDigits);
      right = generateNumber(rightDigits);
      answer = left + right;
      question = `${left} + ${right}`;
      break;

    case "subtraction":
      left = generateNumber(leftDigits);
      right = generateNumber(rightDigits);
      // Ensure positive result
      if (left < right) [left, right] = [right, left];
      answer = left - right;
      question = `${left} - ${right}`;
      break;

    case "multiplication":
      left = generateNumber(leftDigits);
      right = generateNumber(rightDigits);
      answer = left * right;
      question = `${left} × ${right}`;
      break;

    case "division":
      // Generate numbers that divide evenly
      right = generateNumber(rightDigits);
      const multiplier = generateNumber(leftDigits - rightDigits + 1);
      left = right * multiplier;
      answer = multiplier;
      question = `${left} ÷ ${right}`;
      break;

    default:
      // Random operation
      const operations = [
        "addition",
        "subtraction",
        "multiplication",
        "division",
      ];
      const randomOp =
        operations[Math.floor(Math.random() * operations.length)];
      return generateQuestionWithOperation(randomOp, leftDigits, rightDigits);
  }

  return { question, answer };
};

// Generate drill questions for specific topics
export const generateDrillQuestion = (drillType) => {
  switch (drillType) {
    case "addition":
      return generateQuestionWithOperation("addition");

    case "subtraction":
      return generateQuestionWithOperation("subtraction");

    case "multiplication":
      return generateQuestionWithOperation("multiplication");

    case "division":
      return generateQuestionWithOperation("division");

    case "mixed":
      const operations = [
        "addition",
        "subtraction",
        "multiplication",
        "division",
      ];
      const randomOp =
        operations[Math.floor(Math.random() * operations.length)];
      return generateQuestionWithOperation(randomOp);

    default:
      return generateQuestionWithOperation("addition");
  }
};
