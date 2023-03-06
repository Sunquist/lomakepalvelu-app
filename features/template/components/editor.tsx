import { useMantineColorScheme, Paper, Grid, Space, Title, Text, Group, Switch, Badge, createStyles, Select, Accordion, Timeline, Avatar, Divider, TextInput, Chip, JsonInput, ScrollArea, Center, SegmentedControl, Box, useMantineTheme, Tabs  } from '@mantine/core';
import { openConfirmModal } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { showNotification } from '@mantine/notifications';
import { Prism } from '@mantine/prism';
import dynamic from 'next/dynamic'
import useTranslation from "next-translate/useTranslation";

import {
    IconCode,
    IconForms,
    IconGitBranch, 
    IconGitPullRequest, 
    IconGitCommit, 
    IconMessageDots,
    IconDeviceFloppy,
    IconX,
    IconExternalLink,
    IconDeviceDesktop,
    IconDeviceTablet,
    IconSettings,
    IconCpu,
} from '@tabler/icons';

import { FIELDS, FieldTypes } from '../../field';

import Style from './editor.module.css';
import FormStyle from '../../../styles/FormStyles.module.css';
import TemplateModel, { getDefaultTemplate, TemplateType } from '../../../models/template';
import VerifyModel from '../../../utils/VerifyModel';
import EditorFields from './editorFields';
import EditorSettings from './editorSettings';
import EditorAutomations from './editorAutomations';

