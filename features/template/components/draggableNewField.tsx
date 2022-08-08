import { Paper, Grid, Space, Title, Text, Card, Group, Badge, createStyles, Center } from '@mantine/core';
import { Draggable } from 'react-beautiful-dnd';

import {
    IconForms,
    IconSelect
} from '@tabler/icons';

import { translate } from '../../../utils/translate';

const useStyles = createStyles((theme) => ({
    item: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        border: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        marginBottom: 5,
        marginTop: 5
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
        width: 500,
    },

    symbol: {
        fontSize: 20,
        fontWeight: 700,
        marginRight: 10,
        marginTop: 8
    },
}));

/**
 * 
 * @param {string} IconName
 * @returns {TablerIcon} TablerIcon
 */
function resolveIcon(IconName: string) {
    switch(IconName){
        case "select":
            return <IconSelect stroke={1.5} />
        case "field":
        default:
            return <IconForms stroke={1.5} />
    }
}

export default function DraggableNewField(props: any)  {
    const { classes, cx } = useStyles();

    return (
        <Draggable key={props.id} index={props.index} draggableId={props.id}>
            {(provided: any, snapshot: any) => (
                <div
                className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                <Center>
                    <Text className={classes.symbol}>{resolveIcon(translate(`field_${props.field.type}_icon`))}</Text>
                </Center>
                <div>
                    <Text>{translate(`field_${props.field.type}_label`)}</Text>
                    <Text color="dimmed" size="sm">
                        {translate(`field_${props.field.type}_description`)}
                    </Text>
                </div>
                </div>
            )}
        </Draggable>
    )
}
