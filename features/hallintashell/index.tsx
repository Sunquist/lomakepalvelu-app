import { MantineProvider, AppShell, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';
import { useState } from 'react';
import { Navbar } from '../navigation';
import { ModalsProvider } from '@mantine/modals';

export const Shell = (props: any) => {
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>((props.user && props.user.Preferences && props.user.Preferences.theme)? props.user.Preferences.theme : preferredColorScheme);
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <ModalsProvider>
                    <NotificationsProvider>
                        <main>
                            <AppShell
                                padding="md"
                                navbar={<Navbar />}
                                styles={(theme) => ({
                                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                                })}
                                >
                                    {props.children}
                            </AppShell>
                        </main>
                    </NotificationsProvider>
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    )
}