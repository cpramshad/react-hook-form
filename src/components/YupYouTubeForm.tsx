import React from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormValues = {
  username: string;
  email: string;
  channel: string;
};

const schema = yup.object({
  username: yup.string().required('username is required'),
  email: yup
    .string()
    .email('Email format is invalid')
    .required('email is required'),
  channel: yup.string().required('channel is required'),
});

export const YupYouTubeForm = () => {
  const form = useForm<FormValues>({ resolver: yupResolver(schema) });
  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  // const { name, ref, onChange, onBlur } = register('username');

  const onSubmit = (data: FormValues) => {
    console.log('****form submitted ', data);
  };

  return (
    <div>
      <h1>YouTube Form</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-control">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register('username')} />
          <p className="error">{errors.username?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register('email')} />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-control">
          <label htmlFor="channel">Channel</label>
          <input type="text" id="channel" {...register('channel')} />
          <p className="error">{errors.channel?.message}</p>
        </div>

        <button>Submit</button>
      </form>
      <DevTool control={control} />
    </div>
  );
};
