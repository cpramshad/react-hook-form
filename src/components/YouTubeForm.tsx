import React from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

export const YouTubeForm = () => {
  const form = useForm<FormValues>({
    defaultValues: {
      username: 'ramshad',
      email: '',
      channel: '',
    },
  });

  // const form = useForm<FormValues>({
  //   defaultValues: async () => {
  //     const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
  //     const data = await res.json();
  //     return { username: 'Ramshad', email: data.email, channel: '' };
  //   },
  // });
  const { register, control, handleSubmit, formState } = form;
  // const { name, ref, onChange, onBlur } = register('username');

  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    console.log('****form submitted ', data);
  };

  return (
    <div>
      <h1>YouTube Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: {
                value: true,
                message: 'username is required',
              },
            })}
          />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email',
              },
              validate: {
                noAdmin: (filedValue) => {
                  return filedValue !== 'admin@eg.com' || 'Use diff email';
                },
                blackListed: (filedValue) => {
                  return (
                    !filedValue.endsWith('baddomain.com') || 'invalid domain'
                  );
                },
              },
            })}
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input
            type="text"
            id="channel"
            {...register('channel', {
              required: {
                value: true,
                message: 'channel is required',
              },
            })}
          />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
