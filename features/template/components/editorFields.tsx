import { Accordion, Group, Paper, Text } from "@mantine/core"
import { Droppable } from 'react-beautiful-dnd';

import {
    IconCode,
    IconForms,
    IconLayout,
} from '@tabler/icons';
import DraggableNewField from "./draggableNewField";
import { FieldTypes } from '../../field';
import useTranslation from "next-translate/useTranslation";

export default function EditorFields () {
    const { t, lang } = useTranslation("common");

    return (
        <Droppable droppableId="BasicTypes" direction="vertical" isDropDisabled={true}>
            {(provided: any, snapshot: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{borderRadius: "0px 0px 4px 4px !important"}}>
                    <Accordion defaultValue={"basic"} variant="contained" sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                        <Accordion.Item value="basic">
                            <Paper sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconForms size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_FIELDS_BASIC")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                                {t("TEMPLATE_EDITOR_FIELDS_BASIC_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {FieldTypes.BasicTypes.map((field, index) => {
                                        return (<DraggableNewField key={`${field.type}_${index}_key`} id={`field_${field.type}_${index}`} field={field} index={index} />)
                                    })}
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        <Accordion.Item value="advanced">
                        <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconCode size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_FIELDS_ADVANCED")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_FIELDS_ADVANCED_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {FieldTypes.BasicTypes.map((field, index) => {
                                        return (<DraggableNewField key={`${field.type}_${index}_key_2`} id={`field_${field.type}_${index}_2`} field={field} index={index} />)
                                    })}
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        <Accordion.Item value="Layout">
                            <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconLayout size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_FIELDS_LAYOUT")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_FIELDS_LAYOUT_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {FieldTypes.BasicTypes.map((field, index) => {
                                        return (<DraggableNewField key={`${field.type}_${index}_key_3`} id={`field_${field.type}_${index}_3`} field={field} index={index} />)
                                    })}
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                    </Accordion>  
                    {provided.placeholder} 
                </div>    
                )}       
        </Droppable>
    )
}