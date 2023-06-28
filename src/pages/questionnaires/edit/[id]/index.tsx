import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getQuestionnaireById, updateQuestionnaireById } from 'apiSdk/questionnaires';
import { Error } from 'components/error';
import { questionnaireValidationSchema } from 'validationSchema/questionnaires';
import { QuestionnaireInterface } from 'interfaces/questionnaire';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function QuestionnaireEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<QuestionnaireInterface>(
    () => (id ? `/questionnaires/${id}` : null),
    () => getQuestionnaireById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QuestionnaireInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQuestionnaireById(id, values);
      mutate(updated);
      resetForm();
      router.push('/questionnaires');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<QuestionnaireInterface>({
    initialValues: data,
    validationSchema: questionnaireValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Questionnaire
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="questions" mb="4" isInvalid={!!formik.errors?.questions}>
              <FormLabel>Questions</FormLabel>
              <Input type="text" name="questions" value={formik.values?.questions} onChange={formik.handleChange} />
              {formik.errors.questions && <FormErrorMessage>{formik.errors?.questions}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'questionnaire',
  operation: AccessOperationEnum.UPDATE,
})(QuestionnaireEditPage);
