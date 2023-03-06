import { Paper, Grid, Space, Title, Text, Card, Group, Badge, createStyles, Center } from '@mantine/core';
import { Draggable } from 'react-beautiful-dnd';

import {
    IconForms,
    IconSelect
} from '@tabler/icons';

import useTranslation from "next-translate/useTranslation";

const useStyles = createStyles((theme) => ({
    item: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        border: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
        padding: `10px ${theme.spacing.lg}px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        marginBottom: 5,
        marginTop: 5
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
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

export default function DraggableTextFieldAdmin(props: any)  {
    const { classes, cx } = useStyles();
    const { t, lang } = useTranslation("common");

    return (
        <Draggable key={props.field.id} index={props.index} draggableId={props.field.id}>
            {(provided: any, snapshot: any) => (
                <div
                className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                >
                <Center>
                    <Text className={classes.symbol}>{resolveIcon(t(`field_${props.field.type}_icon`))}</Text>
                </Center>
                <div>
                    <Text>{t(props.field.label)}</Text>
                    <Text color="dimmed" size="sm">
                        {t(`field_${props.field.type}_label`)}
                    </Text>
                </div>
                </div>
            )}
        </Draggable>
    )
}
