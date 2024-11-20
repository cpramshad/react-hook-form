// @ts-nocheck
import * as yup from 'yup';

// Helper function to build Yup validation for a single field
const createFieldValidation = (rules: any) => {
  let validator = yup.string();

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

  // Add custom relational validation
  if (rules.relations && rules.relations.length > 0) {
    rules.relations.forEach((relation: any) => {
      validator = validator.test(
        'relation-required',
        `This field is required because ${relation.relation} is valid.`,
        function (value) {
          const parent = this.parent; // Access the sibling fields in the same object
          const relatedValue = parent[relation.relation]; // Value of the related field
          console.log('***** Related field value:', relatedValue);
          console.log('***** Current field value:', value);

          // Check if the related field is valid and non-blank
          if (
            relation.isValid &&
            typeof relatedValue === 'string' &&
            relatedValue.trim() !== ''
          ) {
            return value && value.trim() !== ''; // Current field must not be blank
          }

          return true; // Pass validation if relation condition is not met
        },
      );
    });
  } else if (rules.required) {
    validator = validator.required('This field is required');
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
