import { Button, ButtonProps, Group } from '@mantine/core';

export default function MicrosoftButton(props: ButtonProps & React.ComponentPropsWithoutRef<'a'>) {
    return (
      <Button
        component="a"
        leftIcon={<MicrosoftIcon color="#00ACEE" />}
        onClick={() => {
          const _window: Window = window;
          _window.location = "/api/auth/ms/login"
        }}
        variant="default"
        {...props}
      />
    );
}

function MicrosoftIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><title>MS-SymbolLockup</title><rect x="1" y="1" width="9" height="9" fill="#f25022"/><rect x="1" y="11" width="9" height="9" fill="#00a4ef"/><rect x="11" y="1" width="9" height="9" fill="#7fba00"/><rect x="11" y="11" width="9" height="9" fill="#ffb900"/></svg>
  );
}