function FormEditor(props: any) {
  const [hoverArea, setHoverArea] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState(0);
  const [data, setData] = useState<TemplateType>(getDefaultTemplate());
  const [viewMode, setViewMode] = useState('code');
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const { t, lang } = useTranslation("common");

  const onDragEnd = (context: any) => {
    const { destination, source } = context;
    const { droppableId, index } = source;
    setIsDragging(false)

    if((!droppableId || !droppableId.startsWith('stage')) && (!destination))
        return;

    const [stageInfo, stageIndex, sectionInfo, sectionIndex] = droppableId.startsWith('stage')? droppableId.split("_") : destination.droppableId.split("_");
    const stage = data.Stages && data.Stages[parseInt(stageIndex)];
    const section = stage && stage.Sections && stage.Sections[parseInt(sectionIndex)];

    if(!section || !section.Fields)
        return;

    if(droppableId.startsWith('stage')){
        const field = section.Fields[index]
        if(!destination)
            return openConfirmModal({
                title: t("MODAL_CONFIRM_DELETION"),
                centered: true,
                children: (
                  <Text size="sm">
                    {t("MODAL_CONFIRM_DELETION_DESCRIPTION")}
                  </Text>
                ),
                labels: { confirm: t("MODAL_CONFIRM_DELETION_BUTTON_CONFIRM"), cancel: t("MODAL_CONFIRM_DELETION_BUTTON_CANCEL") },
                confirmProps: { color: 'red' },
                onCancel: () => console.log('Cancelled action'),
                onConfirm: () => {
                    //@ts-ignore Null check above
                    section.Fields.splice(index, 1);
                    onChange('Stages', [
                        ...(data.Stages || []).filter((row, index) => index !== parseInt(stageIndex)),
                        {
                            ...stage,
                            Sections: [
                                ...(stage.Sections || []).filter((row, index) => index !== parseInt(sectionIndex)),
                                {
                                    ...section,
                                    Fields: section.Fields
                                }
                            ]
                        }
                    ])
                },
            });

        section.Fields.splice(index, 1)
        section.Fields.splice(destination.index, 0, field)
    }else{
        //@ts-ignore droppableId is a derived from FieldTypes
        const Field = FieldTypes[droppableId][parseInt(index)];
        const newField = Field.getDefault((section.Fields)? section.Fields.length + 1 : 1, t);
        section.Fields.splice(destination.index, 0, newField)
    }

    onChange('Stages', [
        ...(data.Stages || []).filter((row, index) => index !== parseInt(stageIndex)),
        {
            ...stage,
            Sections: [
                ...(stage.Sections || []).filter((row, index) => index !== parseInt(sectionIndex)),
                {
                    ...section,
                    Fields: section.Fields
                }
            ]
        }
    ])
  };

  useEffect(() => {
    
  }, []);

  const onChange = (key: string, value: any) => {
    try{
        setData((_data) => VerifyModel({
            ..._data,
            [key]: value
        }, TemplateModel))
    }catch(ex: any){
        console.log({ex})
        showNotification({
            title: 'Error',
            message: ex.message,
            color: 'red',
            icon: <IconX />,
        })
    }
  } 

  return (
    <div className={Style.FormEditorContainer}>
        <Grid columns={30}>
            <DragDropContext
                onDragEnd={(context: any) => onDragEnd(context)}
                onDragStart={(context: any) => setIsDragging(true)}
                onDragUpdate={(context: any) => {
                    setHoverArea((context && context.destination && context.destination.droppableId)? context.destination.droppableId : null)
                }}
            >
                <Grid.Col span={7}>
                    <Tabs defaultValue="settings" onChange={(evnt) => console.log(evnt)} color="cyan">
                        <Tabs.List grow>
                            <Tabs.Tab value="settings" icon={<IconSettings size={14} />}>{t("EDITOR_TAB_SETTINGS")}</Tabs.Tab>
                            <Tabs.Tab value="fields" icon={<IconForms size={14} />}>{t("EDITOR_TAB_FIELDS")}</Tabs.Tab>
                            <Tabs.Tab value="automations" icon={<IconCpu size={14} />}>{t("EDITOR_TAB_AUTOMATIONS")}</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="settings">
                            <EditorSettings onChange={onChange} data={data} />
                        </Tabs.Panel>

                        <Tabs.Panel value="fields">
                            <EditorFields />
                        </Tabs.Panel>

                        <Tabs.Panel value="automations">
                            <EditorAutomations />
                        </Tabs.Panel>
                    </Tabs>
                </Grid.Col>
                <Grid.Col span={16}>
                    <Center>
                        <SegmentedControl
                            onChange={(value) => {
                                if(value !== "preview")
                                    return setViewMode(value)
                                //Open preview
                                window.open('/','_blank');
                            }}
                            value={viewMode}
                            color="cyan"
                            data={[
                                {
                                    value: 'code',
                                    label: (
                                        <Center>
                                            <IconCode size={16} />
                                            <Box ml={10}>{t("TEMPLATE_EDITOR_SEGMENT_CODE")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'desktop',
                                    label: (
                                        <Center>
                                        <IconDeviceDesktop size={16} />
                                        <Box ml={10}>{t("TEMPLATE_EDITOR_SEGMENT_DESKTOP")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'mobile',
                                    label: (
                                        <Center>
                                        <IconDeviceTablet size={16} />
                                        <Box ml={10}>{t("TEMPLATE_EDITOR_SEGMENT_MOBILE")}</Box>
                                        </Center>
                                    ),
                                },
                                {
                                    value: 'preview',
                                    disabled: true,
                                    label: (
                                        <Center title={t("FEATURE_COMING_SOON")}>
                                            <IconExternalLink size={16} />
                                            <Box ml={10}>{t("TEMPLATE_EDITOR_SEGMENT_PREVIEW")}</Box>
                                        </Center>
                                    ),
                                },
                            ]}
                        />
                    </Center>
                    <Space h="xs" />
                    {
                        (viewMode === "mobile") &&
                        <Center>
                            <div className={(colorScheme === "dark")? Style.smartphoneDark : Style.smartphone}>
                                <div className={Style.smartphoneContent}>
                                    
                                </div>
                            </div>
                        </Center>
                    }
                    {
                        (viewMode === "code" && data && data.Stages && data.Stages.length > 0 && data.Stages[stage] && data.Stages[stage].Sections !== undefined && (data.Stages[stage].Sections?.length || 0) > 0) &&
                        data.Stages[stage].Sections?.map((section, index) => {
                            return (
                                <Center key={`droppable_section_${section.id}`}>
                                    <div className={(data && data.Layout == "contained")? FormStyle.Contained : FormStyle.Filled}>
                                        <Paper radius="sm" p="md" withBorder>
                                            <Droppable droppableId={`stage_${stage}_section_${index}`} direction="vertical">
                                                {(provided: any, snapshot: any) => (
                                                    <div {...provided.droppableProps} style={{ minHeight: 100, padding: 5, paddingBottom: 20, borderRadius: 5, border: snapshot.isDraggingOver ? '1px solid lightblue' : (isDragging)? '1px dashed grey' : '1px solid rgba(0,0,0,0)' }} ref={provided.innerRef}>
                                                        {(!section.Fields || section.Fields.length < 1) &&
                                                            <div>
                                                                <Center>
                                                                    <Title>{t(`TEMPLATE_EDITOR_EMPTY_SECTION_TITLE`)}</Title>
                                                                </Center>
                                                                <Center>
                                                                    <Text color="dimmed" size="sm">
                                                                        {t(`TEMPLATE_EDITOR_EMPTY_SECTION_DESCRIPTION`)}
                                                                    </Text>
                                                                </Center>
                                                            </div>
                                                        }
                                                        {section.Fields?.map((field, i) => {
                                                            try {
                                                                const FieldItem = FIELDS[field.type];
                                                                if(!FieldItem)
                                                                    throw(new Error(`Trying to render field with invalid type ${field.type}`))

                                                                return <FieldItem.renderAdmin field={field} index={i} />
                                                            }catch(ex: any){
                                                                console.log({ex})
                                                                showNotification({
                                                                    title: 'Error',
                                                                    message: ex.message,
                                                                    color: 'red',
                                                                    icon: <IconX />,
                                                                })
                                                            }
                                                            
                                                        })}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </Paper>
                                    </div>
                                </Center>
                            )
                        })
                    }
                </Grid.Col>
                
                <Grid.Col span={7}>
                    <Accordion variant="contained" radius="sm" defaultValue="json">
                        <Accordion.Item value="save">
                            <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconDeviceFloppy size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_SAVEOPTIONS_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_SAVEOPTIONS_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        
                        <Accordion.Item value="versions">
                            <Paper>
                                <Accordion.Control p="xs"> 
                                    <Group noWrap>
                                        <IconGitBranch size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_VERSION_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_VERSION_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Timeline active={2} reverseActive bulletSize={24} lineWidth={2}>
                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title={
                                            <div>Update #12354 <Badge>Development version</Badge></div>
                                        } lineVariant="dashed">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> updated the template</Text>
                                            <Text size="xs" mt={4}>15 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Update #12353" lineVariant="dashed">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> updated the template</Text>
                                            <Text size="xs" mt={4}>42 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitPullRequest size={12} />} title={
                                            <div>Publish #12351 <Badge color="green">Public versio</Badge></div>
                                        }>
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> published version #12351</Text>
                                            <Text size="xs" mt={4}>50 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item bullet={<IconGitCommit size={12} />} title="Update #12351">
                                        <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> updated the template</Text>
                                            <Text size="xs" mt={4}>52 minutes ago</Text>
                                        </Timeline.Item>

                                        <Timeline.Item title="Template created" bullet={<IconMessageDots size={12} />}>
                                            <Text color="dimmed" size="sm"><Text variant="link" component="span" inherit>Jani Sundqvist</Text> created the template</Text>
                                            <Text size="xs" mt={4}>about an hour ago</Text>
                                        </Timeline.Item>
                                    </Timeline>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                        <Accordion.Item value="json">
                            <Paper>
                                <Accordion.Control p="xs">
                                    <Group noWrap>
                                        <IconCode size={24} />
                                        <div>
                                            <Text>{t("TEMPLATE_EDITOR_RAWJSON_TITLE")}</Text>
                                            <Text size="sm" color="dimmed" weight={400}>
                                            {t("TEMPLATE_EDITOR_RAWJSON_DESCRIPTION")}
                                            </Text>
                                        </div>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <ScrollArea.Autosize maxHeight={600} sx={{ maxWidth: 400 }} mx="auto">
                                        <Prism language="json" sx={{ width: 390 }}>
                                            {JSON.stringify(data, null, 2)}
                                        </Prism>
                                    </ScrollArea.Autosize>
                                </Accordion.Panel>
                            </Paper>
                        </Accordion.Item>
                    </Accordion>
                </Grid.Col>
            </DragDropContext>
        </Grid>
    </div>
  );
}

/**
 * Components like Drag and Drop which the editor relies heavily on dosn't support SSR, disable it for the whole component.
 * As this is a admin page for editing templates, SSR is not important
 */
export default dynamic(() => Promise.resolve(FormEditor), { 
    ssr: false 
})