import * as yup from 'yup';

// Helper function to build Yup validation for a single field
const createFieldValidation = (rules: any, fieldName: string) => {
  console.log(`*****createFieldValidation of ${fieldName}`, rules);
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
  if (rules.required) {
    if (rules.relations && rules.relations.length > 0) {
      rules.relations.forEach((relation: any) => {
        validator = validator.test(
          'relation-required',
          `This field is required because ${relation.relation} is valid.`,
          function (value) {
            const parent = this.parent; // Access sibling fields
            console.log('*****parent', parent);
            const relatedValue = parent[relation.relation]; // Value of the related field
            console.log('***** Related field value:', relatedValue);
            console.log('***** Current field value:', value);

            // Check if the related field is valid and non-blank
            if (
              relation.isValid &&
              typeof relatedValue === 'string' &&
              relatedValue.trim() !== ''
            ) {
              // Return false if current field is empty
              return !!value && value.trim() !== '';
            }

            // Pass validation if the related condition is not met
            return true;
          },
        );
      });
    } else {
      validator = validator.required('This field is required');
    }
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
          [field.field_name]: createFieldValidation(
            field.validation_rules,
            field.field_name,
          ),
        }),
        {},
      ),
    ),
  );

  return yup.object({
    [usernameField.field_name]: createFieldValidation(
      usernameField.validation_rules,
      usernameField.field_name,
    ),
    [questionnaireField.field_name]: questionnaireSchema,
  });
};
