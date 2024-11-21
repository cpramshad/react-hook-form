/**
 * Answer_1 should be disabled if no value is question
 * Answer_2 should be disabled if no value in answer_3
 * Answer_3 should be disabled if no value in answer_2
 */
export const shouldDisableField = (
  currentObject: Record<string, string>,
  currentField: string,
): boolean => {
  const fieldOrder = ['question', 'answer_1', 'answer_2', 'answer_3'];

  // Find the index of the current field in the fieldOrder
  const currentIndex = fieldOrder.indexOf(currentField);

  if (currentIndex === 0) {
    // First field (question) is never disabled
    return false;
  }

  // Get the previous field
  const previousField = fieldOrder[currentIndex - 1];

  // Disable if the previous field's value is empty
  return !currentObject[previousField];
};
