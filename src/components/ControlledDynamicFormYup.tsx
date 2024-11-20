// @ts-nocheck

/* eslint-disable no-unused-vars */
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DevTool } from '@hookform/devtools';
import { Stack, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import testData from './testData2.json';
import { generateSchema } from '../helpers/yupSchema';

type FormValues = {
  username: string;
  questionnaire?: {
    question: string;
    answer_1: string;
    answer_2: string;
    answer_3: string;
  }[];
};

const initialState = {
  question: '',
  answer_1: '',
  answer_2: '',
  answer_3: '',
};

// const schema = yup.object({
//   username: yup.string().required('Username is required'),
//   questionnaire: yup
//     .array(
//       yup.object({
//         question: yup.string().required('Question is required'),
//         answer_1: yup.string().required('Answer 1 is required'),
//         answer_2: yup.string().required('Answer 2 is required'),
//         answer_3: yup.string().required('Answer 3 is required'),
//       }),
//     )
//     .min(1, 'At least one question is required'),
// });

export const ControlledDynamicFormYup = () => {
  const schema = generateSchema(testData);
  console.log('****schema', schema);

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const userNameField = testData.fields.filter(
    (field) => field.field_name === 'username',
  )[0];

  const questionnaireField = testData.fields.filter(
    (field) => field.field_name === 'questionnaire',
  )[0];

  const { control, handleSubmit, formState, watch } = form;
  const { errors } = formState;

  const { fields, append, remove } = useFieldArray({
    name: 'questionnaire',
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log('****form submitted ', data);
  };

  return (
    <div>
      <h1>Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2} width={400}>
          <Controller
            name={userNameField.field_name}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={userNameField.label.en}
                type="text"
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Stack spacing={2}>
            <Typography>{questionnaireField.label.en}</Typography>
            {/* Loop through questionnaire array */}
            {fields.map((field, index) => {
              // Watch the value of 'question' for the current index
              const questionValue = watch(`questionnaire.${index}.question`);
              console.log('****questionValue', questionValue);

              return (
                <Stack
                  key={field.id}
                  border={1}
                  borderRadius={2}
                  padding={2}
                  spacing={2}
                >
                  <Typography variant="h6">Question Set {index + 1}</Typography>
                  {/* Loop through keys of the current questionnaire object */}
                  {Object.keys(field).map((key) => {
                    if (key === 'id') return null; // Skip rendering the `id` key
                    const fieldValues = questionnaireField.fields.find(
                      (f) => f.field_name === key,
                    );

                    return (
                      <Controller
                        key={key}
                        name={
                          `questionnaire.${index}.${key}` as
                            | `questionnaire.${number}.question`
                            | `questionnaire.${number}.answer_1`
                            | `questionnaire.${number}.answer_2`
                            | `questionnaire.${number}.answer_3`
                        }
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={fieldValues?.label.en}
                            type="text"
                            placeholder={fieldValues?.help_text.en}
                            error={
                              !!errors.questionnaire?.[index]?.[
                                key as
                                  | 'question'
                                  | 'answer_1'
                                  | 'answer_2'
                                  | 'answer_3'
                              ]
                            }
                            helperText={
                              errors.questionnaire?.[index]?.[
                                key as
                                  | 'question'
                                  | 'answer_1'
                                  | 'answer_2'
                                  | 'answer_3'
                              ]?.message
                            }
                            onChange={(e) => {
                              field.onChange(e);
                              console.log(
                                `Value changed in ${field.name}: ${e.target.value}`,
                              );
                            }}
                            disabled={key !== 'question' && !questionValue}
                          />
                        )}
                      />
                    );
                  })}
                  {index > 0 && (
                    <button type="button" onClick={() => remove(index)}>
                      Remove Question
                    </button>
                  )}
                </Stack>
              );
            })}
            <button type="button" onClick={() => append(initialState)}>
              Add Question
            </button>
          </Stack>
        </Stack>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
