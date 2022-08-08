import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import MicrosoftButton from './microsoftButton';
import Styles from '../styles/loginform.module.css';
import { translate } from '../../../utils/translate';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      name: (val) => ((val.length < 1)? translate("form_empty") : null),
      email: (val) => ((val.length < 1)? translate("form_empty") : /^\S+@\S+$/.test(val) ? null : translate("register_invalid_email")),
      password: (val) => ((val.length < 1)? translate("form_empty") : val.length <= 6 ? translate("register_invalid_password") : null),
    },
  });

  return (
    <div className={Styles.loginformContainer}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          {translate("login_title")}
        </Text>

        <Group grow mb="md" mt="md">
          <MicrosoftButton radius="xl">{translate("login_microsoft")}</MicrosoftButton>
        </Group>

        <Divider label={translate("login_continue_email")} labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit((values) => {
          console.log(values, type)
        })}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label={translate("register_name")}
                placeholder={translate("register_name_placeholder")}
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                error={form.errors.name && form.errors.name}
              />
            )}

            <TextInput
              label={translate("login_email")}
              placeholder={translate("login_email_placeholder")}
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && form.errors.email}
            />

            <PasswordInput
              label={translate("login_password")}
              placeholder={translate("login_password_placeholder")}
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && form.errors.password}
            />

            {type === 'register' && (
              <Checkbox
                label={translate("login_terms")}
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? translate("login_existingmember")
                : translate("login_newmember")}
            </Anchor>
            <Button type="submit">{translate(upperFirst(type))}</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}