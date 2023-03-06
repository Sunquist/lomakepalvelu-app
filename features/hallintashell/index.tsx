import { AppShell } from '@mantine/core';
import { Navbar } from '../navigation';

export const Shell = (props: any) => {

    return (
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
    )
}