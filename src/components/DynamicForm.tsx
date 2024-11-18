/* eslint-disable no-unused-vars */
import { useForm, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { Box, Stack, TextField } from '@mui/material';

type FormValues = {
  username: string;
  questionnaire: {
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
  }[];
};

const initialState = {
  question: '',
  answer1: '',
  answer2: '',
  answer3: '',
};

export const DynamicForm = () => {
  const form = useForm<FormValues>();

  const { register, control, handleSubmit, formState } = form;
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
          <TextField
            label="Username"
            type="text"
            {...register('username', {
              required: {
                value: true,
                message: 'username is required',
              },
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <Stack spacing={2}>
            <h3>Questions</h3>
            {fields.map((field, index) => {
              return (
                // eslint-disable-next-line react/jsx-key
                <Box>
                  <TextField
                    label="Question"
                    type="text"
                    {...register(`questionnaire.${index}.question`, {
                      required: {
                        value: true,
                        message: 'Question is required',
                      },
                    })}
                    error={!!errors.questionnaire?.[index]?.question}
                    helperText={
                      errors.questionnaire?.[index]?.question?.message
                    }
                  />
                </Box>
              );
            })}
            <button type="button" onClick={() => append(initialState)}>
              Add Phone
            </button>
          </Stack>
        </Stack>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
