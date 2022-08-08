import type { NextPage } from 'next'

import { FormEditor } from '../features/template';
import { Shell } from '../features/hallintashell';

const DemoPage: NextPage = (props: any) => {
    const { user } = props;

    return (
        <Shell user={user}>
            <FormEditor />
        </Shell>
    )
}

export default DemoPage
