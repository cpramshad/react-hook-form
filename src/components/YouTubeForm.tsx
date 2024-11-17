import React from 'react';
import { useForm } from 'react-hook-form';

export const YouTubeForm = () => {
  const form = useForm();
  const { register } = form;

  const { name, ref, onChange, onBlur } = register('username');

  return (
    <div>
      <h1>YouTube Form</h1>

      <form>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name={name}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
        />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />

        <label htmlFor="channel">Channel</label>
        <input type="text" id="channel" name="channel" />

        <button>Submit</button>
      </form>
    </div>
  );
};
