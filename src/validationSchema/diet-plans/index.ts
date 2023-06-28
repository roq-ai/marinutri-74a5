import * as yup from 'yup';

export const dietPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  user_id: yup.string().nullable(),
});
