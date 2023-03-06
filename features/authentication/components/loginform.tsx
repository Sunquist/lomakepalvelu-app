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
import useTranslation from "next-translate/useTranslation";

export function AuthenticationForm(props: PaperProps) {
  const { t, lang } = useTranslation("common");
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      name: (val) => ((val.length < 1)? t("form_empty") : null),
      email: (val) => ((val.length < 1)? t("form_empty") : /^\S+@\S+$/.test(val) ? null : t("register_invalid_email")),
      password: (val) => ((val.length < 1)? t("form_empty") : val.length <= 6 ? t("register_invalid_password") : null),
    },
  });

  return (
    <div className={Styles.loginformContainer}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" weight={500}>
          {t("login_title")}
        </Text>

        <Group grow mb="md" mt="md">
          <MicrosoftButton radius="xl">{t("login_microsoft")}</MicrosoftButton>
        </Group>

        <Divider label={t("login_continue_email")} labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit((values) => {
          console.log(values, type)
        })}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label={t("register_name")}
                placeholder={t("register_name_placeholder")}
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                error={form.errors.name && form.errors.name}
              />
            )}

            <TextInput
              label={t("login_email")}
              placeholder={t("login_email_placeholder")}
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && form.errors.email}
            />

            <PasswordInput
              label={t("login_password")}
              placeholder={t("login_password_placeholder")}
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && form.errors.password}
            />

            {type === 'register' && (
              <Checkbox
                label={t("login_terms")}
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
                ? t("login_existingmember")
                : t("login_newmember")}
            </Anchor>
            <Button type="submit">{t(upperFirst(type))}</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}