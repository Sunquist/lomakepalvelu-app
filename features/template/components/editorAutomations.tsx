import { Accordion, Group, Paper, Text } from "@mantine/core"
import { Droppable } from 'react-beautiful-dnd';

import {
    IconCode,
    IconForms,
    IconLayout,
    IconCloudDataConnection,
    IconSend,
} from '@tabler/icons';
import DraggableNewField from "./draggableNewField";
import useTranslation from "next-translate/useTranslation";
import { FieldTypes } from '../../field';

export default function EditorAutomations () {
    const { t, lang } = useTranslation("common");

    return (
        <Droppable droppableId="Automations" direction="vertical" isDropDisabled={true}>
            {(provided: any, snapshot: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={{borderRadius: "0px 0px 4px 4px !important"}}>
                    <Accordion defaultValue={"communication"} variant="contained" sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                        <Accordion.Item value="communication">
                            <Paper sx={{borderRadius: "0px 0px 4px 4px !important"}}>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconSend size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_AUTOMATIONS_COMMUNICATION")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                                {t("TEMPLATE_EDITOR_AUTOMATIONS_COMMUNICATION_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        <Accordion.Item value="data">
                        <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconCloudDataConnection size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_AUTOMATIONS_DATA")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_AUTOMATIONS_DATA_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    
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