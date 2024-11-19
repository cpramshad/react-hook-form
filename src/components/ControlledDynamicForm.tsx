/* eslint-disable no-unused-vars */
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { Box, Stack, TextField, Typography } from '@mui/material';
import testData from './testData.json';

type FormValues = {
  username: string;
  questionnaire: {
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

export const ControlledDynamicForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      questionnaire: [
        {
          question: 'What is react?',
          answer_1: 'UI Library',
          answer_2: 'Server',
          answer_3: 'DB',
        },
      ],
    },
  });

  const { control, handleSubmit, formState } = form;
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
            name="username"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Username is required',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                type="text"
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          <Stack spacing={2}>
            <Typography>{testData.label.en}</Typography>
            {/* Loop through questionnaire array */}
            {fields.map((field, index) => {
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
                    const fieldValues = testData.fields.find(
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
                        rules={{
                          required: {
                            value: true,
                            message: `${key} is required`,
                          },
                        }}
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
