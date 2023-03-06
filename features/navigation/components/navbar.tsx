import { useEffect, useState } from 'react';
import { Avatar, Navbar, Center, Tooltip, UnstyledButton, createStyles, Stack, Switch, Group, useMantineColorScheme } from '@mantine/core';
import {
  TablerIcon,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconRobot,
  IconClipboardText,
  IconFileDescription,
  IconFolder,
  IconBuilding,
  IconSun,
  IconMoonStars,
  IconHelp,
} from '@tabler/icons';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
    },
  },

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },

  root: {
    position: 'relative',
    '& *': {
      cursor: 'pointer',
    },
  },

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
    top: 3,
  },

  iconLight: {
    left: 4,
    color: theme.white,
  },

  iconDark: {
    right: 4,
    color: theme.colors.gray[6],
  },
}));

interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
  url?: string;
}

function NavbarLink({ icon: Icon, label, active, onClick, url }: NavbarLinkProps) {
  const { classes, cx } = useStyles();
  return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <UnstyledButton onClick={onClick} className={cx(classes.link, { [classes.active]: active })}>
                <Icon stroke={1.5} />
            </UnstyledButton>
        </Tooltip>
    );
}

const navigationData = [
  { icon: IconGauge, label: 'Dashboard', id: "DASHBOARD", url: "/hallinta" },
  { icon: IconFolder, label: 'Templates', id: "TEMPLATE", url: "/hallinta/templates" },
  { icon: IconFileDescription, label: 'Forms', id: "FORMS", url: "/hallinta/forms" },
  { icon: IconClipboardText, label: 'Tasks', id: "TASKS", url: "/hallinta/tasks" },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics', id: "ANALYTICS", url: "/hallinta/analytics" },
  { icon: IconBuilding, label: 'Organisation', id: "ORGANISATION", url: "/hallinta/organisation" },
  { icon: IconSettings, label: 'Settings', id: "SETTINGS", url: "/hallinta/settings" },
  { icon: IconHelp, label: 'Knowledgebank', id: "KNOWLEDGE", url: "/hallinta/help" },
];

export function NavbarMinimal(props: any) {
  const { classes, cx } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [active, setActive] = useState("DASHBOARD");
  const router = useRouter()

  useEffect(() => {
    navigationData.forEach((row) => {
        if(router.pathname.includes(row.url))
            setActive(row.id)
    })
  }, [router.pathname]);

  const links = navigationData.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.id === active}
      onClick={() => {
        //clicked
        router.push(link.url)
        setActive(link.id)
      }}
    />
  ));

  return (
    <Navbar width={{ base: 80 }} p="md">
      <Center>
        <Avatar radius="xl">
            <IconRobot />
        </Avatar>
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack justify="center" spacing={0}>
          <Group position="center" my={30}>
            <div className={classes.root}>
              <IconSun className={cx(classes.icon, classes.iconLight)} size={18} stroke={1.5} />
              <IconMoonStars className={cx(classes.icon, classes.iconDark)} size={18} stroke={1.5} />
              <Switch checked={colorScheme === 'dark'} onChange={() => toggleColorScheme()} size="md" />
            </div>
          </Group>
          <NavbarLink icon={IconSwitchHorizontal} label="Change environment" />
          <NavbarLink icon={IconLogout} label="Logout" onClick={() => {
                //clicked
                router.push("/api/auth/logout")
            }}/>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}