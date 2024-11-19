import * as yup from 'yup';

// Helper function to build Yup validation for a single field
const createFieldValidation = (rules: any) => {
  let validator = yup.string();

  if (rules.required) {
    validator = validator.required('This field is required');
  }

  if (rules.min_length) {
    validator = validator.min(
      rules.min_length,
      `Minimum length is ${rules.min_length}`,
    );
  }

  if (rules.max_length) {
    validator = validator.max(
      rules.max_length,
      `Maximum length is ${rules.max_length}`,
    );
  }

  if (rules.regex) {
    validator = validator.matches(new RegExp(rules.regex), 'Invalid format');
  }

  return validator;
};

// Generate the Yup schema dynamically
export const generateSchema = (testData: any) => {
  const usernameField = testData.fields.find(
    (field: any) => field.field_name === 'username',
  );

  const questionnaireField = testData.fields.find(
    (field: any) => field.field_name === 'questionnaire',
  );

  const questionnaireSchema = yup.array().of(
    yup.object(
      questionnaireField.fields.reduce(
        (acc: any, field: any) => ({
          ...acc,
          [field.field_name]: createFieldValidation(field.validation_rules),
        }),
        {},
      ),
    ),
  );

  return yup.object({
    [usernameField.field_name]: createFieldValidation(
      usernameField.validation_rules,
    ),
    [questionnaireField.field_name]: questionnaireSchema,
  });
};
